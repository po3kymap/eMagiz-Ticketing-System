export const ROLES = {
    CUSTOMER: 'customer',
    CONSULTANT: 'consultant',
    SUPPORT: 'support',
};

export function normalizeRole(role) {
    return String(role || '').trim().toLowerCase();
}

export function roleCanAccessPath(role, path) {
    const normalizedRole = normalizeRole(role);
    const normalizedPath = String(path || '');

    if (normalizedPath.startsWith('/customer')) {
        return normalizedRole === ROLES.CUSTOMER;
    }

    if (normalizedPath.startsWith('/consultant')) {
        return normalizedRole === ROLES.CONSULTANT;
    }

    if (normalizedPath.startsWith('/support')) {
        return normalizedRole === ROLES.SUPPORT;
    }

    return true;
}
