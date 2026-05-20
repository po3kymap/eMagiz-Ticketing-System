package main.java.com.emagiz.model;



public class User {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String role;
    private String company;

    public User() {
    }

    public User(String username, String email, String password, String role, String company) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.company = company;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
}
