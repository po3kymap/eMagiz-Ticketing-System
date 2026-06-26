import { getAuthHeaders, getCurrentUser, getStoredToken } from '@api/auth';
import { apiFetch } from '@js/api/http';
import { isSupportRole } from '@js/domain/auth/roles';

function mapUser(raw) {
    return {
        id: raw.id,
        username: raw.username,
        email: raw.email,
        role: raw.role,
        company: raw.company,
    };
}

export async function fetchUsers() {
    const response = await apiFetch('/api/users', {
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to load users (${response.status})`);
    }

    return data.map(mapUser);
}

export async function fetchUserDirectory() {
    const response = await apiFetch('/api/users/directory', {
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to load user directory (${response.status})`);
    }

    return data.map(mapUser);
}

export async function fetchUsersForRole(role) {
    if (isSupportRole(role)) {
        return fetchUsers();
    }
    return fetchUserDirectory();
}

export async function createUser(user) {
    const payload = {
        ...user,
        role: String(user.role || '').trim().toUpperCase(),
    };

    const response = await apiFetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to create user (${response.status})`);
    }

    return data;
}

export async function deleteUser(userId) {
    const response = await apiFetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            ...getAuthHeaders(),
        },
    });

    if (response.status === 204) {
        return;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || `Failed to delete user (${response.status})`);
    }
}