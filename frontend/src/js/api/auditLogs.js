import { getAuthHeaders } from '@api/auth';
import { apiFetch } from '@js/api/http';
import { isSupportRole } from '@js/domain/auth/roles';

function mapAuditLog(raw) {
    return {
        id: raw.id,
        ticketId: raw.ticketId ?? null,
        userId: raw.userId ?? null,
        action: raw.action ?? '',
        details: raw.details ?? null,
        createdAt: raw.createdAt ?? null,
    };
}

export async function fetchAuditLogs() {
    const response = await apiFetch('/api/audit-logs', {
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to load audit logs (${response.status})`);
    }

    if (!Array.isArray(data)) {
        throw new Error('Unexpected audit log response from server');
    }

    return data.map(mapAuditLog);
}

export async function fetchAccessibleAuditLogs() {
    const response = await apiFetch('/api/audit-logs/accessible', {
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to load audit logs (${response.status})`);
    }

    if (!Array.isArray(data)) {
        throw new Error('Unexpected audit log response from server');
    }

    return data.map(mapAuditLog);
}

export async function fetchAuditLogsForRole(role) {
    if (isSupportRole(role)) {
        return fetchAuditLogs();
    }
    return fetchAccessibleAuditLogs();
}

export async function fetchTicketAuditLogs(ticketId) {
    if (!ticketId) {
        throw new Error('Missing ticket id');
    }

    const response = await apiFetch(`/api/audit-logs/ticket/${ticketId}`, {
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to load ticket audit logs (${response.status})`);
    }

    if (!Array.isArray(data)) {
        throw new Error('Unexpected audit log response from server');
    }

    return data.map(mapAuditLog);
}
