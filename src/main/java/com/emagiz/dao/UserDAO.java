package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.User;
import jakarta.ws.rs.core.Response;
import org.mindrot.jbcrypt.BCrypt;

import javax.xml.crypto.Data;
import java.net.ConnectException;
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
        String sql = "INSERT INTO user_tokens (token, user_id) VALUES (?, ?)";
        try(Connection connection = DatabaseConfig.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, token);
            preparedStatement.setLong(2, id);

            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Long getUserIdByToken(String token){
        String sql = "SELECT user_id FROM user_tokens WHERE token = ?";
        try(Connection conn = DatabaseConfig.getConnection()) {
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setString(1, token);
            ResultSet resultSet = preparedStatement.executeQuery();



            if (resultSet.next()){
                return resultSet.getLong("user_id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

}
