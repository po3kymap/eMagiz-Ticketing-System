import { createRouter, createWebHashHistory } from 'vue-router';
import { isAuthenticated } from '@api/auth';
import Login from '@/views/login/LoginPage.vue';
import MenuLayout from '@/layout/MenuLayout.vue';
import CustomerDashboard from '@views/dashboard/DashboardView.vue';

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { public: true },
    },
    {
        path: '/dashboard',
        component: MenuLayout,
        meta: { requiresAuth: false },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: CustomerDashboard,
            },
        ],
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
        return { name: 'dashboard' };
    }

    return true;
});

export default router;