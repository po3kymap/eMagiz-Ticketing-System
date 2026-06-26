package com.emagiz.resource;

import com.emagiz.dao.AuditLogDAO;
import com.emagiz.dao.UserDAO;
import com.emagiz.dto.EmailRequest;
import com.emagiz.dto.ResetPasswordRequest;
import com.emagiz.model.ApiError;
import com.emagiz.model.LoginResponse;
import com.emagiz.model.User;
import com.emagiz.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mindrot.jbcrypt.BCrypt;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * REST resource for user accounts: list / create / delete (SUPPORT-only)
 * plus the public login and password-reset endpoints.
 */
@Path("/users")
public class UserResource {
    // quick email shape check; rejects things like a@a, foo@bar, abc@123
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final UserDAO userDAO = new UserDAO();
    private final AuditLogDAO auditLogDAO = new AuditLogDAO();

    @Context
    private ContainerRequestContext requestContext;

    /** Creates a new user. SUPPORT-only. */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"SUPPORT"})
    public Response createUser(User user) {
        User savedUser = userDAO.save(user);
        return Response.status(Response.Status.CREATED).entity(savedUser).build();
    }

    /** Lists every non-deleted user. 500 on DB failure. */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"SUPPORT"})
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

    /**
     * Read-only user directory for assignee labels in customer/consultant views.
     */
    @GET
    @Path("/directory")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"CUSTOMER", "CONSULTANT", "SUPPORT"})
    public Response getUserDirectory() {
        try {
            List<User> userList = userDAO.findAll();
            List<UserDirectoryEntry> directory = userList.stream()
                    .map(user -> new UserDirectoryEntry(
                            user.getId(),
                            user.getUsername(),
                            user.getRole(),
                            user.getCompany()
                    ))
                    .toList();
            return Response.ok(directory).build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Error in db: " + e.getMessage()))
                    .build();
        }
    }

    record UserDirectoryEntry(Long id, String username, String role, String company) {}

    /**
     * Soft-deletes a user. 400 if you're deleting yourself,
     * 404 if unknown, 409 if they still have active tickets.
     */
    @DELETE
    @Path("/{id}")
    @RolesAllowed("SUPPORT")
    public Response deleteUser(@PathParam("id") Long id) {
        Long currentUserId = (Long) requestContext.getProperty("userId");

        if (currentUserId != null && currentUserId.equals(id)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError("You cannot delete your own account"))
                    .build();
        }

        User user = userDAO.findById(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ApiError("User not found"))
                    .build();
        }

        try {
            boolean deleted = userDAO.deleteById(id);
            if (!deleted) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ApiError("User not found"))
                        .build();
            }

            if (currentUserId != null) {
                auditLogDAO.saveLog(
                        null,
                        currentUserId.intValue(),
                        "USER_DELETED",
                        "Deleted user u" + id + " (" + user.getUsername() + ")"
                );
            }

            return Response.noContent().build();
        } catch (IllegalStateException e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(new ApiError(e.getMessage()))
                    .build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Error deleting user: " + e.getMessage()))
                    .build();
        }
    }

    /** POST /users/login — checks creds, issues a 24h token. */
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
                authenticatedUser.getRole(),
                authenticatedUser.getCompany()
        );

        return Response.ok(body).build();
    }

    /**
     * Starts the password-reset flow. Always returns the same
     * message (whether the email is known or not) so we don't leak
     * which addresses are registered, then sends the reset mail
     * if a matching account exists.
     */
    @POST
    @Path("/password-reset")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(EmailRequest emailRequest){

        String email = emailRequest.getEmail();
        if (email == null || !EMAIL_PATTERN.matcher(email.trim()).matches()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError("Invalid email format"))
                    .build();
        }
        email = email.trim();

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

    /**
     * Finishes the password-reset flow: hashes the new password,
     * saves it if the token is still valid, marks the token as used.
     * 400 if the token is invalid.
     */
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
