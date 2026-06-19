package com.emagiz.model;

public class LoginResponse {
    private String token;
    private Long userId;
    private String username;
    private String email;
    private String role;
    private String company;

    public LoginResponse() {
    }

    public LoginResponse(String token, Long userId, String username, String email, String role, String company) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.role = role;
        this.company = company;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getCompany() {
        return company;
    }
}