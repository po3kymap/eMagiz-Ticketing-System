package main.java.com.emagiz.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConfig {
    private static final String URL = "jdbc:postgresql://bronto.ewi.utwente.nl:5432/dab_dcsinf25261a_99?currentSchema=\"emagiz4DB\"";
    private static final String USER = "dab_dcsinf25261a_99";
    private static final String PASSWORD = "+a9q8tpM+L27oWYU";

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException(e);
        }
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
