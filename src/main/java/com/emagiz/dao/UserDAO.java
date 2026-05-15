package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.User;

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
            pstmt.setString(3, user.getPassword());
            pstmt.setString(4, user.getRole());
            pstmt.setString(5, user.getCompany());

            pstmt.executeUpdate();

            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    user.setId(generatedKeys.getLong(1));
                }
            }

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
}
