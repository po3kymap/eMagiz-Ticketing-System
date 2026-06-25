package com.emagiz.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Request body for creating a new comment.
 *
 * <p>The internal flag is exposed under the JSON property
 * "internal"; the field name also accepts the legacy alias
 * "isInternal" for backward compatibility with older clients.</p>
 */
public class CommentDTO {
    private String content;

    @JsonProperty("internal")
    @JsonAlias("isInternal")
    private boolean internal;

    /** No-arg constructor. */
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
