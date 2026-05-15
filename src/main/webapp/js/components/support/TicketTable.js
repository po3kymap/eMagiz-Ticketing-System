import PriorityBadge from '../ui/PriorityBadge.js';
import StatusBadge from '../ui/StatusBadge.js';

const commandCenterTickets = [
    { id: 'TKT-2201', team: 'Integration', subject: 'Multiple tenants affected by queue lag', priority: 'Critical', status: 'In Progress' },
    { id: 'TKT-2198', team: 'Runtime', subject: 'Token refresh failures in EU region', priority: 'High', status: 'Assigned' },
    { id: 'TKT-2195', team: 'Platform', subject: 'Investigate spike in connector retries', priority: 'Medium', status: 'Assigned' }
];

export default {
    components: { PriorityBadge, StatusBadge },
    data() {
        return {
            commandCenterTickets
        };
    },
    template: `
        <section class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <header class="px-6 py-5 border-b border-slate-100">
                <h2 class="text-lg font-bold text-slate-900">Support Command Center</h2>
            </header>
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead class="bg-slate-50 text-slate-500">
                        <tr>
                            <th class="text-left font-semibold px-6 py-3">Ticket</th>
                            <th class="text-left font-semibold px-6 py-3">Team</th>
                            <th class="text-left font-semibold px-6 py-3">Subject</th>
                            <th class="text-left font-semibold px-6 py-3">Priority</th>
                            <th class="text-left font-semibold px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="ticket in commandCenterTickets" :key="ticket.id" class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-4 font-semibold text-slate-800">{{ ticket.id }}</td>
                            <td class="px-6 py-4 text-slate-600">{{ ticket.team }}</td>
                            <td class="px-6 py-4 text-slate-700">{{ ticket.subject }}</td>
                            <td class="px-6 py-4"><PriorityBadge :value="ticket.priority" /></td>
                            <td class="px-6 py-4"><StatusBadge :value="ticket.status" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `
};
