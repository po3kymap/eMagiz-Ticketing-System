<script setup>
import { ref, computed, onMounted } from 'vue';
import SupportLayout from '@/layouts/SupportLayout.vue';
import SupportDashboardHeader from '@/components/dashboard/SupportDashboardHeader.vue';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard.vue';
import { getCurrentUser } from '@api/auth';
import { fetchAllTickets } from '@api/tickets';
import SupportTicketsPanel from '@/components/tickets/panels/SupportTicketsPanel.vue';
import NeedsAssigmentPanel from '@/components/tickets/panels/NeedsAssigmentPanel.vue';
import TicketsByTypeChart from '@/components/dashboard/TicketsByTypeChart.vue';
import PriorityBreakdownChart from '@/components/dashboard/PriorityBreakdownChart.vue';
import RecentAuditPanel from '@/components/dashboard/RecentAuditPanel.vue';

const user = ref(null);
const tickets = ref([]);
const queueCount = ref(0);
const loadingTickets = ref(true);
const ticketsError = ref('');
const userName = computed(() => {
    return user.value?.username || 'User';
});

const stats = computed(() => {
    return {
        newTickets: tickets.value.filter(t => {
            if (!t.createdAt) return false;
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            return new Date(t.createdAt) >= oneDayAgo;
        }).length,
        acceptedTickets: tickets.value.filter((t) => t.status === 'ACCEPTED').length,
        openTickets: tickets.value.filter(t => t.status === 'OPEN').length,
        deniedTickets: tickets.value.filter(t => t.status === 'DENIED').length,
        slaRiskTickets: tickets.value.filter(t => {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            return new Date(t.createdAt) < threeDaysAgo && t.status === 'OPEN';
        }).length,
    };
});

const loadTickets = async () => {
    loadingTickets.value = true;
    ticketsError.value = '';
    try {
        tickets.value = await fetchAllTickets();
    } catch (err) {
        ticketsError.value = err.message || 'Failed to load tickets';
    } finally {
        loadingTickets.value = false;
    }
};

onMounted(async () => {
    user.value = await getCurrentUser();
    await loadTickets();
});
</script>

<template>
    <div class="flex min-h-screen flex-col bg-slate-50">
        <SupportLayout :queue-count="queueCount">
        <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <SupportDashboardHeader :user-name="userName" />

            <p
                v-if="ticketsError"
                class="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
                {{ ticketsError }}
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <DashboardStatCard
                    label="New Tickets"
                    :value="loadingTickets ? '—' : stats.newTickets"
                    tone="blue"
                >
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                        </svg>
                    </template>
                </DashboardStatCard>

                <DashboardStatCard
                    label="Accepted"
                    :value="loadingTickets ? '—' : stats.acceptedTickets"
                    tone="emerald"
                >
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                    </template>
                </DashboardStatCard>

                <DashboardStatCard
                    label="Open"
                    :value="loadingTickets ? '—' : stats.openTickets"
                    tone="green"
                >
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                    </template>
                </DashboardStatCard>

                <DashboardStatCard
                    label="Denied"
                    :value="loadingTickets ? '—' : stats.deniedTickets"
                    tone="red"
                >
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                    </template>
                </DashboardStatCard>

                <DashboardStatCard
                    label="SLA Risk"
                    :value="loadingTickets ? '—' : stats.slaRiskTickets"
                    tone="ruby"
                >
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>

                    </template>
                </DashboardStatCard>
            </div>
            <div class="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <SupportTicketsPanel
                    :tickets="tickets"
                    :loading="loadingTickets"
                    :error="ticketsError"
                    :limit="6"
                    :show-view-all="false"
                />

                <NeedsAssigmentPanel :tickets="tickets" :loading="loadingTickets" :error="ticketsError" />
            </div>

            <div class="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div class="grid gap-6 xl:grid-cols-2 max-h-[320px]">
                    <TicketsByTypeChart :tickets="tickets" :loading="loadingTickets" />
                    <PriorityBreakdownChart :tickets="tickets" :loading="loadingTickets" />
                </div>
                <RecentAuditPanel />
            </div>
        </div>
    </SupportLayout>
    </div>
</template>
