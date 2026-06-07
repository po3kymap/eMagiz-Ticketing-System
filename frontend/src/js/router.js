import { createRouter, createWebHashHistory } from 'vue-router';
import { isAuthenticated } from '@api/auth';
import Login from '@views/auth/Login.vue';
import CustomerDashboard from '@views/customer/CustomerDashboard.vue';

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
        path: '/dashboard',
        name: 'dashboard',
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
        return { name: 'dashboard' };
    }

    return true;
});

export default router;
