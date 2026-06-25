package com.emagiz.model;

import java.sql.Timestamp;

/**
 * Single row of the audit_logs table.
 *
 * <p>One action by a user against a ticket (or system-wide when ticketId is null).
 * Written by AuditLogDAO.</p>
 */
public class AuditLog {
    private int id;
    private Integer ticketId;
    private Integer userId;
    private String action;
    private String details;
    private Timestamp createdAt;

    /** No-arg constructor. */
    public AuditLog() {}

    /** Creates an audit entry without details. */
    public AuditLog(Integer ticketId, Integer userId, String action) {
        this.ticketId = ticketId;
        this.userId = userId;
        this.action = action;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getTicketId() {
        return ticketId;
    }

    public void setTicketId(Integer ticketId) {
        this.ticketId = ticketId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


}
