const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export const TICKET_SLA_BY_PRIORITY = {
    CRITICAL: {
        responseMs: 8 * HOUR_MS,
        resolutionMs: 10 * HOUR_MS,
        responseLabel: '8h',
        resolutionLabel: '10h',
    },
    HIGH: {
        responseMs: 24 * HOUR_MS,
        resolutionMs: 2 * DAY_MS,
        responseLabel: '24h',
        resolutionLabel: '2d',
    },
    MEDIUM: {
        responseMs: 2 * DAY_MS,
        resolutionMs: 7 * DAY_MS,
        responseLabel: '2d',
        resolutionLabel: '7d',
    },
    LOW: {
        responseMs: 3 * DAY_MS,
        resolutionMs: 10 * DAY_MS,
        responseLabel: '3d',
        resolutionLabel: '10d',
    },
};

export const SLA_OVERVIEW_ROWS = [
    {
        label: 'Critical',
        badgeClass: 'bg-red-100 text-red-700',
        response: TICKET_SLA_BY_PRIORITY.CRITICAL.responseLabel,
        resolve: TICKET_SLA_BY_PRIORITY.CRITICAL.resolutionLabel,
    },
    {
        label: 'High',
        badgeClass: 'bg-orange-100 text-orange-800',
        response: TICKET_SLA_BY_PRIORITY.HIGH.responseLabel,
        resolve: TICKET_SLA_BY_PRIORITY.HIGH.resolutionLabel,
    },
    {
        label: 'Medium',
        badgeClass: 'bg-yellow-100 text-yellow-800',
        response: TICKET_SLA_BY_PRIORITY.MEDIUM.responseLabel,
        resolve: TICKET_SLA_BY_PRIORITY.MEDIUM.resolutionLabel,
    },
    {
        label: 'Low',
        badgeClass: 'bg-slate-100 text-slate-600',
        response: TICKET_SLA_BY_PRIORITY.LOW.responseLabel,
        resolve: TICKET_SLA_BY_PRIORITY.LOW.resolutionLabel,
    },
];

const RESPONSE_STATUSES = new Set(['OPEN', 'IN_REVIEW']);

function normalizePriority(priority) {
    const key = String(priority || 'MEDIUM').trim().toUpperCase();
    return TICKET_SLA_BY_PRIORITY[key] ? key : 'MEDIUM';
}

function parseDate(value) {
    if (!value) {
        return null;
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function getSlaConfig(priority) {
    return TICKET_SLA_BY_PRIORITY[normalizePriority(priority)];
}

export function formatSlaDuration(ms) {
    const safeMs = Math.max(0, ms);
    const hours = Math.floor(safeMs / HOUR_MS);
    const days = Math.floor(safeMs / DAY_MS);

    if (days >= 1) {
        const remainingHours = hours % 24;
        return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }

    if (hours >= 1) {
        return `${hours}h`;
    }

    const minutes = Math.max(1, Math.floor(safeMs / (60 * 1000)));
    return `${minutes}m`;
}

export function formatSlaDueDate(value) {
    const date = parseDate(value);
    if (!date) {
        return '—';
    }

    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export function formatSlaDueDateShort(value) {
    const date = parseDate(value);
    if (!date) {
        return '—';
    }

    return date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
    });
}

const RESPONSE_MET_ACTIONS = new Set([
    'STATUS_IN_REVIEW',
    'STATUS_ACCEPTED',
    'STATUS_DENIED',
    'TICKET_ASSIGNED',
]);

const ASSIGNED_ACTIONS = new Set(['TICKET_ASSIGNED', 'STATUS_ASSIGNED']);

const CLOSED_ACTIONS = new Set(['STATUS_CLOSED']);

function findFirstAuditTime(auditLogs, actionSet) {
    const sorted = [...(auditLogs || [])].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    for (const log of sorted) {
        const action = String(log.action || '').toUpperCase();
        if (actionSet.has(action)) {
            const date = parseDate(log.createdAt);
            if (date) {
                return date;
            }
        }
    }

    return null;
}

export function findResponseMetTime(auditLogs) {
    return findFirstAuditTime(auditLogs, RESPONSE_MET_ACTIONS);
}

export function findAssignedTime(auditLogs) {
    return findFirstAuditTime(auditLogs, ASSIGNED_ACTIONS);
}

export function getResponseSlaDisplay(ticket, auditLogs = [], now = Date.now()) {
    const config = getSlaConfig(ticket?.priority);
    const created = parseDate(ticket?.createdAt);
    if (!created) {
        return { state: 'none', label: '—' };
    }

    const status = String(ticket?.status || '').toUpperCase();
    const inResponsePhase = RESPONSE_STATUSES.has(status);

    if (inResponsePhase) {
        const elapsedMs = now - created.getTime();
        const breached = elapsedMs > config.responseMs;
        const remainingMs = Math.max(0, config.responseMs - elapsedMs);

        return {
            state: 'active',
            breached,
            elapsedMs,
            limitMs: config.responseMs,
            limitLabel: config.responseLabel,
            label: breached
                ? `Breached (${formatSlaDuration(elapsedMs)})`
                : `${formatSlaDuration(remainingMs)} left`,
        };
    }

    const metAt = findResponseMetTime(auditLogs) || parseDate(ticket?.updatedAt);
    const elapsedMs = metAt
        ? metAt.getTime() - created.getTime()
        : now - created.getTime();
    const breached = elapsedMs > config.responseMs;

    return {
        state: 'met',
        breached,
        elapsedMs,
        limitMs: config.responseMs,
        limitLabel: config.responseLabel,
        label: breached
            ? `Breached (${formatSlaDuration(elapsedMs)})`
            : `Met (${formatSlaDuration(elapsedMs)})`,
    };
}

export function getResolutionSlaDisplay(ticket, auditLogs = [], now = Date.now()) {
    const config = getSlaConfig(ticket?.priority);
    const status = String(ticket?.status || '').toUpperCase();

    if (status === 'DENIED') {
        return { state: 'none', label: '—' };
    }

    if (status === 'CLOSED') {
        const assignedAt = findAssignedTime(auditLogs) || parseDate(ticket?.updatedAt);
        if (!assignedAt) {
            return { state: 'none', label: '—' };
        }

        const closedAt = findFirstAuditTime(auditLogs, CLOSED_ACTIONS) || parseDate(ticket?.updatedAt);
        const elapsedMs = closedAt.getTime() - assignedAt.getTime();
        const breached = elapsedMs > config.resolutionMs;

        return {
            state: 'met',
            breached,
            elapsedMs,
            limitMs: config.resolutionMs,
            limitLabel: config.resolutionLabel,
            label: breached
                ? `Breached (${formatSlaDuration(elapsedMs)})`
                : `Met (${formatSlaDuration(elapsedMs)})`,
        };
    }

    if (status === 'ASSIGNED') {
        const start = findAssignedTime(auditLogs)
            || parseDate(ticket?.updatedAt)
            || parseDate(ticket?.createdAt);
        const elapsedMs = now - start.getTime();
        const breached = elapsedMs > config.resolutionMs;
        const percentUsed = Math.min(100, Math.round((elapsedMs / config.resolutionMs) * 100));
        const dueAt = new Date(start.getTime() + config.resolutionMs);

        return {
            state: 'active',
            breached,
            elapsedMs,
            limitMs: config.resolutionMs,
            limitLabel: config.resolutionLabel,
            dueAt,
            percentUsed,
            label: breached ? 'Overdue' : `Due ${formatSlaDueDateShort(dueAt)}`,
        };
    }

    return {
        state: 'pending',
        label: 'Pending assignment',
    };
}

export function getTicketSlaContext(ticket, now = Date.now()) {
    const status = String(ticket?.status || '').toUpperCase();
    const config = getSlaConfig(ticket?.priority);

    if (RESPONSE_STATUSES.has(status)) {
        const start = parseDate(ticket?.createdAt);
        if (!start) {
            return { active: false, kind: 'none' };
        }

        const elapsedMs = now - start.getTime();
        const limitMs = config.responseMs;

        return {
            active: true,
            kind: 'response',
            label: 'Response SLA',
            limitLabel: config.responseLabel,
            breached: elapsedMs > limitMs,
            elapsedMs,
            limitMs,
            dueAt: new Date(start.getTime() + limitMs),
        };
    }

    if (status === 'ASSIGNED') {
        const start = parseDate(ticket?.updatedAt) || parseDate(ticket?.createdAt);
        if (!start) {
            return { active: false, kind: 'none' };
        }

        const elapsedMs = now - start.getTime();
        const limitMs = config.resolutionMs;

        return {
            active: true,
            kind: 'resolution',
            label: 'Resolution SLA',
            limitLabel: config.resolutionLabel,
            breached: elapsedMs > limitMs,
            elapsedMs,
            limitMs,
            dueAt: new Date(start.getTime() + limitMs),
        };
    }

    return { active: false, kind: 'none' };
}
