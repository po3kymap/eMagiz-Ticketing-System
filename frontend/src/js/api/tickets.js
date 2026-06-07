import { getAuthHeaders, getCurrentUser, getStoredToken } from '@api/auth';
import { parseTicketTypeFromDescription } from '@js/domain/tickets/ticketCatalog';

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
        type: raw.type ?? parseTicketTypeFromDescription(raw.description ?? ''),
        priority: raw.priority ?? null,
        status: raw.status ?? null,
        creatorId: raw.creatorId,
        assigneeId: raw.assigneeId ?? null,
        createdAt: raw.createdAt ?? null,
        updatedAt: raw.updatedAt ?? null,
    };
}

export async function fetchMyTickets(clientId) {
    if (!clientId) {
        throw new Error('Missing user id. Please log in again.');
    }

    if (!getStoredToken()) {
        throw new Error('Not authenticated. Please log in again.');
    }

    const response = await fetch(`/api/tickets/client/${clientId}`, {
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

export async function createTicket({ title, description, priority, type, status = 'OPEN' }) {
    const response = await fetch('/api/tickets', {
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
