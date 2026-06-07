import { createRouter, createWebHashHistory } from 'vue-router';
import { getCurrentUser, getHomeRouteForRole, isAuthenticated } from '@api/auth';
import ConsultantHome from '@/views/consultant/ConsultantHome.vue';
import { createConsultantPlaceholder } from '@/views/consultant/ConsultantPlaceholder.js';
import SupportHome from '@/views/support/SupportHome.vue';
import Login from '@views/auth/Login.js';
import CustomerDashboard from '@views/customer/Dashboard.js';
import CustomerMyTickets from '@views/customer/MyTickets.js';
import CustomerSubmitTicket from '@views/customer/SubmitTicket.js';
import { createCustomerPlaceholder } from '@views/customer/CustomerPlaceholder.js';

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
    {
        path: '/customer/tickets',
        name: 'customer-tickets',
        component: CustomerMyTickets,
        meta: { requiresAuth: true },
    },
    {
        path: '/customer/submit',
        name: 'customer-submit',
        component: CustomerSubmitTicket,
        meta: { requiresAuth: true },
    },
    {
        path: '/customer/help',
        name: 'customer-help',
        component: createCustomerPlaceholder('Knowledge / Help'),
        meta: { requiresAuth: true },
    },
    {
        path: '/customer/settings',
        name: 'customer-settings',
        component: createCustomerPlaceholder('Settings'),
        meta: { requiresAuth: true },
    },
    {
        path: '/consultant',
        name: 'consultant',
        component: ConsultantHome,
        meta: { requiresAuth: true },
    },
    {
        path: '/consultant/assigned',
        name: 'consultant-assigned',
        component: createConsultantPlaceholder('Assigned to Me'),
        meta: { requiresAuth: true },
    },
    {
        path: '/consultant/settings',
        name: 'consultant-settings',
        component: createConsultantPlaceholder('Settings'),
        meta: { requiresAuth: true },
    },
    {
        path: '/support',
        name: 'support',
        component: SupportHome,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        return { name: 'login' };
    }

    if (to.name === 'login' && isAuthenticated()) {
        const user = await getCurrentUser();
        return getHomeRouteForRole(user?.role);
    }

    return true;
});

export default router;
