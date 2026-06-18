package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.CommentResponse;

import java.sql.*;
import java.time.LocalDateTime;

public class CommentDAO {
    private AuditLogDAO auditLogDAO = new AuditLogDAO();

    public CommentResponse addComment(Long ticketID, Long userID, String text, Boolean isInternal){
        String sql = "INSERT INTO comments (ticket_id, user_id, content, is_internal, created_at) \n" +
                "VALUES (?, ?, ?, ?, ?) RETURNING comment_id, created_at;";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql))
             {
                 stmt.setLong(1, ticketID);
                 stmt.setLong(2, userID);
                 stmt.setString(3, text);
                 stmt.setBoolean(4, isInternal);
                 stmt.setTimestamp(5, Timestamp.valueOf(LocalDateTime.now()));
                ResultSet resultSet = stmt.executeQuery();
                 if (resultSet.next()) {

                     auditLogDAO.saveLog(ticketID.intValue(), userID.intValue(), "COMMENT_ADDED");

                 return new CommentResponse(
                         resultSet.getLong("comment_id"),
                         userID,
                         text,
                         isInternal,
                         LocalDateTime.now()
                 );
             }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
