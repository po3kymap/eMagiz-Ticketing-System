package com.emagiz.model;

import java.sql.Timestamp;

public class Ticket {

    private Long id;
    private String title;
    private String description;
    private TicketStatus status;
    private String priority;

    private Long creatorId;
    private Long assigneeId;

    private Timestamp createdAt;
    private Timestamp updatedAt;

    public Ticket() {
    }

    public Ticket(String title, String description, String priority,
                  Long creatorId, Long assigneeId) {

        this.title = title;
        this.description = description;
        this.status = TicketStatus.OPEN;
        this.priority = priority;
        this.creatorId = creatorId;
        this.assigneeId = assigneeId;
    }

    public boolean isValidStatusChange(
            TicketStatus oldStatus,
            TicketStatus newStatus) {

        return switch (oldStatus) {
            case OPEN -> newStatus == TicketStatus.IN_REVIEW;
            case IN_REVIEW ->
                    newStatus == TicketStatus.ASSIGNED || newStatus == TicketStatus.DENIED;
            case ASSIGNED -> newStatus == TicketStatus.ACCEPTED;
            case ACCEPTED -> newStatus == TicketStatus.CLOSED;
            case CLOSED, DENIED -> false;
            default -> false;
        };
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}