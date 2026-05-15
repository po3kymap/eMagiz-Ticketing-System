const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

import Sidebar from './components/layout/Sidebar.js';
import TopNavigation from './components/layout/TopNavigation.js';
import CustomerDashboard from './views/customer/Dashboard.js';

const AppLayout = {
    components: {
        Sidebar,
        TopNavigation
    },
    template: `
        <div class="flex h-screen w-full bg-slate-50 overflow-hidden">
            <Sidebar />
            <div class="flex-1 flex flex-col h-full overflow-hidden relative">
                <TopNavigation />
                <main class="flex-1 overflow-y-auto">
                    <router-view></router-view>
                </main>
            </div>
        </div>
    `
};

const routes = [
    {
        path: '/',
        redirect: '/customer'
    },
    {
        path: '/customer',
        component: CustomerDashboard
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

const app = createApp(AppLayout);
app.use(router);
app.mount('#app');