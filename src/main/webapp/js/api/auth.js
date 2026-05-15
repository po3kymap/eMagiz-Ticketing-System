export function getCurrentUser() {
    return Promise.resolve({
        name: 'Ruslan Morozov',
        email: 'r.morozov@acmecorp.com',
        role: 'Customer',
        organization: 'Huesos Corp'
    });
}

export function isAuthenticated() {
    return Promise.resolve(true);
}
