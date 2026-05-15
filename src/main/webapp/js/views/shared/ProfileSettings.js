export default {
    data() {
        return {
            name: 'Sarah Mitchell',
            email: 's.mitchell@acmecorp.com',
            timezone: 'Europe/Amsterdam'
        };
    },
    template: `
        <div class="p-8 max-w-3xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-900 mb-1">Profile Settings</h1>
                <p class="text-slate-500">Manage your account preferences.</p>
            </div>
            <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 grid grid-cols-1 gap-5">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Full name</label>
                    <input v-model="name" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input v-model="email" type="email" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                    <input v-model="timezone" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                </div>
            </div>
        </div>
    `
};
