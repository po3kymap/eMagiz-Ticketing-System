<script>
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import TicketList from '@/components/tickets/TicketList.vue';
import TicketStatusFilter from '@/components/tickets/TicketStatusFilter.vue';
import { fetchMyTicketsForCurrentUser } from '@api/tickets';

export default {
    name: 'CustomerMyTickets',
    components: {
        CustomerLayout,
        TicketList,
        TicketStatusFilter,
    },
    data() {
        return {
            tickets: [],
            loadingTickets: true,
            ticketsError: '',
            statusFilter: 'ALL',
        };
    },
    computed: {
        filteredTickets() {
            if (this.statusFilter === 'ALL') {
                return this.tickets;
            }
            return this.tickets.filter((ticket) => ticket.status === this.statusFilter);
        },
        ticketsSummary() {
            const total = this.tickets.length;
            const visible = this.filteredTickets.length;

            if (this.statusFilter === 'ALL') {
                return total === 1 ? '1 ticket' : `${total} tickets`;
            }

            return `${visible} of ${total} tickets`;
        },
        emptyMessage() {
            if (this.statusFilter === 'ALL') {
                return 'No tickets yet.';
            }
            return 'No tickets match this filter.';
        },
    },
    async mounted() {
        await this.loadTickets();
    },
    methods: {
        async loadTickets() {
            this.loadingTickets = true;
            this.ticketsError = '';

            try {
                this.tickets = await fetchMyTicketsForCurrentUser();
            } catch (err) {
                this.ticketsError = err.message || 'Failed to load tickets';
            } finally {
                this.loadingTickets = false;
            }
        },
        onSubmitTicket() {
            this.$router.push('/customer/submit');
        },
    },
};
</script>

<template>
    <CustomerLayout>
        <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">My Tickets</h1>
                    <p class="mt-1 text-sm text-slate-500">{{ ticketsSummary }}</p>
                </div>

                <button
                    type="button"
                    class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                    @click="onSubmitTicket"
                >
                    <span class="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-base leading-none">+</span>
                    Submit New Ticket
                </button>
            </div>

            <div class="mt-6">
                <TicketStatusFilter v-model="statusFilter" />
            </div>

            <section class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <TicketList
                    :tickets="filteredTickets"
                    :loading="loadingTickets"
                    :error="ticketsError"
                    :empty-message="emptyMessage"
                />
            </section>
        </div>
    </CustomerLayout>
</template>
