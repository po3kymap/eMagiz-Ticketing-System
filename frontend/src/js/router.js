import { createRouter, createWebHashHistory } from 'vue-router';
import { getCurrentUser, getHomeRouteForRole, isAuthenticated, logout } from '@api/auth';
import { roleCanAccessPath } from '@js/domain/auth/roles';
import Login from '@/views/auth/Login.vue';
import CustomerDashboard from '@/views/customer/Dashboard.vue';
import CustomerMyTickets from '@/views/customer/MyTickets.vue';
import CustomerTicketView from '@/views/customer/CustomerTicketView.vue';
import CustomerSubmitTicket from '@/views/customer/SubmitTicket.vue';
import CustomerHelp from '@/views/customer/Help.vue';
import ConsultantDashboard from '@/views/consultant/Dashboard.vue';
import ConsultantAssigned from '@/views/consultant/Assigned.vue';
import ConsultantSettings from '@views/consultant/ConsultantSettings.vue';
import CustomerSettings from '@views/customer/CustomerSettings.vue';
import SupportSettings from '@views/support/SupportSettings.vue';
import ConsultantTicketView from "@views/consultant/ConsultantTicketView.vue";
import SupportDashboard from '@/views/support/Dashboard.vue';
import SupportTicketQueue from '@/views/support/TicketQueue.vue';
import SupportTriageBoard from '@/views/support/TriageBoard.vue';
import SupportUsers from '@/views/support/UsersPage.vue';
import SupportAuditLog from '@/views/support/AuditLog.vue';
import SupportTicketView from "@views/support/SupportTicketView.vue";
import Unauthorized from '@/views/auth/Unauthorized.vue';
import ResetPassword from "@views/auth/ResetPassword.vue";
import ForgotPassword from "@views/auth/ForgotPassword.vue";

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
        path: '/customer/tickets/ticket/TKT-:id',
        name: 'customer-ticket',
        component: CustomerTicketView,
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
        component: CustomerHelp,
        meta: { requiresAuth: true },
    },
    {
        path: '/customer/settings',
        name: 'customer-settings',
        component: CustomerSettings,
        meta: { requiresAuth: true },
    },
    {
        path: '/consultant',
        name: 'consultant',
        component: ConsultantDashboard,
        meta: { requiresAuth: true },
    },
    {
        path: '/consultant/assigned',
        name: 'consultant-assigned',
        component: ConsultantAssigned,
        meta: { requiresAuth: true },
    },
    {
        path: '/consultant/assigned/ticket/TKT-:id',
        name: 'consultant-assigned-ticket',
        component: ConsultantTicketView,
        meta: { requiresAuth: true },
    },
    {
        path: '/consultant/settings',
        name: 'consultant-settings',
        component: ConsultantSettings,
        meta: { requiresAuth: true },
    },
    {
        path: '/support',
        name: 'support',
        component: SupportDashboard,
        meta: { requiresAuth: true },
    },
    {
        path: '/support/queue',
        name: 'support-queue',
        component: SupportTicketQueue,
        meta: { requiresAuth: true },
    },
    {
        path: '/support/triage',
        name: 'support-triage',
        component: SupportTriageBoard,
        meta: { requiresAuth: true },
    },
    {
        path: '/support/audit',
        name: 'support-audit',
        component: SupportAuditLog,
        meta: { requiresAuth: true },
    },
    {
        path: '/support/users',
        name: 'support-users',
        component: SupportUsers,
        meta: { requiresAuth: true },
    },
    {
        path: '/support/queue/ticket/TKT-:id',
        name: 'support-queue-ticket',
        component: SupportTicketView,
        meta: { requiresAuth: true },
    },
    {
        path: '/support/settings',
        name: 'support-settings',
        component: SupportSettings,
        meta: { requiresAuth: true },
    },
    {
        path: '/unauthorized',
        name: 'unauthorized',
        component: Unauthorized,
        meta: { requiresAuth: true, skipRoleCheck: true },
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: ResetPassword,
        meta: { public: true },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
        meta: { public: true },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to) => {
    if (to.meta.public) {
        if (to.name === 'login' && isAuthenticated()) {
            const user = await getCurrentUser();
            return getHomeRouteForRole(user?.role);
        }
        return true;
    }

    if (to.meta.requiresAuth && !isAuthenticated()) {
        return {
            name: 'login',
            query: to.fullPath !== '/login' ? { redirect: to.fullPath } : undefined,
        };
    }

    const user = await getCurrentUser();

    if (!user?.role) {
        logout();
        return { name: 'login' };
    }

    if (!to.meta.skipRoleCheck && !roleCanAccessPath(user.role, to.path)) {
        return { name: 'unauthorized' };
    }

    if (to.name === 'login' && isAuthenticated()) {
        return getHomeRouteForRole(user.role);
    }

    return true;
});

export default router;