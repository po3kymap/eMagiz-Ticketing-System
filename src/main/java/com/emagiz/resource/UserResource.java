package com.emagiz.resource;


import com.emagiz.dao.UserDAO;
import com.emagiz.model.User;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@Path("users")
public class UserResource {
    UserDAO userDAO = new UserDAO();

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(User user){
        User savedUser = userDAO.save(user);
        return Response.status(Response.Status.CREATED).entity(savedUser).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers(){
        try {
            List<User> userList = userDAO.findAll();

            return Response.ok(userList).build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error in db: " + e.getMessage()).build();
        }

    }

    @POST
    @Path("login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(User loginData){
        User authinticatedUser = userDAO.validateUserLogin(loginData.getUsername(), loginData.getPassword());

        if (authinticatedUser == null){
            Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Invalid username or password\"}")
                    .build();
        }

        String token = UUID.randomUUID().toString();
        String jsonResponse = "Login successful! Token: " + token + " role: " + authinticatedUser.getRole() + " userId: " + authinticatedUser.getId();
        return Response.ok(jsonResponse).build();
    }

}
