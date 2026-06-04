package com.emagiz.resource;

import com.emagiz.dao.CommentDAO;
import com.emagiz.dao.TicketDAO;
import com.emagiz.dto.CommentDTO;
import com.emagiz.model.CommentResponse;
import com.emagiz.model.Ticket;
import com.emagiz.model.TicketNotFoundException;
import com.emagiz.model.TicketStatus;
import jakarta.ws.rs.*;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

@Path("tickets")
public class TicketResource {
    TicketDAO ticketDAO = new TicketDAO();


    @Context
    private ContainerRequestContext requestContext;
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTicket(Ticket ticket){
        Long userId =
                (Long) requestContext.getProperty("userId");

        ticket.setCreatorId(userId);
        Ticket savedTicket = ticketDAO.save(ticket);
        return Response.status(Response.Status.CREATED).entity(savedTicket).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTickets(){
        try {
            List<Ticket> ticketList = ticketDAO.findAll();

            return Response.ok(ticketList).build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error in db: " + e.getMessage()).build();
        }

    }

    @PATCH
    @Path("/{id}/status")
    @Consumes(MediaType.TEXT_PLAIN)
    public Response updateTicketStatus(
            @PathParam("id") Long id,
            String status) {

        try {
            TicketStatus newStatus = TicketStatus.valueOf(status);

            ticketDAO.updateStatus(id, newStatus);

            return Response.ok("Status updated").build();

        } catch (IllegalArgumentException e) {

            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid status")
                    .build();

        }
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
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
