const { createApp } = Vue;

import { getCurrentUser } from './api/auth.js';
import Sidebar from './components/layout/Sidebar.js';
import TopNavigation from './components/layout/TopNavigation.js';
import router from './router.js';

const AppLayout = {
    components: {
        Sidebar,
        TopNavigation
    },
    data() {
        return {
            currentUser: {
                name: 'Sarah Mitchell',
                email: 's.mitchell@acmecorp.com',
                role: 'Customer'
            }
        };
    },
    computed: {
        pageContext() {
            const meta = this.$route.meta || {};
            return {
                section: meta.section || 'Customer Portal',
                title: meta.title || 'Dashboard'
            };
        }
    },
    async mounted() {
        const user = await getCurrentUser();
        this.currentUser = {
            name: user.name,
            email: user.email,
            role: user.role
        };
    },
    template: `
        <div class="flex h-screen w-full bg-slate-50 overflow-hidden">
            <Sidebar />
            <div class="flex-1 flex flex-col h-full overflow-hidden relative">
                <TopNavigation
                    :role="currentUser.role"
                    :user-name="currentUser.name"
                    :user-email="currentUser.email"
                    :page-section="pageContext.section"
                    :page-title="pageContext.title"
                />
                <main class="flex-1 overflow-y-auto">
                    <router-view v-slot="{ Component }">
                        <component :is="Component" />
                    </router-view>
                </main>
            </div>
        </div>
    `
};

const app = createApp(AppLayout);
app.use(router);
app.mount('#app');