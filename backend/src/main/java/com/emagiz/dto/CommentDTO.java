package com.emagiz.dto;

public class CommentDTO {
    private String content;

    public CommentDTO() {
    }

    public boolean isInternal() {
        return isInternal;
    }

    public void setInternal(boolean internal) {
        isInternal = internal;
    }

    private boolean isInternal;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
