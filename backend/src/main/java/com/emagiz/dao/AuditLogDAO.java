package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.AuditLog;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AuditLogDAO {
    public void saveLog(Integer ticketId, Integer userId, String action) {
        String sql = "INSERT INTO audit_logs (ticket_id, user_id, action) VALUES (?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setObject(1, ticketId);
            stmt.setObject(2, userId);
            stmt.setString(3, action);

            stmt.executeUpdate();
            System.out.println("Action : " + action + " (User ID: " + userId + ")");

        } catch (SQLException e) {
            System.err.println("Error while saving to audit_logs: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<AuditLog> getAllLogs() {
        List<AuditLog> logs = new ArrayList<>();
        String query = "SELECT * FROM audit_logs ORDER BY created_at DESC";

        try (Connection conn = DatabaseConfig.getConnection(); // твой коннект
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                AuditLog log = new AuditLog();
                log.setId(rs.getInt("id"));

                int ticketId = rs.getInt("ticket_id");
                if (rs.wasNull()) {
                    log.setTicketId(null);
                } else {
                    log.setTicketId(ticketId);
                }

                log.setUserId(rs.getInt("user_id"));
                log.setAction(rs.getString("action"));
                log.setCreatedAt(rs.getTimestamp("created_at"));

                logs.add(log);
            }
        } catch (SQLException e) {
            System.err.println("Error, while getting logs: " + e.getMessage());
            e.printStackTrace();
        }
        return logs;
    }
}
