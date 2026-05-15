const { createRouter, createWebHashHistory } = VueRouter;

import CustomerDashboard from './views/customer/Dashboard.js';
import CustomerTickets from './views/customer/Tickets.js';
import SubmitTicket from './views/customer/SubmitTicket.js';
import KnowledgeBase from './views/customer/KnowledgeBase.js';

const routes = [
    {
        path: '/',
        redirect: '/customer'
    },
    {
        path: '/customer',
        component: CustomerDashboard,
        meta: {
            section: 'Customer Portal',
            title: 'Dashboard'
        }
    },
    {
        path: '/customer/tickets',
        component: CustomerTickets,
        meta: {
            section: 'Customer Portal',
            title: 'My Tickets'
        }
    },
    {
        path: '/customer/submit',
        component: SubmitTicket,
        meta: {
            section: 'Customer Portal',
            title: 'Submit Ticket'
        }
    },
    {
        path: '/customer/knowledge',
        component: KnowledgeBase,
        meta: {
            section: 'Customer Portal',
            title: 'Knowledge Base'
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
