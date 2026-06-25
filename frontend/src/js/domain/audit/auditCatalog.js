export const AUDIT_ACTION_META = {
    TICKET_CREATED: {
        label: 'Ticket Created',
        tone: 'blue',
        filterKey: 'TICKET_CREATED',
    },
    TICKET_UPDATED: {
        label: 'Ticket Updated',
        tone: 'slate',
        filterKey: 'TICKET_UPDATED',
    },
    TICKET_STATUS_UPDATED: {
        label: 'Status Changed',
        tone: 'purple',
        filterKey: 'STATUS_CHANGED',
    },
    STATUS_OPEN: {
        label: 'Reopened',
        tone: 'blue',
        filterKey: 'STATUS_CHANGED',
    },
    STATUS_IN_REVIEW: {
        label: 'Reviewed by Support',
        tone: 'orange',
        filterKey: 'STATUS_CHANGED',
    },
    STATUS_ACCEPTED: {
        label: 'Accepted',
        tone: 'emerald',
        filterKey: 'STATUS_CHANGED',
    },
    STATUS_DENIED: {
        label: 'Denied',
        tone: 'red',
        filterKey: 'STATUS_CHANGED',
    },
    STATUS_CLOSED: {
        label: 'Resolved / Closed',
        tone: 'slate',
        filterKey: 'STATUS_CHANGED',
    },
    TICKET_PRIORITY_UPDATED: {
        label: 'Priority Changed',
        tone: 'orange',
        filterKey: 'PRIORITY_CHANGED',
    },
    TICKET_ASSIGNED: {
        label: 'Assigned Consultant',
        tone: 'purple',
        filterKey: 'ASSIGNED',
    },
    TICKET_COMMENT_ADDED: {
        label: 'Comment Added',
        tone: 'slate',
        filterKey: 'COMMENT_ADDED',
    },
    COMMENT_ADDED: {
        label: 'Comment Added',
        tone: 'slate',
        filterKey: 'COMMENT_ADDED',
    },
    USER_CREATED: {
        label: 'User Created',
        tone: 'blue',
        filterKey: 'USER_CREATED',
    },
    PASSWORD_UPDATED: {
        label: 'Password Updated',
        tone: 'slate',
        filterKey: 'PASSWORD_UPDATED',
    },
};

export const AUDIT_ROLE_OPTIONS = [
    { key: 'ALL', label: 'All Roles' },
    { key: 'CUSTOMER', label: 'Customer' },
    { key: 'CONSULTANT', label: 'Consultant' },
    { key: 'SUPPORT', label: 'Support' },
];

export const AUDIT_ACTION_OPTIONS = [
    { key: 'ALL', label: 'All Actions' },
    { key: 'TICKET_CREATED', label: 'Ticket Created' },
    { key: 'STATUS_CHANGED', label: 'Status Changed' },
    { key: 'PRIORITY_CHANGED', label: 'Priority Changed' },
    { key: 'ASSIGNED', label: 'Assigned Consultant' },
    { key: 'COMMENT_ADDED', label: 'Comment Added' },
    { key: 'USER_CREATED', label: 'User Created' },
    { key: 'PASSWORD_UPDATED', label: 'Password Updated' },
];

export const AUDIT_SORT_OPTIONS = [
    { key: 'desc', label: 'Newest first' },
    { key: 'asc', label: 'Oldest first' },
];

const ACTION_TONE_CLASS = {
    blue: 'text-blue-700',
    purple: 'text-violet-700',
    orange: 'text-orange-700',
    emerald: 'text-emerald-700',
    red: 'text-red-700',
    slate: 'text-slate-700',
};

const ROLE_BADGE_CLASS = {
    CUSTOMER: 'bg-blue-50 text-blue-700 ring-blue-100',
    CONSULTANT: 'bg-violet-50 text-violet-700 ring-violet-100',
    SUPPORT: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    SYSTEM: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export function getAuditActionMeta(action) {
    const key = String(action || '').toUpperCase();
    return AUDIT_ACTION_META[key] ?? {
        label: key.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
        tone: 'slate',
        filterKey: key,
    };
}

const ACTION_TONE_DOT_CLASS = {
    blue: 'bg-blue-500',
    purple: 'bg-violet-500',
    orange: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    red: 'bg-red-500',
    slate: 'bg-slate-500',
};

const LIFECYCLE_ACTIONS = new Set([
    'TICKET_CREATED',
    'TICKET_ASSIGNED',
    'STATUS_OPEN',
    'STATUS_IN_REVIEW',
    'STATUS_ACCEPTED',
    'STATUS_DENIED',
    'STATUS_CLOSED',
]);

export const HIDDEN_AUDIT_ACTIONS = new Set(['STATUS_ASSIGNED']);

export function isHiddenAuditAction(action) {
    return HIDDEN_AUDIT_ACTIONS.has(String(action || '').toUpperCase());
}

export function isLifecycleAction(action) {
    const key = String(action || '').toUpperCase();
    return LIFECYCLE_ACTIONS.has(key);
}

export function getAuditTimelineLabel(action, { user, details, userById, isInternal = false } = {}) {
    const key = String(action || '').toUpperCase();
    const actorName = user?.username;

    switch (key) {
    case 'TICKET_CREATED':
        return isInternal
            ? (actorName ? `Created by support (${actorName})` : 'Created by support')
            : 'Submitted by customer';
    case 'STATUS_IN_REVIEW':
        return actorName ? `Reviewed by Support (${actorName})` : 'Reviewed by Support';
    case 'STATUS_ACCEPTED':
        return 'Accepted';
    case 'STATUS_DENIED':
        return 'Denied';
    case 'STATUS_CLOSED':
        return 'Resolved / Closed';
    case 'TICKET_ASSIGNED': {
        const assigneeId = details ? Number(details) : null;
        const assignee = assigneeId && userById ? userById.get(assigneeId) : null;
        return assignee
            ? `Assigned to Consultant (${assignee.username})`
            : 'Assigned to Consultant';
    }
    default:
        return getAuditActionMeta(action).label;
    }
}

export function getAuditTimelineColor(action) {
    const key = String(action || '').toUpperCase();

    switch (key) {
    case 'TICKET_CREATED':
        return 'bg-blue-500';
    case 'STATUS_IN_REVIEW':
        return 'bg-amber-500';
    case 'STATUS_ACCEPTED':
        return 'bg-emerald-500';
    case 'STATUS_DENIED':
        return 'bg-red-500';
    case 'TICKET_ASSIGNED':
        return 'bg-violet-500';
    case 'STATUS_CLOSED':
        return 'bg-slate-500';
    default: {
        const meta = getAuditActionMeta(action);
        return ACTION_TONE_DOT_CLASS[meta.tone] ?? ACTION_TONE_DOT_CLASS.slate;
    }
    }
}

export function getAuditActionClass(action) {
    const meta = getAuditActionMeta(action);
    return ACTION_TONE_CLASS[meta.tone] ?? ACTION_TONE_CLASS.slate;
}

export function getAuditRoleBadgeClass(role) {
    const key = String(role || 'SYSTEM').toUpperCase();
    return ROLE_BADGE_CLASS[key] ?? ROLE_BADGE_CLASS.SYSTEM;
}

export function formatAuditRoleLabel(role) {
    const key = String(role || 'System').toUpperCase();
    if (key === 'SYSTEM') {
        return 'System';
    }
    return key.charAt(0) + key.slice(1).toLowerCase();
}

export function formatAuditTimestamp(value) {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    const formatted = date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    });

    return `${formatted} UTC`;
}

export function getUserInitials(name) {
    if (!name) {
        return 'SY';
    }

    return name
        .split(/\s+/)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}
