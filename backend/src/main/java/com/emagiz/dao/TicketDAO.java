package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.*;
import jakarta.ws.rs.core.Response;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TicketDAO {
    public Ticket save(Ticket ticket) {
        String sql = "INSERT INTO tickets (title, description, status, type, priority, creator_id) VALUES (?, ?, ?, ?, ?, ?)";
        try(Connection conn = DatabaseConfig.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql, java.sql.Statement.RETURN_GENERATED_KEYS)){
            pstmt.setString(1, ticket.getTitle());
            pstmt.setString(2, ticket.getDescription());
            pstmt.setString(3, ticket.getStatus().name());
            pstmt.setString(4, ticket.getType().name());
            pstmt.setString(5, ticket.getPriority());
            pstmt.setLong(6, ticket.getCreatorId());

            pstmt.executeUpdate();

            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    ticket.setId(generatedKeys.getLong(1));
                }
            }

            return ticket;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Ticket> findAll() throws SQLException {
        List<Ticket> tickets = new ArrayList<>();
        String sql = "SELECT * FROM tickets";

        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            formTicket(tickets, rs);
        }
        return tickets;
    }

    public Ticket findById(Long id){
        String sql = "SELECT * FROM tickets WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()){
                Ticket t = new Ticket();
                t.setId(rs.getLong("id"));
                t.setTitle(rs.getString("title"));
                t.setDescription(rs.getString("description"));
                t.setStatus(TicketStatus.valueOf(rs.getString("status")));
                t.setType(readType(rs));
                t.setPriority(rs.getString("priority"));
                t.setCreatorId(rs.getLong("creator_id"));
                t.setAssigneeId(rs.getLong("assignee_id"));
                t.setCreatedAt(rs.getTimestamp("created_at"));
                t.setUpdatedAt(rs.getTimestamp("updated_at"));
                return t;
            }
            throw new TicketNotFoundException("Ticket with id " + id + " not found");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void updateStatus(Long ticketId, TicketStatus newStatus) {
        String sql = "UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, newStatus.name());
            pstmt.setLong(2, ticketId);

            pstmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void updateTicket(Long id, Ticket ticket){
        String sql =  "UPDATE tickets SET title = ?," +
                " description = ? , status = ?, priority = ? ,type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        try(Connection conn = DatabaseConfig.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, ticket.getTitle());
            pstmt.setString(2, ticket.getDescription());
            pstmt.setString(3, ticket.getStatus().name());
            pstmt.setString(4, ticket.getPriority());
            pstmt.setString(5, ticket.getType().name());
            pstmt.setLong(6, id);
            pstmt.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    public List<Ticket> findTicketsByClientId(Long clientID){
        List<Ticket> tickets = new ArrayList<>();
        String sql = "SELECT * FROM tickets WHERE creator_id = ? ORDER BY id DESC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);) {

            pstmt.setLong(1, clientID);
            ResultSet rs = pstmt.executeQuery();
            formTicket(tickets, rs);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return tickets;
    }

    public List<Ticket> findTicketsByAssigneeId(Long assigneeID){
        List<Ticket> tickets = new ArrayList<>();
        String sql = "SELECT * FROM tickets WHERE assignee_id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);) {

            pstmt.setLong(1, assigneeID);
            ResultSet rs = pstmt.executeQuery();
            formTicket(tickets, rs);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return tickets;
    }

    public boolean assignTicket(Long ticketId, Long assigneeId) {
        String sql = "UPDATE tickets SET assignee_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, assigneeId);
            pstmt.setLong(2, ticketId);

            int rowsUpdated = pstmt.executeUpdate();
            return rowsUpdated > 0;

        } catch (SQLException e) {
            throw new RuntimeException("Failed to assign ticket", e);
        }
    }


    private TicketType readType(ResultSet rs) throws SQLException {
        String type = rs.getString("type");
        if (type == null || type.isBlank()) {
            return TicketType.INCIDENT;
        }
        return TicketType.valueOf(type);
    }

    private void formTicket(List<Ticket> tickets, ResultSet rs) throws SQLException {
        while (rs.next()) {
            Ticket t = new Ticket();
            t.setId(rs.getLong("id"));
            t.setTitle(rs.getString("title"));
            t.setDescription(rs.getString("description"));
            t.setStatus(TicketStatus.valueOf(rs.getString("status")));
            t.setType(readType(rs));
            t.setPriority(rs.getString("priority"));
            t.setCreatorId(rs.getLong("creator_id"));
            t.setAssigneeId(rs.getLong("assignee_id"));
            t.setCreatedAt(rs.getTimestamp("created_at"));
            t.setUpdatedAt(rs.getTimestamp("updated_at"));
            tickets.add(t);
        }
    }

}
