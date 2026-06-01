package com.emagiz.security;

import com.emagiz.dao.UserDAO;
import com.emagiz.model.ApiError;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import java.io.IOException;

@Provider
public class AuthFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        if (isPublicRoute(requestContext)) {
            return;
        }

        String authHeader = requestContext.getHeaderString("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            abortUnauthorized(requestContext, "Missing or invalid token");
            return;
        }

        String token = authHeader.substring(7).trim();
        UserDAO userDAO = new UserDAO();
        Long userId = userDAO.getUserIdByToken(token);
        if (userId == null) {
            abortUnauthorized(requestContext, "Missing or invalid token");
            return;
        }

        requestContext.setProperty("userId", userId);
    }

    private boolean isPublicRoute(ContainerRequestContext requestContext) {
        String path = normalizePath(requestContext.getUriInfo().getPath());

        return path.endsWith("/login") || "login".equals(path);
    }

    private String normalizePath(String path) {
        if (path == null) {
            return "";
        }
        return path.startsWith("/") ? path.substring(1) : path;
    }

    private void abortUnauthorized(ContainerRequestContext requestContext, String message) {
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .entity(new ApiError(message))
                        .type(MediaType.APPLICATION_JSON)
                        .build()
        );
    }

}
