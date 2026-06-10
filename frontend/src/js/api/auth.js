const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

function saveSession(data) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
        username: data.username,
        role: data.role,
        userId: data.userId ?? data.id ?? null,
        email: data.email ?? null,
        company: data.company ?? null,
    }));
}

export async function login(username, password) {
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || 'Invalid username or password');
    }

    if (!data.token) {
        throw new Error('Unexpected login response from server');
    }

    saveSession(data);
    return data;
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getAuthHeaders() {
    const token = getStoredToken();
    if (!token) {
        return {};
    }
    return { Authorization: `Bearer ${token}` };
}

export async function getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function isAuthenticated() {
    return Boolean(getStoredToken());
}

export function getHomeRouteForRole(role) {
    const normalized = String(role || '').trim().toLowerCase();

    if (normalized === 'consultant') {
        return { name: 'consultant' };
    }

    if (normalized === 'support') {
        return { name: 'support' };
    }

    return { name: 'customer' };
}
