package com.emagiz.resource;

import com.emagiz.dao.CommentDAO;
import com.emagiz.dao.TicketDAO;
import com.emagiz.dao.UserDAO;
import com.emagiz.dto.CommentDTO;
import com.emagiz.dto.PriorityUpdateRequest;
import com.emagiz.dto.StatusUpdateRequest;
import com.emagiz.model.*;
import com.emagiz.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import com.emagiz.dao.AuditLogDAO;


@Path("tickets")
@Produces(MediaType.APPLICATION_JSON)
public class TicketResource {
    TicketDAO ticketDAO = new TicketDAO();
    CommentDAO commentDAO = new CommentDAO();
    UserDAO userDAO = new UserDAO();
    AuditLogDAO auditLogDAO = new AuditLogDAO();



    @Context
    private ContainerRequestContext requestContext;
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"CUSTOMER", "SUPPORT"})
    public Response createTicket(Ticket ticket){
        Long userId =
                (Long) requestContext.getProperty("userId");

        ticket.setCreatorId(userId);
        if (ticket.getType() == null) {
            ticket.setType(TicketType.INCIDENT);
        }

        Ticket savedTicket = ticketDAO.save(ticket);
        auditLogDAO.saveLog(savedTicket.getId().intValue(), userId.intValue(), "TICKET_CREATED");

        return Response.status(Response.Status.CREATED).entity(savedTicket).build();
    }
    @RolesAllowed("SUPPORT")
    @GET
    public Response getAllTickets(){
        try {
            List<Ticket> ticketList = ticketDAO.findAll();

            return Response.ok(ticketList).build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error in db: " + e.getMessage()).build();
        }

    }

    @POST
    @Path("/update/{ticketId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response UpdateTicket(@PathParam("ticketId") Long id, Ticket ticket){
        try {
            Long userId = (Long) requestContext.getProperty("userId");

            ticketDAO.updateTicket(id, ticket);
            auditLogDAO.saveLog(id.intValue(), userId.intValue(), "TICKET_UPDATED");

            return Response.ok(new ApiSuccess("Ticket updated")).build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @PATCH
    @Path("/{id}/status")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTicketStatus(
            @PathParam("id") Long id,
            StatusUpdateRequest request) {

        try {
            TicketStatus newStatus = TicketStatus.valueOf(request.getStatus());
            Long userId = (Long) requestContext.getProperty("userId");

            ticketDAO.updateStatus(id, newStatus);
            auditLogDAO.saveLog(id.intValue(), userId.intValue(), "STATUS_" + newStatus.name());

            return Response.ok(new ApiSuccess("Status updated")).build();

        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid status")
                    .build();
        }
    }


    @PATCH
    @Path("/{id}/priority")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTicketPriority(
            @PathParam("id") Long id,
            PriorityUpdateRequest request) {

        if (request == null || request.getPriority() == null || request.getPriority().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError("Priority is required"))
                    .build();
        }

        try {
            TicketPriority newPriority = TicketPriority.valueOf(request.getPriority().trim().toUpperCase());
            Long userId = (Long) requestContext.getProperty("userId");

            boolean updated = ticketDAO.updatePriority(id, newPriority);

            if (!updated) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ApiError("Ticket not found"))
                        .build();
            }

            auditLogDAO.saveLog(id.intValue(), userId.intValue(), "TICKET_PRIORITY_UPDATED");

            return Response.ok(new ApiSuccess("Priority updated")).build();

        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError("Invalid priority"))
                    .build();
        }
    }




    @PUT
    @Path("/{ticketId}/assignee/{assigneeId}")
    public Response assignTicket(@PathParam("ticketId") Long ticketId,
                                 @PathParam("assigneeId") Long assigneeId) {
        try {
            Long userId = (Long) requestContext.getProperty("userId");

            boolean updated = ticketDAO.assignTicket(ticketId, assigneeId);

            if (!updated) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ApiError("Ticket not found"))
                        .build();
            }

            auditLogDAO.saveLog(ticketId.intValue(), userId.intValue(), "TICKET_ASSIGNED", String.valueOf(assigneeId));

            return Response.ok(new ApiSuccess("Ticket assigned")).build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Failed to assign ticket: " + e.getMessage()))
                    .build();
        }
    }



    @GET
    @Path("/{id}")
    public Response findById(
            @PathParam("id") Long id) {

        try {
            Ticket t = ticketDAO.findById(id);
            return Response.ok(t).build();

        } catch (TicketNotFoundException e) {

            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage())
                    .build();
        }
    }

    @GET
    @Path("/assignee/{assigneeId}")
    public Response findByAssigneeId(@PathParam("assigneeId") Long assigneeId) {
        try {
            List<Ticket> tickets = ticketDAO.findTicketsByAssigneeId(assigneeId);
            return Response.ok(tickets).build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Failed to fetch tickets by assignee id"))
                    .build();
        }
    }


    @GET
    @Path("/client/{clientId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findTicketsByClientId(@PathParam("clientId") Long id){
        List<Ticket> ticketList = ticketDAO.findTicketsByClientId(id);
        return Response.ok(ticketList).build();
    }



    @GET
    @Path("/{ticketID}/comments")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTicketComments(@PathParam("ticketID") Long ticketID,
                                        @Context ContainerRequestContext containerRequestContext) {
        Long userId = (Long) containerRequestContext.getProperty("userId");
        User user = userDAO.findById(userId);
        boolean includeInternal = user != null && !"Customer".equalsIgnoreCase(user.getRole());

        try {
            List<CommentResponse> comments = commentDAO.findByTicketId(ticketID, includeInternal);
            return Response.ok(comments).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Failed to load comments"))
                    .build();
        }
    }

    @POST
    @Path("/{ticketID}/comments")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addCommentToTicket(@PathParam("ticketID") Long ticketID, CommentDTO commentDTO,
                                       @Context ContainerRequestContext containerRequestContext) {
        Long userId = (Long) containerRequestContext.getProperty("userId");

        if (commentDTO == null
                || commentDTO.getContent() == null
                || commentDTO.getContent().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError("Comment content is required"))
                    .build();
        }

        User user = userDAO.findById(userId);
        if (commentDTO.isInternal()
                && (user == null || "Customer".equalsIgnoreCase(user.getRole()))) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(new ApiError("Only staff can post internal notes"))
                    .build();
        }

        try {
            CommentResponse responseDTO = commentDAO.addComment(
                    ticketID, userId, commentDTO.getContent().trim(), commentDTO.isInternal()
            );

            if (responseDTO == null) {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity(new ApiError("Failed to add comment"))
                        .build();
            }

            auditLogDAO.saveLog(ticketID.intValue(), userId.intValue(), "TICKET_COMMENT_ADDED");

            return Response.status(Response.Status.CREATED)
                    .entity(responseDTO)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Failed to add comment"))
                    .build();
        }
    }

}
