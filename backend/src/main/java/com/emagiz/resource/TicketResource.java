package com.emagiz.resource;

import com.emagiz.dao.CommentDAO;
import com.emagiz.dao.TicketDAO;
import com.emagiz.dto.CommentDTO;
import com.emagiz.dto.StatusUpdateRequest;
import com.emagiz.model.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

@Path("tickets")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TicketResource {
    TicketDAO ticketDAO = new TicketDAO();


    @Context
    private ContainerRequestContext requestContext;
    @POST
    public Response createTicket(Ticket ticket){
        Long userId =
                (Long) requestContext.getProperty("userId");

        ticket.setCreatorId(userId);
        if (ticket.getType() == null) {
            ticket.setType(TicketType.INCIDENT);
        }
        Ticket savedTicket = ticketDAO.save(ticket);
        return Response.status(Response.Status.CREATED).entity(savedTicket).build();
    }

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
    public Response UpdateTicket(@PathParam("ticketId") Long id, Ticket ticket){
        try {
            ticketDAO.updateTicket(id, ticket);
            return Response.ok(new ApiSuccess("Ticket updated")).build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PATCH
    @Path("/{id}/status")
    public Response updateTicketStatus(
            @PathParam("id") Long id,
            StatusUpdateRequest request) {

        try {
            TicketStatus newStatus = TicketStatus.valueOf(request.getStatus());

            ticketDAO.updateStatus(id, newStatus);

            return Response.ok(new ApiSuccess("Status updated")).build();

        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid status")
                    .build();
        }
    }
    


    @PUT
    @Path("/{ticketId}/assignee/{assigneeId}")
    public Response assignTicket(@PathParam("ticketId") Long ticketId,
                                 @PathParam("assigneeId") Long assigneeId) {
        try {
            boolean updated = ticketDAO.assignTicket(ticketId, assigneeId);

            if (!updated) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ApiError("Ticket not found"))
                        .build();
            }

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



    @POST
    @Path("/{ticketID}/comments")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addCommentToTicket(@PathParam("ticketID") Long ticketID, CommentDTO commentDTO,
                                       @Context ContainerRequestContext containerRequestContext){
        Long userId = (Long) containerRequestContext.getProperty("userId");

        CommentResponse responseDTO = new CommentDAO().addComment(
                ticketID, userId, commentDTO.getContent(), commentDTO.isInternal()
        );

        if (responseDTO == null) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }

        return Response.status(Response.Status.CREATED)
                .entity(responseDTO)
                .build();
    }
}
