package com.emagiz.resource;

import com.emagiz.dao.UserDAO;
import com.emagiz.dto.EmailRequest;
import com.emagiz.dto.ResetPasswordRequest;
import com.emagiz.model.ApiError;
import com.emagiz.model.LoginResponse;
import com.emagiz.model.User;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mindrot.jbcrypt.BCrypt;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@Path("/users")
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
    @Path("/login")
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

    @POST
    @Path("/password-reset")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(EmailRequest emailRequest){

        String email = emailRequest.getEmail();
        User authUser = userDAO.findUserByEmail(email);
        if (authUser == null){
            return Response.ok(new ApiError("If an account exists with that mail, you'll receive reset instructions")).build();
        }
        String token = UUID.randomUUID().toString();
        userDAO.savePasswordResetToken(authUser.getId(), token);
        EmailService emailService = new EmailService();
        emailService.sendPasswordResetLink(authUser.getEmail(), token);
        return Response.ok(new ApiError("If an account exists with that mail, you'll receive reset instructions")).build();
    }

    @PUT
    @Path("/reset-password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
        public Response finishResetPassword(ResetPasswordRequest request) {
        String token = request.getToken();
        String password = request.getNewPassword();
        String hashedEntry = BCrypt.hashpw(password, BCrypt.gensalt());
        if(userDAO.getUserIdByResetToken(token) == null){
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError("Invalid token"))
                    .build();
        }
        userDAO.updatePassword(userDAO.getUserIdByResetToken(token), hashedEntry);
        userDAO.makeResetTokenUsed(token);
        return Response.ok("Password was changed succesfully").build();
    }
}
