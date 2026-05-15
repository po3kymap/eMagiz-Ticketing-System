export default {
    template: `
        <aside class="w-64 bg-[#0F172A] text-white flex flex-col h-full shrink-0">
            <div class="p-5 flex items-center justify-center">
                <img src="assets/img/logo.png" alt="Logo" class="w-40 h-auto brightness-0 invert">
            </div>
            
            <nav class="flex-1 mt-6">
                <div class="px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Customer Portal</div>
                <ul class="space-y-1">
                    <li>
                        <router-link to="/customer" class="flex items-center gap-3 px-5 py-2.5 text-emerald-400 bg-slate-800/50 border-l-4 border-emerald-400">
                            <span class="font-medium">Dashboard</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/customer/tickets" class="flex items-center gap-3 px-5 py-2.5 text-slate-300 hover:bg-slate-800 border-l-4 border-transparent transition-colors">
                            <span class="font-medium">My Tickets</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/customer/submit" class="flex items-center gap-3 px-5 py-2.5 text-slate-300 hover:bg-slate-800 border-l-4 border-transparent transition-colors">
                            <span class="font-medium">Submit Ticket</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/customer/knowledge" class="flex items-center gap-3 px-5 py-2.5 text-slate-300 hover:bg-slate-800 border-l-4 border-transparent transition-colors">
                            <span class="font-medium">Knowledge / Help</span>
                        </router-link>
                    </li>
                </ul>
            </nav>
        </aside>
    `
}