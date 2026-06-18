package com.emagiz.config;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;

import java.sql.Connection;

public class JerseyConfig extends ResourceConfig {

    public JerseyConfig() {
        packages("com.emagiz.resource", "com.emagiz.security");
        register(JacksonFeature.class);
        register(com.emagiz.security.AuthFilter.class);
        register(MailConfig.class);
        checkDatabaseConnection();
    }


    private void checkDatabaseConnection() {
        try (Connection conn = DatabaseConfig.getConnection()) {
            if (conn != null && !conn.isClosed()) {
                System.out.println("JDBC CONNECTION: SUCCESSFUL!");
            }
        } catch (Exception e) {
            System.err.println("JDBC CONNECTION: FAILED!");
            e.printStackTrace();
        }
    }
}
