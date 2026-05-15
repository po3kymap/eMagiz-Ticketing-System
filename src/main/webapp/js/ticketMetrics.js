export function getTicketMetrics(tickets) {
    const normalizedTickets = tickets.map((ticket) => ({
        ...ticket,
        normalizedStatus: ticket.status.toLowerCase()
    }));

    return {
        openTicketsCount: normalizedTickets.filter((ticket) => ticket.normalizedStatus === 'assigned' || ticket.normalizedStatus === 'in progress').length,
        waitingForSupportCount: normalizedTickets.filter((ticket) => ticket.normalizedStatus === 'assigned').length,
        resolvedTicketsCount: normalizedTickets.filter((ticket) => ticket.normalizedStatus === 'resolved').length,
        recentUpdatesCount: normalizedTickets.length
    };
}
