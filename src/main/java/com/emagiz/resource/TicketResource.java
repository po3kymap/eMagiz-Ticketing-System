package com.emagiz.resource;

import com.emagiz.dao.TicketDAO;
import com.emagiz.model.Ticket;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

@Path("tickets")
public class TicketResource {
    TicketDAO ticketDAO = new TicketDAO();

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTicket(Ticket ticket){
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
}
