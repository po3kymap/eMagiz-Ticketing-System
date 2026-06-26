package com.emagiz.resource;

import com.emagiz.dao.AuditLogDAO;
import com.emagiz.dao.TicketDAO;
import com.emagiz.model.ApiError;
import com.emagiz.model.AuditLog;
import com.emagiz.model.Ticket;
import com.emagiz.model.TicketNotFoundException;
import com.emagiz.model.TicketType;
import com.emagiz.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

/**
 * REST resource for the audit log feed. SUPPORT-only.
 */
@Path("audit-logs")
public class AuditLogResource {
    private final AuditLogDAO auditLogDAO = new AuditLogDAO();
    private final TicketDAO ticketDAO = new TicketDAO();

    @Context
    private ContainerRequestContext requestContext;

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
    @Path("accessible")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"CUSTOMER", "CONSULTANT", "SUPPORT"})
    public Response getAccessibleLogs() {
        Long userId = (Long) requestContext.getProperty("userId");
        String userRole = (String) requestContext.getProperty("userRole");

        if (userId == null || userRole == null) {
            return forbidden();
        }

        List<AuditLog> logs;

        if ("SUPPORT".equalsIgnoreCase(userRole.trim())) {
            logs = auditLogDAO.getAllLogs();
        } else if ("CUSTOMER".equalsIgnoreCase(userRole.trim())) {
            logs = auditLogDAO.getLogsForCustomerTickets(userId);
        } else if ("CONSULTANT".equalsIgnoreCase(userRole.trim())) {
            logs = auditLogDAO.getLogsForAssignedTickets(userId);
        } else {
            return forbidden();
        }

        return Response.ok(logs).build();
    }

    @GET
    @Path("ticket/{ticketId}")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"CUSTOMER", "SUPPORT", "CONSULTANT"})
    public Response getLogsByTicket(@PathParam("ticketId") Long ticketId) {
        try {
            Ticket ticket = ticketDAO.findById(ticketId);
            Response denied = denyTicketAuditAccess(ticket);
            if (denied != null) {
                return denied;
            }

            List<AuditLog> logs = auditLogDAO.getLogsByTicketId(ticketId);
            return Response.ok(logs).build();
        } catch (TicketNotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ApiError("Ticket not found"))
                    .build();
        }
    }

    private Response denyTicketAuditAccess(Ticket ticket) {
        Long userId = (Long) requestContext.getProperty("userId");
        String userRole = (String) requestContext.getProperty("userRole");

        if (userRole == null) {
            return forbidden();
        }

        if ("SUPPORT".equalsIgnoreCase(userRole.trim())) {
            return null;
        }

        if ("CUSTOMER".equalsIgnoreCase(userRole.trim())) {
            if (ticket.getType() == TicketType.INTERNAL) {
                return forbidden();
            }
            if (userId == null || !userId.equals(ticket.getCreatorId())) {
                return forbidden();
            }
            return null;
        }

        if ("CONSULTANT".equalsIgnoreCase(userRole.trim())) {
            if (userId == null || ticket.getAssigneeId() == null || !userId.equals(ticket.getAssigneeId())) {
                return forbidden();
            }
            return null;
        }

        return forbidden();
    }

    private Response forbidden() {
        return Response.status(Response.Status.FORBIDDEN)
                .entity(new ApiError("You don't have permission to access this ticket"))
                .build();
    }
}
