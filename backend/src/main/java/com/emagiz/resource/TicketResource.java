package main.java.com.emagiz.resource;

import main.java.com.emagiz.dao.TicketDAO;
import main.java.com.emagiz.model.ApiError;
import main.java.com.emagiz.model.ApiSuccess;
import main.java.com.emagiz.model.Ticket;
import main.java.com.emagiz.model.TicketNotFoundException;
import main.java.com.emagiz.model.TicketStatus;
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

    private final TicketDAO ticketDAO = new TicketDAO();

    @Context
    private ContainerRequestContext requestContext;

    @POST
    public Response createTicket(Ticket ticket) {
        try {
            Long userId = (Long) requestContext.getProperty("userId");
            ticket.setCreatorId(userId);

            Ticket savedTicket = ticketDAO.save(ticket);

            return Response.status(Response.Status.CREATED)
                    .entity(savedTicket)
                    .build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Failed to create ticket: " + e.getMessage()))
                    .build();
        }
    }

    @GET
    public Response getAllTickets() {
        try {
            List<Ticket> ticketList = ticketDAO.findAll();

            return Response.ok(ticketList).build();

        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Error in db: " + e.getMessage()))
                    .build();
        }
    }

    @PATCH
    @Path("/{id}/status")
    public Response updateTicketStatus(@PathParam("id") Long id, Ticket ticket) {
        try {
            if (ticket == null || ticket.getStatus() == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ApiError("Status is required"))
                        .build();
            }

            TicketStatus newStatus = ticket.getStatus();
            ticketDAO.updateStatus(id, newStatus);

            return Response.ok(new ApiSuccess("Status updated")).build();

        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError("Invalid status"))
                    .build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Failed to update status: " + e.getMessage()))
                    .build();
        }
    }

    @PUT
    @Path("/{id}/assignee/{assigneeId}")
    public Response assignTicket(@PathParam("id") Long ticketId,
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
    public Response findById(@PathParam("id") Long id) {
        try {
            Ticket ticket = ticketDAO.findById(id);
            return Response.ok(ticket).build();

        } catch (TicketNotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ApiError(e.getMessage()))
                    .build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Failed to fetch ticket: " + e.getMessage()))
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
    public Response findTicketsByClientId(@PathParam("clientId") Long clientId) {
        try {
            List<Ticket> ticketList = ticketDAO.findTicketsByClientId(clientId);
            return Response.ok(ticketList).build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError("Failed to fetch tickets by client id"))
                    .build();
        }
    }
}
