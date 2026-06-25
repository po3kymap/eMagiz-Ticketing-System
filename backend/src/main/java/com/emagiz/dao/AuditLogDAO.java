package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.AuditLog;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Reads / writes the audit_logs table.
 *
 * Writes are best-effort — if saveLog fails it just prints the error
 * and moves on, so an audit problem can't break the main action.
 */
public class AuditLogDAO {
    /** Same as saveLog(...) but without details. */
    public void saveLog(Integer ticketId, Integer userId, String action) {
        saveLog(ticketId, userId, action, null);
    }

    /**
     * Inserts one audit row. If the details column isn't writable (older
     * schema) falls back to saveLogWithoutDetails.
     *
     * @param ticketId ticket id, or null for system events
     * @param userId   who did it
     * @param action   short action code, e.g. USER_CREATED
     * @param details  optional extra context, may be null
     */
    public void saveLog(Integer ticketId, Integer userId, String action, String details) {
        String sql = "INSERT INTO audit_logs (ticket_id, user_id, action, details) VALUES (?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setObject(1, ticketId);
            stmt.setObject(2, userId);
            stmt.setString(3, action);
            stmt.setString(4, details);

            stmt.executeUpdate();
            System.out.println("Action : " + action + " (User ID: " + userId + ")");

        } catch (SQLException e) {
            if (details != null) {
                saveLogWithoutDetails(ticketId, userId, action);
                return;
            }
            System.err.println("Error while saving to audit_logs: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void saveLogWithoutDetails(Integer ticketId, Integer userId, String action) {
        String sql = "INSERT INTO audit_logs (ticket_id, user_id, action) VALUES (?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setObject(1, ticketId);
            stmt.setObject(2, userId);
            stmt.setString(3, action);
            stmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error while saving to audit_logs: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void mapRow(ResultSet rs, AuditLog log) throws SQLException {
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

        try {
            log.setDetails(rs.getString("details"));
        } catch (SQLException ignored) {
            log.setDetails(null);
        }
    }

    /** Returns every audit row, newest first. */
    public List<AuditLog> getAllLogs() {
        List<AuditLog> logs = new ArrayList<>();
        String query = "SELECT * FROM audit_logs ORDER BY created_at DESC";

        try (Connection conn = DatabaseConfig.getConnection(); // твой коннект
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                AuditLog log = new AuditLog();
                mapRow(rs, log);
                logs.add(log);
            }
        } catch (SQLException e) {
            System.err.println("Error, while getting logs: " + e.getMessage());
            e.printStackTrace();
        }
        return logs;
    }

    /** Returns audit rows for one ticket, oldest first. */
    public List<AuditLog> getLogsByTicketId(Long ticketId) {
        List<AuditLog> logs = new ArrayList<>();
        String query = "SELECT * FROM audit_logs WHERE ticket_id = ? ORDER BY created_at ASC";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setLong(1, ticketId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    AuditLog log = new AuditLog();
                    mapRow(rs, log);
                    logs.add(log);
                }
            }
        } catch (SQLException e) {
            System.err.println("Error while getting ticket audit logs: " + e.getMessage());
            e.printStackTrace();
        }
        return logs;
    }
}
