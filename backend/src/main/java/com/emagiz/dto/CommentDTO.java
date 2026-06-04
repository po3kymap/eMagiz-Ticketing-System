package com.emagiz.dto;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;

public class CommentDTO {
    private String content;
    private boolean isInternal;


    public CommentDTO(boolean isInternal, String content) {
        this.isInternal = isInternal;
        this.content = content;
    }

    public boolean isInternal() {
        return isInternal;
    }



    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
