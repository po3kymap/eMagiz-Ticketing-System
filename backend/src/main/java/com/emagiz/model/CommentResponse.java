package com.emagiz.model;

import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private Long userId;
    private String content;
    private boolean isInternal;
    private LocalDateTime createdAt;

    public CommentResponse(Long id, Long userId, String content, boolean isInternal, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.isInternal = isInternal;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getContent() { return content; }
    public boolean isInternal() { return isInternal; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
