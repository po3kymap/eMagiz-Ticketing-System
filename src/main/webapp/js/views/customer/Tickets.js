import PriorityBadge from '../../components/ui/PriorityBadge.js';
import StatusBadge from '../../components/ui/StatusBadge.js';
import { getCustomerTickets } from '../../api/tickets.js';

const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unassigned', label: 'Unassigned' },
    { id: 'open', label: 'Open' },
    { id: 'closed', label: 'Closed' }
];

export default {
    components: { PriorityBadge, StatusBadge },
    data() {
        return {
            tickets: [],
            localSearchQuery: '',
            activeTab: 'all',
            sortField: 'createdAt',
            sortDirection: 'desc',
            tabs
        };
    },
    computed: {
        filteredByTab() {
            if (this.activeTab === 'unassigned') {
                return this.tickets.filter((ticket) => ticket.status.toLowerCase() === 'unassigned');
            }
            if (this.activeTab === 'open') {
                return this.tickets.filter((ticket) => {
                    const normalizedStatus = ticket.status.toLowerCase();
                    return normalizedStatus === 'assigned' || normalizedStatus === 'in progress';
                });
            }
            if (this.activeTab === 'closed') {
                return this.tickets.filter((ticket) => {
                    const normalizedStatus = ticket.status.toLowerCase();
                    return normalizedStatus === 'resolved' || normalizedStatus === 'closed';
                });
            }
            return this.tickets;
        },
        filteredTickets() {
            const normalizedQuery = this.localSearchQuery.trim().toLowerCase();
            if (!normalizedQuery) {
                return this.filteredByTab;
            }
            return this.filteredByTab.filter((ticket) =>
                ticket.id.toLowerCase().includes(normalizedQuery) ||
                ticket.title.toLowerCase().includes(normalizedQuery) ||
                ticket.type.toLowerCase().includes(normalizedQuery) ||
                ticket.priority.toLowerCase().includes(normalizedQuery) ||
                ticket.status.toLowerCase().includes(normalizedQuery)
            );
        },
        sortedTickets() {
            return [...this.filteredTickets].sort((a, b) => {
                const left = Date.parse(a[this.sortField]);
                const right = Date.parse(b[this.sortField]);
                const comparison = left - right;
                return this.sortDirection === 'asc' ? comparison : -comparison;
            });
        },
        subtitle() {
            const ticketWord = this.filteredByTab.length === 1 ? 'ticket' : 'tickets';
            return `${this.filteredByTab.length} ${ticketWord} · Track and manage your support requests`;
        }
    },
    methods: {
        setActiveTab(tabId) {
            this.activeTab = tabId;
        },
        setSort(field) {
            if (this.sortField === field) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                return;
            }
            this.sortField = field;
            this.sortDirection = 'desc';
        },
        sortIconClass(field) {
            if (this.sortField !== field) {
                return 'text-slate-300';
            }
            return 'text-emerald-500';
        },
        formatDate(value) {
            return new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: 'short'
            }).format(new Date(value));
        },
        typeBadgeClasses(type) {
            const normalized = type.toLowerCase();
            if (normalized === 'incident') {
                return 'bg-red-50 text-red-600 border-red-100';
            }
            if (normalized === 'rfc request') {
                return 'bg-blue-50 text-blue-600 border-blue-100';
            }
            return 'bg-slate-100 text-slate-600 border-slate-200';
        },
        exportTickets() {
            const header = ['Ticket ID', 'Title', 'Type', 'Priority', 'Status', 'Created', 'Updated'];
            const rows = this.sortedTickets.map((ticket) => [
                ticket.id,
                ticket.title,
                ticket.type,
                ticket.priority,
                ticket.status,
                this.formatDate(ticket.createdAt),
                this.formatDate(ticket.updatedAt)
            ]);
            const csv = [header, ...rows]
                .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
                .join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'customer-tickets.csv';
            link.click();
            URL.revokeObjectURL(url);
        }
    },
    async mounted() {
        this.tickets = await getCustomerTickets();
    },
    template: `
        <div class="p-8 max-w-7xl mx-auto">
            <div class="flex items-start justify-between gap-6 mb-6">
                <div>
                    <h1 class="text-4xl font-bold text-slate-900 mb-2">Tickets</h1>
                    <p class="text-slate-500">{{ subtitle }}</p>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        type="button"
                        class="h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold inline-flex items-center gap-2 hover:bg-slate-50 transition-colors"
                        @click="exportTickets"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 10.5 12 15m0 0 4.5-4.5M12 15V3" />
                        </svg>
                        Export
                    </button>
                    <router-link
                        to="/customer/submit"
                        class="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create Ticket
                    </router-link>
                </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div class="p-5 border-b border-slate-100 flex items-center gap-3">
                    <div class="flex-1 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 absolute left-4 top-3.5 text-slate-400">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input
                            v-model="localSearchQuery"
                            type="text"
                            placeholder="Search by title, ID, or customer..."
                            class="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 text-sm focus:outline-none focus:border-emerald-500"
                        >
                    </div>
                </div>

                <div class="px-5 border-b border-slate-100">
                    <div class="flex items-center gap-7">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            type="button"
                            :class="[
                                'h-12 text-sm font-semibold border-b-2 transition-colors',
                                activeTab === tab.id ? 'text-emerald-600 border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-700'
                            ]"
                            @click="setActiveTab(tab.id)"
                        >
                            {{ tab.label }}
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-[860px]">
                        <thead>
                            <tr class="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                                <th class="px-5 py-4 font-semibold">Ticket ID</th>
                                <th class="px-5 py-4 font-semibold">Title</th>
                                <th class="px-5 py-4 font-semibold">Type</th>
                                <th class="px-5 py-4 font-semibold">Priority</th>
                                <th class="px-5 py-4 font-semibold">Status</th>
                                <th class="px-5 py-4 font-semibold">
                                    <button type="button" class="inline-flex items-center gap-1 uppercase tracking-wide" @click="setSort('createdAt')">
                                        Created
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" :class="['w-3.5 h-3.5 transition-colors', sortIconClass('createdAt')]">
                                            <path v-if="sortField === 'createdAt' && sortDirection === 'asc'" fill-rule="evenodd" d="M9.47 5.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 1 1-1.06 1.06L10.75 7.56v7.22a.75.75 0 0 1-1.5 0V7.56L7.28 9.53a.75.75 0 0 1-1.06-1.06l3.25-3.25Z" clip-rule="evenodd" />
                                            <path v-else fill-rule="evenodd" d="M10.53 14.78a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l1.97 1.97V5.22a.75.75 0 0 1 1.5 0v7.22l1.97-1.97a.75.75 0 1 1 1.06 1.06l-3.25 3.25Z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </th>
                                <th class="px-5 py-4 font-semibold">
                                    <button type="button" class="inline-flex items-center gap-1 uppercase tracking-wide" @click="setSort('updatedAt')">
                                        Updated
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" :class="['w-3.5 h-3.5 transition-colors', sortIconClass('updatedAt')]">
                                            <path v-if="sortField === 'updatedAt' && sortDirection === 'asc'" fill-rule="evenodd" d="M9.47 5.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 1 1-1.06 1.06L10.75 7.56v7.22a.75.75 0 0 1-1.5 0V7.56L7.28 9.53a.75.75 0 0 1-1.06-1.06l3.25-3.25Z" clip-rule="evenodd" />
                                            <path v-else fill-rule="evenodd" d="M10.53 14.78a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l1.97 1.97V5.22a.75.75 0 0 1 1.5 0v7.22l1.97-1.97a.75.75 0 1 1 1.06 1.06l-3.25 3.25Z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="ticket in sortedTickets" :key="ticket.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td class="px-5 py-4 text-sm font-semibold text-slate-500 whitespace-nowrap">{{ ticket.id }}</td>
                                <td class="px-5 py-4 text-sm text-slate-800">
                                    <span class="block max-w-[280px] truncate">{{ ticket.title }}</span>
                                </td>
                                <td class="px-5 py-4">
                                    <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold border', typeBadgeClasses(ticket.type)]">{{ ticket.type }}</span>
                                </td>
                                <td class="px-5 py-4"><PriorityBadge :value="ticket.priority" /></td>
                                <td class="px-5 py-4"><StatusBadge :value="ticket.status" /></td>
                                <td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{{ formatDate(ticket.createdAt) }}</td>
                                <td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{{ formatDate(ticket.updatedAt) }}</td>
                            </tr>
                            <tr v-if="!sortedTickets.length">
                                <td colspan="7" class="px-5 py-8 text-center text-sm text-slate-500">
                                    No tickets found.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="px-5 py-4 flex items-center justify-between">
                    <span class="text-sm text-slate-400">Showing {{ sortedTickets.length }} tickets</span>
                    <div class="flex items-center gap-2 text-sm">
                        <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-300 bg-white" disabled>Previous</button>
                        <span class="px-2 text-slate-500">Page 1 of 1</span>
                        <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-300 bg-white" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    `
};
