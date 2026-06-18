package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.CommentResponse;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CommentDAO {
    private AuditLogDAO auditLogDAO = new AuditLogDAO();

    public CommentResponse addComment(Long ticketID, Long userID, String text, Boolean isInternal) {
        String sql = """
                INSERT INTO comments (ticket_id, user_id, content, is_internal, created_at)
                VALUES (?, ?, ?, ?, ?)
                RETURNING comment_id, created_at
                """;

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, ticketID);
            stmt.setLong(2, userID);
            stmt.setString(3, text);
            stmt.setBoolean(4, isInternal);
            stmt.setTimestamp(5, Timestamp.valueOf(LocalDateTime.now()));

            try (ResultSet resultSet = stmt.executeQuery()) {
                if (resultSet.next()) {
                    auditLogDAO.saveLog(ticketID.intValue(), userID.intValue(), "COMMENT_ADDED");
                    return findById(resultSet.getLong("comment_id"));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to add comment", e);
        }
        return null;
    }

    public List<CommentResponse> findByTicketId(Long ticketId, boolean includeInternal) {
        List<CommentResponse> comments = new ArrayList<>();
        String sql = """
                SELECT c.comment_id, c.user_id, c.content, c.is_internal, c.created_at,
                       u.username, u.role
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.ticket_id = ?
                """ + (includeInternal ? "" : " AND c.is_internal = false ") + """
                ORDER BY c.created_at ASC
                """;

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, ticketId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    comments.add(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to load comments", e);
        }

        return comments;
    }

    private CommentResponse findById(Long commentId) {
        String sql = """
                SELECT c.comment_id, c.user_id, c.content, c.is_internal, c.created_at,
                       u.username, u.role
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.comment_id = ?
                """;

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, commentId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to load comment", e);
        }

        return null;
    }

    private CommentResponse mapRow(ResultSet rs) throws SQLException {
        return new CommentResponse(
                rs.getLong("comment_id"),
                rs.getLong("user_id"),
                rs.getString("username"),
                rs.getString("role"),
                rs.getString("content"),
                rs.getBoolean("is_internal"),
                rs.getTimestamp("created_at")
        );
    }
}
