import { normalizeRole } from '@js/domain/auth/roles';
import { getAuditActionMeta } from '@js/domain/audit/auditCatalog';
import { formatTicketNumber } from '@js/domain/tickets/ticketCatalog';

const NOTIFICATION_ACTIONS = new Set([
    'TICKET_CREATED',
    'TICKET_ASSIGNED',
    'TICKET_PRIORITY_UPDATED',
    'TICKET_COMMENT_ADDED',
    'COMMENT_ADDED',
    'STATUS_OPEN',
    'STATUS_IN_REVIEW',
    'STATUS_ACCEPTED',
    'STATUS_DENIED',
    'STATUS_ASSIGNED',
    'STATUS_CLOSED',
]);

const LAST_SEEN_PREFIX = 'emagiz:activity:lastSeen:';

function isNotificationAction(action) {
    const key = String(action || '').toUpperCase();
    if (NOTIFICATION_ACTIONS.has(key)) {
        return true;
    }
    return key.startsWith('STATUS_');
}

export function getLastSeenAt(userId) {
    if (!userId) {
        return null;
    }
    const raw = localStorage.getItem(`${LAST_SEEN_PREFIX}${userId}`);
    if (!raw) {
        return null;
    }
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function setLastSeenAt(userId, date = new Date()) {
    if (!userId) {
        return;
    }
    localStorage.setItem(`${LAST_SEEN_PREFIX}${userId}`, date.toISOString());
}

export function formatActivityTime(value) {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    const diffMs = Date.now() - date.getTime();

    if (diffMs < 60_000) {
        return 'Just now';
    }
    if (diffMs < 3_600_000) {
        return `${Math.floor(diffMs / 60_000)}m ago`;
    }
    if (diffMs < 86_400_000) {
        return `${Math.floor(diffMs / 3_600_000)}h ago`;
    }

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    });
}

function buildNotificationTitle(log, actor) {
    const action = String(log.action || '').toUpperCase();
    const actorName = actor?.username;

    if (action === 'TICKET_CREATED') {
        return 'New ticket submitted';
    }
    if (action === 'TICKET_COMMENT_ADDED' || action === 'COMMENT_ADDED') {
        return actorName ? `New comment from ${actorName}` : 'New comment on ticket';
    }
    if (action === 'TICKET_ASSIGNED') {
        return 'Ticket assigned to consultant';
    }
    if (action === 'TICKET_PRIORITY_UPDATED') {
        return 'Ticket priority updated';
    }
    if (action.startsWith('STATUS_')) {
        return getAuditActionMeta(action).label;
    }

    return getAuditActionMeta(action).label;
}

export function buildActivityFeed({
    role,
    userId,
    tickets = [],
    auditLogs = [],
    users = [],
    limit = 20,
    lastSeenAt = null,
}) {
    const ticketIds = new Set(tickets.map((ticket) => ticket.id));
    const ticketById = new Map(tickets.map((ticket) => [ticket.id, ticket]));
    const userById = new Map(users.map((user) => [user.id, user]));
    const normalizedRole = normalizeRole(role);
    const seenAt = lastSeenAt ? new Date(lastSeenAt).getTime() : 0;

    const items = auditLogs
        .filter((log) => {
            if (!log.ticketId || !ticketIds.has(log.ticketId)) {
                return false;
            }
            if (!isNotificationAction(log.action)) {
                return false;
            }
            if (log.userId != null && log.userId === userId) {
                return false;
            }
            if (normalizedRole === 'customer' && log.action === 'TICKET_CREATED') {
                return false;
            }
            return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
        .map((log) => {
            const ticket = ticketById.get(log.ticketId);
            const actor = log.userId ? userById.get(log.userId) : null;
            const createdAtMs = log.createdAt ? new Date(log.createdAt).getTime() : 0;

            return {
                id: `audit-${log.id}`,
                ticketId: log.ticketId,
                ticketLabel: formatTicketNumber(log.ticketId),
                ticketTitle: ticket?.title ?? '',
                title: buildNotificationTitle(log, actor),
                subtitle: actor?.username ?? 'System',
                action: log.action,
                createdAt: log.createdAt,
                timeLabel: formatActivityTime(log.createdAt),
                isUnread: createdAtMs > seenAt,
            };
        });

    const unreadCount = items.filter((item) => item.isUnread).length;

    return { items, unreadCount };
}

export function computeRecentUpdatesCount({
    userId,
    tickets = [],
    auditLogs = [],
    days = 3,
}) {
    const ticketIds = new Set(tickets.map((ticket) => ticket.id));
    const cutoff = Date.now() - days * 86_400_000;

    return auditLogs.filter((log) => {
        if (!log.ticketId || !ticketIds.has(log.ticketId)) {
            return false;
        }
        if (!isNotificationAction(log.action)) {
            return false;
        }
        if (log.userId != null && log.userId === userId) {
            return false;
        }
        if (log.action === 'TICKET_CREATED') {
            return false;
        }
        const createdAtMs = log.createdAt ? new Date(log.createdAt).getTime() : 0;
        return createdAtMs >= cutoff;
    }).length;
}

export function computeResolvedThisMonthCount({
    tickets = [],
    auditLogs = [],
}) {
    const ticketIds = new Set(tickets.map((ticket) => ticket.id));
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const closedThisMonth = new Set();

    for (const log of auditLogs) {
        if (String(log.action || '').toUpperCase() !== 'STATUS_CLOSED') {
            continue;
        }
        if (!log.ticketId || !ticketIds.has(log.ticketId)) {
            continue;
        }
        const createdAt = log.createdAt ? new Date(log.createdAt) : null;
        if (!createdAt || Number.isNaN(createdAt.getTime()) || createdAt < monthStart) {
            continue;
        }
        closedThisMonth.add(log.ticketId);
    }

    if (closedThisMonth.size > 0) {
        return closedThisMonth.size;
    }

    return tickets.filter((ticket) => {
        if (String(ticket.status || '').toUpperCase() !== 'CLOSED' || !ticket.updatedAt) {
            return false;
        }
        const updatedAt = new Date(ticket.updatedAt);
        return !Number.isNaN(updatedAt.getTime()) && updatedAt >= monthStart;
    }).length;
}
