import TopNavigation from '@/components/topbar/TopNavigation.vue';
import { getCurrentUser, logout } from '@api/auth';

export default {
    name: 'CustomerDashboard',
    components: {
        TopNavigation,
    },
    data() {
        return {
            user: null,
            unreadNotifications: 1,
        };
    },
    computed: {
        displayName() {
            const name = this.user?.username || 'User';
            return name.charAt(0).toUpperCase() + name.slice(1);
        },
        userEmail() {
            return this.user?.email || '';
        },
        userInitials() {
            const name = this.user?.username || 'U';
            return name.slice(0, 2).toUpperCase();
        },
        userRole() {
            return this.user?.role || 'Customer';
        },
    },
    async mounted() {
        this.user = await getCurrentUser();
    },
    methods: {
        onLogout() {
            logout();
            this.$router.replace('/login');
        },
    },
    template: `
        <div class="flex min-h-screen flex-col bg-slate-50">
            <TopNavigation
                :role="userRole"
                :user-name="displayName"
                :user-email="userEmail"
                :user-initials="userInitials"
                :unread-notifications="unreadNotifications"
                @logout="onLogout"
            />

            <main class="flex-1 p-8">
                <div class="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 class="text-xl font-semibold text-slate-900">Customer Dashboard</h1>
                    <p class="mt-4 text-sm text-slate-500">Page content goes here.</p>
                </div>
            </main>
        </div>
    `,
};
