import PriorityBadge from '../ui/PriorityBadge.js';
import StatusBadge from '../ui/StatusBadge.js';

const assignedTickets = [
    { id: 'TKT-1132', customer: 'Acme Corp', title: 'Webhook delivery failures in production', priority: 'Critical', status: 'In Progress' },
    { id: 'TKT-1129', customer: 'Nordic Retail', title: 'Scheduled export does not trigger nightly', priority: 'High', status: 'Assigned' },
    { id: 'TKT-1126', customer: 'Helios Group', title: 'Question about connector timeout defaults', priority: 'Medium', status: 'Assigned' }
];

export default {
    components: { PriorityBadge, StatusBadge },
    data() {
        return {
            assignedTickets
        };
    },
    template: `
        <section class="bg-white border border-slate-200 rounded-xl shadow-sm">
            <header class="p-6 border-b border-slate-100">
                <h2 class="text-lg font-bold text-slate-900">Assigned Tickets</h2>
                <p class="text-sm text-slate-500 mt-1">Consultant workload for current shift.</p>
            </header>
            <div class="divide-y divide-slate-100">
                <article v-for="ticket in assignedTickets" :key="ticket.id" class="p-6 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xs font-semibold text-slate-400">{{ ticket.id }}</span>
                            <span class="text-xs text-slate-500">{{ ticket.customer }}</span>
                        </div>
                        <h3 class="text-sm font-semibold text-slate-800">{{ ticket.title }}</h3>
                    </div>
                    <div class="flex items-center gap-3">
                        <PriorityBadge :value="ticket.priority" />
                        <StatusBadge :value="ticket.status" />
                    </div>
                </article>
            </div>
        </section>
    `
};
