export default {
    template: `
        <div class="p-8 max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900 mb-1">Good morning, Sarah</h1>
                    <p class="text-slate-500">Acme Corp · Customer Portal</p>
                </div>
                <button class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                    <span>+</span> Submit New Ticket
                </button>
            </div>
            
            <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
                <p class="text-blue-800 text-sm">
                    <span class="font-semibold text-blue-600 mr-2">•</span>
                    You are viewing your organization's tickets only (Acme Corp).
                </p>
            </div>
            
            <div class="grid grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-xl border border-blue-200 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                        </svg>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-2xl font-bold text-slate-900">2</span>
                        <span class="text-sm font-medium text-slate-500">Open Tickets</span>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl border border-amber-200 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-2xl font-bold text-slate-900">1</span>
                        <span class="text-sm font-medium text-slate-500">Waiting for Support</span>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                        <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-2xl font-bold text-slate-900">2</span>
                        <span class="text-sm font-medium text-slate-500">Resolved This Month</span>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl border border-indigo-200 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-2xl font-bold text-slate-900">3</span>
                        <span class="text-sm font-medium text-slate-500">Recent Updates</span>
                    </div>
                </div>
            </div>
        </div>
    `
}