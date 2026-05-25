import { createRouter, createWebHashHistory } from 'vue-router';
import { isAuthenticated } from '@api/auth';
import Login from '@views/auth/Login.js';
import CustomerDashboard from '@views/customer/Dashboard.js';

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { public: true },
    },
    {
        path: '/customer',
        name: 'customer',
        component: CustomerDashboard,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        return { name: 'login' };
    }

    if (to.name === 'login' && isAuthenticated()) {
        return { name: 'customer' };
    }

    return true;
});

export default router;
