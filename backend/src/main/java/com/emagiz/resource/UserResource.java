package main.java.com.emagiz.resource;

import main.java.com.emagiz.dao.UserDAO;
import main.java.com.emagiz.model.ApiError;
import main.java.com.emagiz.model.LoginResponse;
import main.java.com.emagiz.model.User;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@Path("users")
public class UserResource {
    private final UserDAO userDAO = new UserDAO();

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(User user) {
        User savedUser = userDAO.save(user);
        return Response.status(Response.Status.CREATED).entity(savedUser).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {
        try {
            List<User> userList = userDAO.findAll();
            return Response.ok(userList).build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Error in db: " + e.getMessage()))
                    .build();
        }
    }

    @POST
    @Path("login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(User loginData) {
        if (loginData == null
                || loginData.getUsername() == null
                || loginData.getUsername().isBlank()
                || loginData.getPassword() == null
                || loginData.getPassword().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError("Username and password are required"))
                    .build();
        }

        User authenticatedUser = userDAO.validateUserLogin(
                loginData.getUsername().trim(),
                loginData.getPassword()
        );

        if (authenticatedUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ApiError("Invalid username or password"))
                    .build();
        }

        String token = UUID.randomUUID().toString();
        userDAO.saveToken(token, authenticatedUser.getId());

        LoginResponse body = new LoginResponse(
                token,
                authenticatedUser.getId(),
                authenticatedUser.getUsername(),
                authenticatedUser.getEmail(),
                authenticatedUser.getRole()
        );

        return Response.ok(body).build();
    }
}
