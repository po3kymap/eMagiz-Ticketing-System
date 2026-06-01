package com.emagiz.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConfig {
    private static final String URL = "jdbc:postgresql://bronto.ewi.utwente.nl:5432/dab_di2526-2b_101";
    private static final String USER = "dab_di2526-2b_101";
    private static final String PASSWORD = "1+cENrDvbWo9NBZl";

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException(e);
        }
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
