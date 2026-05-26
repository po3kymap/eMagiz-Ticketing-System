import { createRouter, createWebHashHistory } from 'vue-router'
import { isAuthenticated } from '@api/auth'
import Login from '@/views/login/LoginPage.vue'
import MenuLayout from '@/layout/MenuLayout.vue'
import CustomerDashboard from '@/views/dashboard/DashboardView.vue'
import TicketQueueView from '@/views/tickets/TicketQueueView.vue'
import TriageBoardView from "@views/triage/TriageBoardView.vue";
import AuditLogView from "@views/audit/AuditLogView.vue";
import UsersView from "@views/users/UsersView.vue";
import SubmitView from "@views/submit/SubmitView.vue";
import SettingsView from '@/views/settings/SettingsView.vue'

const routes = [
    {
        path: '/',
        component: MenuLayout,
        meta: { requiresAuth: false },
        children: [
            {
                path: '',
                redirect: '/dashboard',
            },
            {
                path: 'dashboard',
                name: 'dashboard',
                component: CustomerDashboard,
            },
            {
                path: 'ticket-queue',
                name: 'ticket-queue',
                component: TicketQueueView,
            },
            {
                path: 'triage-board',
                name: 'triage-board',
                component: TicketQueueView,
            },
            {
                path: 'users',
                name: 'users',
                component: TicketQueueView,
            },
            {
                path: 'audit-log',
                name: 'audit-log',
                component: TicketQueueView,
            },
            {
                path: 'settings',
                name: 'settings',
                component: TicketQueueView,
            },
        ],
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { public: true },
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        return { name: 'login' }
    }

    if (to.name === 'login' && isAuthenticated()) {
        return { name: 'dashboard' }
    }

    return true
})

export default router
