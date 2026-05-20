package com.emagiz.security;


import com.emagiz.dao.UserDAO;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import java.io.IOException;

@Provider
public class AuthFilter implements ContainerRequestFilter {
    @Override
    public void filter(ContainerRequestContext containerRequestContext) throws IOException {
        String path = containerRequestContext.getUriInfo().getPath();
        if (path.contains("login")){
            return;
        }

        String authHeader = containerRequestContext.getHeaderString("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            containerRequestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).
                    entity("{\"error\": \"Missing or invalid token\"}")
                    .type(MediaType.APPLICATION_JSON).build());
            return;
        }

        String token = authHeader.substring(7);
        UserDAO userDAO = new UserDAO();
        Long userId = userDAO.getUserIdByToken(token);
        if (userId == null){
            containerRequestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).
                    entity("{\"error\": \"Missing or invalid token\"}")
                    .type(MediaType.APPLICATION_JSON).build());
        }

        containerRequestContext.setProperty("userId", userId);
    }
}
