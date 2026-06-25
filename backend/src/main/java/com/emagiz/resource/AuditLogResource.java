package com.emagiz.resource;

import com.emagiz.dao.AuditLogDAO;
import com.emagiz.model.AuditLog;
import com.emagiz.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

/**
 * REST resource for the audit log feed. SUPPORT-only.
 */
@Path("audit-logs")
public class AuditLogResource {
    private AuditLogDAO auditLogDAO = new AuditLogDAO();

    /** GET /audit-logs — every audit entry, newest first. */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"SUPPORT"})
    public Response getAllLogs(){
        List<AuditLog> logs = auditLogDAO.getAllLogs();
        return Response.ok(logs).build();
    }

    /** GET /audit-logs/ticket/{id} — one ticket's history, oldest first. */
    @GET
    @Path("ticket/{ticketId}")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"SUPPORT"})
    public Response getLogsByTicket(@PathParam("ticketId") Long ticketId) {
        List<AuditLog> logs = auditLogDAO.getLogsByTicketId(ticketId);
        return Response.ok(logs).build();
    }

}
