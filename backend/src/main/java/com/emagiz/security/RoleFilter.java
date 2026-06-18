package com.emagiz.security;

import com.emagiz.model.ApiError;
import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

@Provider
@Priority(Priorities.AUTHORIZATION)
public class RoleFilter implements ContainerRequestFilter {

    @Context
    private ResourceInfo resourceInfo;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        Method resourceMethod = resourceInfo.getResourceMethod();
        if (resourceMethod == null) return;

        RolesAllowed rolesAnnotation = resourceMethod.getAnnotation(RolesAllowed.class);
        if (rolesAnnotation == null) {
            rolesAnnotation = resourceMethod.getDeclaringClass().getAnnotation(RolesAllowed.class);
        }

        if (rolesAnnotation != null) {
            List<String> allowedRoles = Arrays.asList(rolesAnnotation.value());

            String userRole = (String) requestContext.getProperty("userRole");

            if (userRole == null || !allowedRoles.contains(userRole.toUpperCase())) {
                requestContext.abortWith(
                        Response.status(Response.Status.FORBIDDEN)
                                .entity(new ApiError("You don't have permission for that page"))
                                .type(MediaType.APPLICATION_JSON)
                                .build()
                );
            }
        }
    }
}
