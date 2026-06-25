package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.CommentResponse;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Reads / writes the comments table.
 *
 * <p>Comments belong to tickets and may be marked is_internal
 * (visible to staff only). Reads return CommentResponse which also
 * joins the author username/role from the users table.</p>
 */
public class CommentDAO {

    /**
     * Inserts a comment and returns it fully populated (with author
     * info and server-side created_at). Returns null only if the
     * insert succeeded but no id was returned.
     *
     * @throws RuntimeException if the SQL fails
     */
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

            stmt.execute();

            try (ResultSet resultSet = stmt.getResultSet()) {
                if (resultSet != null && resultSet.next()) {
                    return findById(resultSet.getLong("comment_id"));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to add comment: " + e.getMessage(), e);
        }
        return null;
    }

    /**
     * Returns all comments for a ticket, oldest first.
     *
     * @param ticketId        ticket whose comments to load
     * @param includeInternal if false, internal notes are hidden
     *                        (used when the caller is a customer)
     */
    public List<CommentResponse> findByTicketId(Long ticketId, boolean includeInternal) {
        List<CommentResponse> comments = new ArrayList<>();
        String sql = """
                SELECT c.comment_id, c.user_id, c.content, c.is_internal, c.created_at,
                       u.username, u.role
                FROM comments c
                LEFT JOIN users u ON c.user_id = u.id
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
            throw new RuntimeException("Failed to load comments: " + e.getMessage(), e);
        }

        return comments;
    }

    private CommentResponse findById(Long commentId) {
        String sql = """
                SELECT c.comment_id, c.user_id, c.content, c.is_internal, c.created_at,
                       u.username, u.role
                FROM comments c
                LEFT JOIN users u ON c.user_id = u.id
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
            throw new RuntimeException("Failed to load comment: " + e.getMessage(), e);
        }

        return null;
    }

    private CommentResponse mapRow(ResultSet rs) throws SQLException {
        String username = rs.getString("username");
        String role = rs.getString("role");

        return new CommentResponse(
                rs.getLong("comment_id"),
                rs.getLong("user_id"),
                username != null ? username : "Unknown",
                role != null ? role : "System",
                rs.getString("content"),
                rs.getBoolean("is_internal"),
                rs.getTimestamp("created_at")
        );
    }
}
