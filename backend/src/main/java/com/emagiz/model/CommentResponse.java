package com.emagiz.model;

import java.sql.Timestamp;

/**
 * Comment as returned to the frontend.
 *
 * Unlike CommentDTO (the request side) this also carries the
 * username and role of the author (joined from the users table)
 * plus the comment id and created_at.
 */
public class CommentResponse {
    private Long id;
    private Long userId;
    private String username;
    private String role;
    private String content;
    private boolean isInternal;
    private Timestamp createdAt;

    /** Full constructor used by CommentDAO when mapping rows. */
    public CommentResponse(Long id, Long userId, String username, String role, String content,
                         boolean isInternal, Timestamp createdAt) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.content = content;
        this.isInternal = isInternal;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public String getContent() { return content; }
    public boolean isInternal() { return isInternal; }
    public Timestamp getCreatedAt() { return createdAt; }
}
