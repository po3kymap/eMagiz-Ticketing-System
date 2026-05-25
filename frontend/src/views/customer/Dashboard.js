import { getCurrentUser, logout } from '@api/auth.js';

export default {
    name: 'CustomerDashboard',
    data() {
        return {
            user: null,
        };
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
        <div class="min-h-screen bg-slate-50 p-8">
            <div class="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h1 class="text-xl font-semibold text-slate-900">Customer Dashboard</h1>
                <p class="text-slate-600 mt-2" v-if="user">
                    Signed in as <span class="font-medium">{{ user.username }}</span>
                    ({{ user.role }})
                </p>
                <p class="text-slate-500 mt-4 text-sm">
                    Full portal screens will be added here next.
                </p>
                <button
                    type="button"
                    class="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    @click="onLogout"
                >
                    Log out
                </button>
            </div>
        </div>
    `,
};
