export const TICKET_TYPES = {
    INCIDENT: {
        key: 'INCIDENT',
        label: 'Incident',
        badgeClass: 'bg-red-50 text-red-700 ring-red-100',
        chartColor: '#ef4444',
    },
    RFC: {
        key: 'RFC',
        label: 'RFC',
        badgeClass: 'bg-sky-50 text-sky-700 ring-sky-100',
        chartColor: '#3b82f6',
    },
    OTHER: {
        key: 'OTHER',
        label: 'Other',
        badgeClass: 'bg-violet-50 text-violet-700 ring-violet-100',
        chartColor: '#8b5cf6',
    },
    INTERNAL: {
        key: 'INTERNAL',
        label: 'Internal',
        badgeClass: 'bg-slate-100 text-slate-700 ring-slate-200',
        chartColor: '#64748b',
        staffOnly: true,
    },
};

/** Types customers can submit; INTERNAL is staff-only */
export const CUSTOMER_TICKET_TYPE_KEYS = ['INCIDENT', 'RFC', 'OTHER'];

export function isInternalTicket(ticket) {
    return String(ticket?.type || '').trim().toUpperCase() === 'INTERNAL';
}

export const TICKET_PRIORITIES = {
    LOW: {
        key: 'LOW',
        label: 'Low',
        badgeClass: 'bg-slate-100 text-slate-600 ring-slate-200',
        dotClass: 'bg-slate-400',
    },
    MEDIUM: {
        key: 'MEDIUM',
        label: 'Medium',
        badgeClass: 'bg-amber-50 text-amber-700 ring-amber-100',
        dotClass: 'bg-amber-500',
    },
    HIGH: {
        key: 'HIGH',
        label: 'High',
        badgeClass: 'bg-orange-50 text-orange-700 ring-orange-100',
        dotClass: 'bg-orange-500',
    },
    CRITICAL: {
        key: 'CRITICAL',
        label: 'Critical',
        badgeClass: 'bg-red-50 text-red-700 ring-red-100',
        dotClass: 'bg-red-500',
    },
};

export const TICKET_PRIORITY_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export function compareTicketPriority(a, b) {
    const indexA = TICKET_PRIORITY_ORDER.indexOf(String(a || '').trim().toUpperCase());
    const indexB = TICKET_PRIORITY_ORDER.indexOf(String(b || '').trim().toUpperCase());
    const rankA = indexA === -1 ? TICKET_PRIORITY_ORDER.length : indexA;
    const rankB = indexB === -1 ? TICKET_PRIORITY_ORDER.length : indexB;
    return rankA - rankB;
}

export const TICKET_STATUSES = {
    OPEN: {
        key: 'OPEN',
        label: 'Open',
        badgeClass: 'bg-blue-50 text-blue-700 ring-blue-100',
    },
    ASSIGNED: {
        key: 'ASSIGNED',
        label: 'Assigned',
        badgeClass: 'bg-violet-50 text-violet-700 ring-violet-100',
    },
    IN_REVIEW: {
        key: 'IN_REVIEW',
        label: 'In Review',
        badgeClass: 'bg-amber-50 text-amber-700 ring-amber-100',
    },
    ACCEPTED: {
        key: 'ACCEPTED',
        label: 'Accepted',
        badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    },
    DENIED: {
        key: 'DENIED',
        label: 'Denied',
        badgeClass: 'bg-red-50 text-red-700 ring-red-100',
    },
    CLOSED: {
        key: 'CLOSED',
        label: 'Closed',
        badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    },
};

export const TICKET_STATUS_ORDER = ['OPEN', 'IN_REVIEW', 'ACCEPTED', 'ASSIGNED', 'DENIED', 'CLOSED'];

export function compareTicketStatus(a, b) {
    const indexA = TICKET_STATUS_ORDER.indexOf(String(a || '').trim().toUpperCase());
    const indexB = TICKET_STATUS_ORDER.indexOf(String(b || '').trim().toUpperCase());
    const rankA = indexA === -1 ? TICKET_STATUS_ORDER.length : indexA;
    const rankB = indexB === -1 ? TICKET_STATUS_ORDER.length : indexB;
    return rankA - rankB;
}

const UNKNOWN_BADGE = {
    badgeClass: 'bg-slate-100 text-slate-600 ring-slate-200',
    dotClass: 'bg-slate-400',
};

export function getTicketTypeMeta(type) {
    const key = String(type || '').trim().toUpperCase();
    return TICKET_TYPES[key] ?? { key: type, label: type || 'Unknown', ...UNKNOWN_BADGE };
}

export function getTicketPriorityMeta(priority) {
    const safePriority = String(priority || '').trim().toUpperCase();
    
    return TICKET_PRIORITIES[safePriority] ?? { 
        key: priority, 
        label: priority || 'Unknown', 
        ...UNKNOWN_BADGE 
    };
}

export function getTicketStatusMeta(status) {
    return TICKET_STATUSES[status] ?? { key: status, label: status || 'Unknown', ...UNKNOWN_BADGE };
}

export function formatTicketNumber(id) {
    return `TKT-${String(id).padStart(4, '0')}`;
}

export function getTicketCompanyLabel(ticket) {
    if (isInternalTicket(ticket)) {
        return 'Internal';
    }
    const company = String(ticket?.company || '').trim();
    return company || '—';
}
