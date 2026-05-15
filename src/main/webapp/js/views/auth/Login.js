export default {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        handleLogin() {
            this.password = '';
        }
    },
    template: `
        <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div class="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h1 class="text-2xl font-bold text-slate-900 mb-2">Sign in</h1>
                <p class="text-sm text-slate-500 mb-6">Access the eMagiz ticketing workspace.</p>
                <form class="space-y-4" @submit.prevent="handleLogin">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input v-model="email" type="email" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input v-model="password" type="password" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                    </div>
                    <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold transition-colors">
                        Continue
                    </button>
                </form>
            </div>
        </div>
    `
};
