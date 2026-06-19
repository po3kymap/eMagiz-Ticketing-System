package com.emagiz.resource;

import com.emagiz.dao.AuditLogDAO;
import com.emagiz.model.AuditLog;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("audit-logs")
public class AuditLogResource {
    private AuditLogDAO auditLogDAO = new AuditLogDAO();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllLogs(){
        List<AuditLog> logs = auditLogDAO.getAllLogs();
        return Response.ok(logs).build();
    }

    @GET
    @Path("ticket/{ticketId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLogsByTicket(@PathParam("ticketId") Long ticketId) {
        List<AuditLog> logs = auditLogDAO.getLogsByTicketId(ticketId);
        return Response.ok(logs).build();
    }

}
