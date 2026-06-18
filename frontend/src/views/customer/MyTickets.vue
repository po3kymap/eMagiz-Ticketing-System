<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import TicketDataTable from '@/components/tickets/ticket_table/TicketDataTable.vue';
import TicketTablePagination from '@/components/tickets/ticket_table/TicketTablePagination.vue';
import TicketTableToolbar from '@/components/tickets/ticket_table/TicketTableToolbar.vue';
import { useTicketTable } from '@js/composables/useTicketTable';
import { fetchMyTicketsForCurrentUser } from '@api/tickets';
import { fetchUsers } from '@api/users';

const router = useRouter();
const tickets = ref([]);
const usersMap = ref({});
const isLoading = ref(true);
const error = ref('');

const columns = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
    { key: 'assigneeId', label: 'Assigned To' },
    { key: 'createdAt', label: 'Created' },
    { key: 'updatedAt', label: 'Updated' },
];

const {
    searchQuery,
    showFilters,
    filterStatus,
    filterPriority,
    filterType,
    statusOptions,
    priorityOptions,
    typeOptions,
    sorted,
    paginated,
    totalPages,
    currentPage,
    sortKey,
    sortDir,
    hasActiveFilters,
    toggleSort,
    resetFilters,
    onSearchInput,
    formatFilterLabel,
} = useTicketTable(tickets, {
    statusOptions: ['OPEN', 'IN_REVIEW', 'ACCEPTED', 'DENIED', 'ASSIGNED', 'RESOLVED', 'CLOSED'],
});

onMounted(async () => {
    try {
        const [fetchedTickets, users] = await Promise.all([
            fetchMyTicketsForCurrentUser(),
            fetchUsers(),
        ]);
        tickets.value = fetchedTickets;
        usersMap.value = Object.fromEntries(
            users.map((u) => [u.id, u.username]),
        );
    } catch (e) {
        error.value = e.message;
    } finally {
        isLoading.value = false;
    }
});

function resolveAssignee(userId) {
    if (!userId) {
        return '—';
    }
    return usersMap.value[userId] ?? userId;
}

function onSubmitTicket() {
    router.push('/customer/submit');
}

function onRowClick(ticket) {
    router.push(`/customer/tickets/ticket/TKT-${ticket.id}`);
}
</script>

<template>
    <CustomerLayout>
        <div class="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 class="text-xl font-semibold text-slate-900">My Tickets</h1>
                    <p class="mt-0.5 text-sm text-slate-500">{{ tickets.length }} tickets</p>
                </div>

                <button
                    type="button"
                    class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                    @click="onSubmitTicket"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

                    Submit New Ticket
                </button>
            </div>

            <TicketTableToolbar
                v-model:search-query="searchQuery"
                v-model:show-filters="showFilters"
                v-model:filter-status="filterStatus"
                v-model:filter-priority="filterPriority"
                v-model:filter-type="filterType"
                :status-options="statusOptions"
                :priority-options="priorityOptions"
                :type-options="typeOptions"
                :has-active-filters="hasActiveFilters"
                :format-filter-label="formatFilterLabel"
                search-placeholder="Search by title or ID..."
                @search-input="onSearchInput"
                @reset-filters="resetFilters"
            />

            <div v-if="isLoading" class="py-12 text-center text-sm text-slate-400">
                Loading tickets…
            </div>

            <div v-else-if="error" class="py-12 text-center text-sm text-red-500">
                {{ error }}
            </div>

            <template v-else>
                <TicketDataTable
                    :columns="columns"
                    :tickets="paginated"
                    :sort-key="sortKey"
                    :sort-dir="sortDir"
                    :resolve-user="resolveAssignee"
                    row-clickable
                    @sort="toggleSort"
                    @row-click="onRowClick"
                />

                <TicketTablePagination
                    :total="sorted.length"
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    @prev="currentPage--"
                    @next="currentPage++"
                />
            </template>
        </div>
    </CustomerLayout>
</template>
