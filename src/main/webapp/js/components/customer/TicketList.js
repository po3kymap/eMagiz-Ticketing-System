import PriorityBadge from '../ui/PriorityBadge.js';
import StatusBadge from '../ui/StatusBadge.js';

const defaultTickets = [
    { id: 'TKT-2047', type: 'Incident', title: 'Data pipeline synchronization failure', priority: 'Critical', status: 'Assigned' },
    { id: 'TKT-2046', type: 'RFC Request', title: 'Enable role access for new analyst group', priority: 'High', status: 'In Progress' },
    { id: 'TKT-2045', type: 'Incident', title: 'Clarification on webhook retry behavior', priority: 'Medium', status: 'Resolved' }
];

export default {
    components: { PriorityBadge, StatusBadge },
    props: {
        tickets: {
            type: Array,
            default() {
                return defaultTickets;
            }
        }
    },
    template: `
        <div class="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div class="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 class="text-lg font-bold text-slate-900">My Tickets</h2>
                <router-link to="/customer/tickets" class="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">View all 
                    <svg xmlns="http://www.w3.org/2001/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                </router-link>
            </div>
            <div class="flex flex-col">
                <div v-for="ticket in tickets" :key="ticket.id" class="p-6 border-b last:border-0 border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-medium text-slate-400">{{ ticket.id }}</span>
                            <span class="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{{ ticket.type }}</span>
                        </div>
                        <span class="font-semibold text-slate-800">{{ ticket.title }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <PriorityBadge :value="ticket.priority" />
                        <StatusBadge :value="ticket.status" />
                    </div>
                </div>
            </div>
        </div>
    `
};