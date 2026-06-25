package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.User;
import org.mindrot.jbcrypt.BCrypt;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Reads / writes the users table and auth-related tables
 * (user_tokens, password_reset_tokens).
 *
 * <p>Passwords are bcrypt-hashed. Soft-deleted users keep their id but
 * get role "DELETED" and an anonymized profile.</p>
 */
public class UserDAO {
    private static final String DELETED_ROLE = "DELETED";
    private AuditLogDAO auditLogDAO = new AuditLogDAO();

    /**
     * Inserts a user, hashes the password with bcrypt, writes a
     * USER_CREATED audit entry and clears the plain password field
     * on the returned object.
     *
     * @throws RuntimeException if the insert fails
     */
    public User save(User user) {
        String sql = "INSERT INTO users (username, email, password, role, company) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, java.sql.Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getEmail());
            String hashedEntry = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
            pstmt.setString(3, hashedEntry);
            pstmt.setString(4, user.getRole() == null ? null : user.getRole().trim().toUpperCase());
            pstmt.setString(5, user.getCompany());

            pstmt.executeUpdate();

            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    user.setId(generatedKeys.getLong(1));
                    auditLogDAO.saveLog(null, user.getId().intValue(), "USER_CREATED");
                }
            }
            user.setPassword(null);

            return user;

        } catch (SQLException e) {
            throw new RuntimeException("Error while saving: " + e.getMessage());
        }
    }

    /** Returns every non-deleted user. */
    public List<User> findAll() throws SQLException {
        List<User> users = new ArrayList<>();
        String sql = "SELECT * FROM users WHERE UPPER(role) != ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, DELETED_ROLE);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    users.add(mapUserRow(rs));
                }
            }
        }
        return users;
    }

    private User mapUserRow(ResultSet rs) throws SQLException {
        User u = new User();
        u.setId(rs.getLong("id"));
        u.setUsername(rs.getString("username"));
        u.setEmail(rs.getString("email"));
        u.setRole(rs.getString("role"));
        u.setCompany(rs.getString("company"));
        return u;
    }

    /**
     * Checks the username/password against the users table.
     *
     * @return the user (no password) or null if login failed
     */
    public User validateUserLogin(String username, String password){
        String sql = "SELECT * FROM users WHERE username = ? AND UPPER(role) != ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setString(1, username);
            pstmt.setString(2, DELETED_ROLE);
            ResultSet resultSet =  pstmt.executeQuery();

            if (resultSet.next()){
                String hashedPassword = resultSet.getString("password");
                if (BCrypt.checkpw(password, hashedPassword)){
                    User user = new User();
                    user.setId(resultSet.getLong("id"));
                    user.setUsername(resultSet.getString("username"));
                    user.setEmail(resultSet.getString("email"));
                    user.setRole(resultSet.getString("role"));
                    user.setCompany(resultSet.getString("company"));
                    return user;

                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /** Saves a session token, valid for 24h. */
    public void saveToken(String token, Long id){
        String sql = "INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?);";
        try(Connection connection = DatabaseConfig.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setLong(1, id);
            preparedStatement.setString(2, token);
            java.time.LocalDateTime expireTime = java.time.LocalDateTime.now().plusHours(24);
            preparedStatement.setTimestamp(3, java.sql.Timestamp.valueOf(expireTime));

            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Looks up the user id behind a session token.
     * Returns null if the token is missing or expired.
     */
    public Long getUserIdByToken(String token){
        String sql = "SELECT user_id FROM user_tokens WHERE token = ? AND expires_at > ?;";
        try(Connection conn = DatabaseConfig.getConnection()) {
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setString(1, token);
            preparedStatement.setTimestamp(2, java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()));
            ResultSet resultSet = preparedStatement.executeQuery();



            if (resultSet.next()){
                return resultSet.getLong("user_id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /** Finds a non-deleted user by id, null if not found. */
    public User findById(Long id) {
        String sql = "SELECT id, username, email, role, company FROM users WHERE id = ? AND UPPER(role) != ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            pstmt.setString(2, DELETED_ROLE);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return mapUserRow(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    /** Like findById but also returns soft-deleted users. */
    public User findByIdIncludingDeleted(Long id) {
        String sql = "SELECT id, username, email, role, company FROM users WHERE id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return mapUserRow(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    /** Finds a non-deleted user by email. */
    public User findUserByEmail(String email){
        String sql = "SELECT * FROM users WHERE email = ? AND UPPER(role) != ?";

        try(Connection connection = DatabaseConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(sql)
        ) {
           preparedStatement.setString(1, email);
           preparedStatement.setString(2, DELETED_ROLE);
           ResultSet resultSet = preparedStatement.executeQuery();
           if (resultSet.next()){
               User user = new User();
               user.setId(resultSet.getLong("id"));
               user.setUsername(resultSet.getString("username"));
               user.setEmail(resultSet.getString("email"));
               user.setRole(resultSet.getString("role"));
               user.setCompany(resultSet.getString("company"));
               return user;
           }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    /** Saves a password-reset token, valid for 30 minutes. */
    public void savePasswordResetToken(Long userId, String token){
        String sql = "INSERT INTO password_reset_tokens (user_id, token, expires_at, used) VALUES (?, ?, ?, ?)";
        try (Connection connection = DatabaseConfig.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)
        ){
            preparedStatement.setLong(1, userId);
            preparedStatement.setString(2, token);
            java.time.LocalDateTime expireTime = java.time.LocalDateTime.now().plusMinutes(30);
            preparedStatement.setTimestamp(3, java.sql.Timestamp.valueOf(expireTime));
            preparedStatement.setBoolean(4, false);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /** Returns the user id for a valid reset token, null otherwise. */
    public Long getUserIdByResetToken(String resetToken){
        String sql = "SELECT user_id FROM password_reset_tokens " +
                "WHERE token = ? AND expires_at > ? AND used = false";

        try(Connection connection = DatabaseConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, resetToken);
            preparedStatement.setTimestamp(2, java.sql.Timestamp.valueOf(java.time.LocalDateTime.now()));
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()){
                return resultSet.getLong("user_id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /** Sets a new (hashed) password and writes a PASSWORD_UPDATED audit. */
    public void updatePassword(Long userId, String hashedPassword){
        String sql = "UPDATE users SET password = ? WHERE id = ?";
        try(Connection connection = DatabaseConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, hashedPassword);
            preparedStatement.setLong(2, userId);
            preparedStatement.executeUpdate();
            auditLogDAO.saveLog(null, userId.intValue(), "PASSWORD_UPDATED");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /** Marks a reset token as used so it can't be reused. */
    public void makeResetTokenUsed(String token){
        String sql = "UPDATE password_reset_tokens SET used = true WHERE token = ?";
        try(Connection connection = DatabaseConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, token);
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /** Returns the user's role or null if not found. */
    public String getUserRole(Long userId) {
        String sql = "SELECT role FROM users WHERE id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, userId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("role");
                }
            }
        } catch (SQLException e) {
            System.err.println("Error while getting role: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    /**
     * True if the user has any ticket that isn't DENIED or CLOSED.
     * Used to block deletion of users with open work.
     */
    public boolean hasActiveTickets(Long userId) throws SQLException {
        String sql = """
                SELECT 1 FROM tickets
                WHERE (creator_id = ? OR assignee_id = ?)
                  AND UPPER(status) NOT IN ('DENIED', 'CLOSED')
                LIMIT 1
                """;

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            stmt.setLong(2, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    /**
     * Soft-deletes a user: removes their tokens, anonymizes the
     * profile, sets role to DELETED. Returns false if the user
     * doesn't exist or was already deleted.
     *
     * @throws IllegalStateException if the user has active tickets
     * @throws SQLException          on DB failure (rolled back)
     */
    public boolean deleteById(Long userId) throws SQLException {
        User user = findByIdIncludingDeleted(userId);
        if (user == null || DELETED_ROLE.equalsIgnoreCase(user.getRole())) {
            return false;
        }

        if (hasActiveTickets(userId)) {
            throw new IllegalStateException("User has active tickets and cannot be deleted");
        }

        try (Connection conn = DatabaseConfig.getConnection()) {
            conn.setAutoCommit(false);
            try {
                runUpdate(conn, "DELETE FROM user_tokens WHERE user_id = ?", userId);
                runUpdate(conn, "DELETE FROM password_reset_tokens WHERE user_id = ?", userId);

                String anonymizeSql = """
                        UPDATE users
                        SET username = ?, email = ?, password = ?, role = ?, company = NULL
                        WHERE id = ?
                        """;
                try (PreparedStatement stmt = conn.prepareStatement(anonymizeSql)) {
                    stmt.setString(1, "Deleted User (u" + userId + ")");
                    stmt.setString(2, "deleted+u" + userId + "@removed.local");
                    stmt.setString(3, BCrypt.hashpw(java.util.UUID.randomUUID().toString(), BCrypt.gensalt()));
                    stmt.setString(4, DELETED_ROLE);
                    stmt.setLong(5, userId);
                    int updated = stmt.executeUpdate();
                    conn.commit();
                    return updated > 0;
                }
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }

    private int runUpdate(Connection conn, String sql, Long userId) throws SQLException {
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            return stmt.executeUpdate();
        }
    }
}
