import { getAuthHeaders, getCurrentUser, getStoredToken } from '@api/auth';
import { apiFetch } from '@js/api/http';
import { formatTicketNumber } from '@js/domain/tickets/ticketCatalog';

const SEARCH_RESULT_LIMIT = 8;

/**
 * Backend contract:
 * GET /api/tickets/client/{clientId}
 * POST /api/tickets
 * Header: Authorization: Bearer <token>
 *
 * clientId = userId from POST /api/users/login response
 */

function mapTicket(raw) {
    return {
        id: raw.id,
        title: raw.title,
        description: raw.description ?? '',
        type: raw.type ?? '',
        priority: raw.priority ?? null,
        status: raw.status ?? null,
        creatorId: raw.creatorId,
        assigneeId: raw.assigneeId ?? null,
        createdAt: raw.createdAt ?? null,
        updatedAt: raw.updatedAt ?? null,
        company: raw.company ?? null,
    };
}

export async function fetchMyTickets(clientId) {
    if (!clientId) {
        throw new Error('Missing user id. Please log in again.');
    }

    if (!getStoredToken()) {
        throw new Error('Not authenticated. Please log in again.');
    }

    const response = await apiFetch(`/api/tickets/client/${clientId}`, {
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
        });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to load tickets (${response.status})`);
    }

    if (!Array.isArray(data)) {
        throw new Error('Unexpected tickets response from server');
    }

    return data.map(mapTicket);
}

export async function fetchMyTicketsForCurrentUser() {
    const user = await getCurrentUser();

    if (!user?.userId) {
        throw new Error('Session incomplete. Please log in again.');
    }

    return fetchMyTickets(user.userId);
}

export async function fetchAssignedTickets(assigneeId) {
    if (!assigneeId) {
        throw new Error('Missing user id. Please log in again.');
    }

    if (!getStoredToken()) {
        throw new Error('Not authenticated. Please log in again.');
    }

    const response = await apiFetch(`/api/tickets/assignee/${assigneeId}`, {
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to load assigned tickets (${response.status})`);
    }

    if (!Array.isArray(data)) {
        throw new Error('Unexpected tickets response from server');
    }

    return data.map(mapTicket);
}

export async function fetchAssignedTicketsForCurrentUser() {
    const user = await getCurrentUser();

    if (!user?.userId) {
        throw new Error('Session incomplete. Please log in again.');
    }

    return fetchAssignedTickets(user.userId);
}

const ACTIVE_STATUSES = new Set(['OPEN', 'ASSIGNED', 'IN_REVIEW', 'ACCEPTED']);

export function computeConsultantStats(tickets) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const threeDaysAgo = new Date(todayStart);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const activeTickets = tickets.filter((ticket) => ACTIVE_STATUSES.has(ticket.status));

    return {
        assignedToMe: tickets.length,
        dueToday: activeTickets.filter((ticket) => ticket.priority === 'CRITICAL').length,
        highPriority: tickets.filter((ticket) => ['HIGH', 'CRITICAL'].includes(ticket.priority)).length,
        recentlyUpdated: tickets.filter((ticket) => {
            if (!ticket.updatedAt) {
                return false;
            }
            return new Date(ticket.updatedAt) >= threeDaysAgo;
        }).length,
    };
}

export async function updateTicketPriority(ticketId, priority) {
    const response = await apiFetch(`/api/tickets/${ticketId}/priority`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ priority }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to update priority (${response.status})`);
    }

    return data;
}

export async function createTicket({ title, description, priority, type, status = 'OPEN' }) {
    const response = await apiFetch('/api/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({
            title,
            description,
            priority,
            type,
            status,
        }),
    });


    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to submit ticket (${response.status})`);
    }

    return data;
}

function ticketMatchesSearchQuery(ticket, query) {
    const q = query.trim().toLowerCase();
    if (!q) {
        return false;
    }

    const idDigits = String(ticket.id ?? '');
    const formattedId = formatTicketNumber(ticket.id).toLowerCase();
    const normalizedQuery = q.replace(/^tkt-0*/i, '');

    return (
        ticket.title?.toLowerCase().includes(q) ||
        formattedId.includes(q) ||
        idDigits.includes(normalizedQuery) ||
        ticket.description?.toLowerCase().includes(q)
    );
}

function filterTicketsForSearch(tickets, query) {
    return tickets
        .filter((ticket) => ticketMatchesSearchQuery(ticket, query))
        .slice(0, SEARCH_RESULT_LIMIT);
}

export async function searchMyTickets(query) {
    const tickets = await fetchMyTicketsForCurrentUser();
    return filterTicketsForSearch(tickets, query);
}

export async function searchTicketsForConsultant(query) {
    const tickets = await fetchAssignedTicketsForCurrentUser();
    return filterTicketsForSearch(tickets, query);
}

export async function searchTicketsForSupport(query) {
    const tickets = await fetchAllTickets();
    return filterTicketsForSearch(tickets, query);
}

export async function fetchAllTickets() {
    const response = await apiFetch('/api/tickets', {
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to load tickets (${response.status})`);
    }

    if (!Array.isArray(data)) {
        throw new Error('Unexpected tickets response from server');
    }

    return data.map(mapTicket);
}

export async function acceptTicket(ticketId) {
    const response = await apiFetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({
            status: 'ACCEPTED',
        }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to accept ticket (${response.status})`);
    }

    return data;
}

export async function denyTicket(ticketId) {
    const response = await apiFetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({
            status: 'DENIED',
        }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to decline ticket (${response.status})`);
    }

    return data;
}

export async function assignTicket(ticketId, assigneeId) {
    const response = await apiFetch(`/api/tickets/${ticketId}/assignee/${assigneeId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to assign ticket (${response.status})`);
    }

    return data;
}

export async function changeTicketStatus(ticketId, status) {
    const response = await apiFetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({
            status,
        }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to change ticket status (${response.status})`);
    }

    return data;
}

export async function fetchTicketById(id) {
    if (!getStoredToken()) {
        throw new Error('Not authenticated. Please log in again.');
    }
    const response = await apiFetch(`/api/tickets/${id}`, {
        headers: { Accept: 'application/json', ...getAuthHeaders() },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data?.error || `Failed to load ticket (${response.status})`);
    }
    return mapTicket(data);
}

function mapComment(raw) {
    return {
        id: raw.id,
        userId: raw.userId,
        username: raw.username ?? 'Unknown',
        role: raw.role ?? '',
        content: raw.content ?? '',
        isInternal: raw.isInternal ?? raw.internal ?? false,
        createdAt: raw.createdAt ?? null,
    };
}

export async function fetchTicketComments(ticketId) {
    if (!getStoredToken()) {
        throw new Error('Not authenticated. Please log in again.');
    }

    const response = await apiFetch(`/api/tickets/${ticketId}/comments`, {
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to load comments (${response.status})`);
    }

    if (!Array.isArray(data)) {
        throw new Error('Unexpected comments response from server');
    }

    return data.map(mapComment);
}

export async function addTicketComment(ticketId, content, isInternal = false) {
    const response = await apiFetch(`/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ content, internal: isInternal }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to post comment (${response.status})`);
    }

    return mapComment(data);
}