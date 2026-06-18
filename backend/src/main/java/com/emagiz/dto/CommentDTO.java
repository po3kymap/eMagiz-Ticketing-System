package com.emagiz.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CommentDTO {
    private String content;

    @JsonProperty("internal")
    @JsonAlias("isInternal")
    private boolean internal;

    public CommentDTO() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @JsonProperty("internal")
    public boolean isInternal() {
        return internal;
    }

    @JsonProperty("internal")
    public void setInternal(boolean internal) {
        this.internal = internal;
    }
}
