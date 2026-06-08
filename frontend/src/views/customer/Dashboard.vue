<script>
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard.vue';
import DashboardCtaBanner from '@/components/dashboard/DashboardCtaBanner.vue';
import RecentActivityPanel from '@/components/dashboard/RecentActivityPanel.vue';
import MyTicketsPanel from '@/components/tickets/MyTicketsPanel.vue';
import { getCurrentUser } from '@api/auth';
import { fetchMyTicketsForCurrentUser } from '@api/tickets';

export default {
    name: 'CustomerDashboard',
    components: {
        CustomerLayout,
        DashboardHeader,
        DashboardStatCard,
        DashboardCtaBanner,
        RecentActivityPanel,
        MyTicketsPanel,
    },
    data() {
        return {
            user: null,
            tickets: [],
            loadingTickets: true,
            ticketsError: '',
        };
    },
    computed: {
        userName() {
            return this.user?.username || 'User';
        },
        company() {
            return this.user?.company || '';
        },
        stats() {
          return {
            openTickets: this.tickets.filter(t => t.status === 'OPEN').length,
            waitingForSupport: this.tickets.filter(t => t.status === 'IN_REVIEW').length,
            resolvedThisMonth: this.tickets.filter(t => t.status === 'CLOSED').length,
            recentUpdates: this.tickets.filter(t => {
              if (!t.updatedAt) return false;
              const oneDayAgo = new Date();
              oneDayAgo.setDate(oneDayAgo.getDate() - 1);
              return new Date(t.updatedAt) >= oneDayAgo;
            }).length,
          };
        },
    },
    async mounted() {
        this.user = await getCurrentUser();
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
            <DashboardHeader
                :user-name="userName"
                :company="company"
                @submit-ticket="onSubmitTicket"
            />

            <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardStatCard
                    label="Open Tickets"
                    :value="stats.openTickets"
                    tone="blue"
                >
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                        </svg>
                    </template>
                </DashboardStatCard>

                <DashboardStatCard
                    label="Waiting for Support"
                    :value="stats.waitingForSupport"
                    tone="amber"
                >
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <circle cx="12" cy="12" r="9" />
                            <path stroke-linecap="round" d="M12 7v5l3 2" />
                        </svg>
                    </template>
                </DashboardStatCard>

                <DashboardStatCard
                    label="Resolved This Month"
                    :value="stats.resolvedThisMonth"
                    tone="emerald"
                >
                    <template #icon>
                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.5 12.5 2 2 5-5" />
                        </svg>
                    </template>
                </DashboardStatCard>

                <DashboardStatCard
                    label="Recent Updates"
                    :value="stats.recentUpdates"
                    tone="violet"
                >
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </template>
                </DashboardStatCard>
            </div>

            <div class="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <MyTicketsPanel
                    :tickets="tickets"
                    :loading="loadingTickets"
                    :error="ticketsError"
                    :limit="3"
                />

                <RecentActivityPanel />
            </div>

            <div class="mt-8">
                <DashboardCtaBanner @submit-ticket="onSubmitTicket" />
            </div>
        </div>
    </CustomerLayout>
</template>
