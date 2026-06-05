package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.User;
import org.mindrot.jbcrypt.BCrypt;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {
    public User save(User user) {
        String sql = "INSERT INTO users (username, email, password, role, company) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, java.sql.Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getEmail());
            String hashedEntry = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
            pstmt.setString(3, hashedEntry);
            pstmt.setString(4, user.getRole());
            pstmt.setString(5, user.getCompany());

            pstmt.executeUpdate();

            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    user.setId(generatedKeys.getLong(1));
                }
            }
            user.setPassword(null);

            return user;

        } catch (SQLException e) {
            throw new RuntimeException("Error while saving: " + e.getMessage());
        }
    }

    public List<User> findAll() throws SQLException {
        List<User> users = new ArrayList<>();
        String sql = "SELECT * FROM users";

        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                User u = new User();
                u.setId(rs.getLong("id"));
                u.setUsername(rs.getString("username"));
                u.setEmail(rs.getString("email"));
                u.setRole(rs.getString("role"));
                u.setCompany(rs.getString("company"));
                users.add(u);
            }
        }
        return users;
    }

    public User validateUserLogin(String username, String password){
        String sql = "SELECT * FROM users WHERE username = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setString(1, username);
            ResultSet resultSet =  pstmt.executeQuery();

            if (resultSet.next()){
                String hashedPassword = resultSet.getString("password");
                if (BCrypt.checkpw(password, hashedPassword)){
                    User user = new User();
                    user.setId(resultSet.getLong("id"));
                    user.setUsername(resultSet.getString("username"));
                    user.setEmail(resultSet.getString("email"));
                    user.setRole(resultSet.getString("role"));
                    return user;

                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

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

    public User findUserByEmail(String email){
        String sql = "SELECT * FROM users WHERE email = ?";

        try(Connection connection = DatabaseConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(sql)
        ) {
           preparedStatement.setString(1, email);
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
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

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

    public void updatePassword(Long userId, String hashedPassword){
        String sql = "UPDATE users SET password = ? WHERE id = ?";
        try(Connection connection = DatabaseConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, hashedPassword);
            preparedStatement.setLong(2, userId);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

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
}
