package com.emagiz;

import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import java.net.URI;

public class TicketingApplication {
    public static final String BASE_URI = "http://localhost:8081/";

    public static void main(String[] args) {
        final ResourceConfig rc = new ResourceConfig()
                .packages("com.emagiz.resource")
                .register(org.glassfish.jersey.jackson.JacksonFeature.class); // Для JSON

        final HttpServer server = GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);

        System.out.println(String.format("Jersey server is turned on: %s", BASE_URI));
        System.out.println("Press Enter to stop");


        try {
            System.out.println("Checking DB connection...");
            jakarta.persistence.Persistence.createEntityManagerFactory("emagiz-pu").createEntityManager();
            System.out.println("✅ Database connection is SUCCESSFUL!");
        } catch (Exception e) {
            System.err.println("❌ Database connection FAILED!");
            e.printStackTrace();
        }

        try {
            System.in.read();
            server.shutdownNow();
        } catch (Exception e) {
            e.printStackTrace();
        }


    }
}