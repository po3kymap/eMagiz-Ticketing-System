import { logout } from '@api/auth';

let routerInstance = null;
let isHandlingAuthFailure = false;

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export function configureApiClient(router) {
    routerInstance = router;
}

async function handleUnauthorized() {
    if (isHandlingAuthFailure || !routerInstance) {
        return;
    }

    isHandlingAuthFailure = true;
    logout();

    try {
        await routerInstance.replace({ name: 'login' });
    } finally {
        isHandlingAuthFailure = false;
    }
}

export async function apiFetch(input, init = {}) {
    const response = await fetch(input, init);

    if (response.status === 401) {
        await handleUnauthorized();
        throw new ApiError('Session expired. Please sign in again.', 401);
    }

    if (response.status === 403) {
        throw new ApiError('You do not have permission to perform this action.', 403);
    }

    return response;
}
