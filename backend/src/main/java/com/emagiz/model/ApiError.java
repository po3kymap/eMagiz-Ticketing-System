package com.emagiz.model;

public class ApiError {
    private String error;

    public ApiError() {
    }

    public ApiError(String error) {
        this.error = error;
    }

    public String getError() {
        return error;
    }
}
