package com.emagiz.dto;

public class CommentDTO {
    private String content;

    public CommentDTO(boolean isInternal, String content) {
        this.isInternal = isInternal;
        this.content = content;
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
