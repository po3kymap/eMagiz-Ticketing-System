<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ConsultantLayout from '@/layouts/ConsultantLayout.vue';
import TicketDataTable from '@/components/tickets/ticket_table/TicketDataTable.vue';
import TicketTablePagination from '@/components/tickets/ticket_table/TicketTablePagination.vue';
import TicketTableToolbar from '@/components/tickets/ticket_table/TicketTableToolbar.vue';
import { useTicketTable } from '@js/composables/useTicketTable';
import { fetchAssignedTicketsForCurrentUser } from '@api/tickets';
import { fetchUsers } from '@api/users';

const router = useRouter();
const tickets = ref([]);
const usersMap = ref({});
const isLoading = ref(true);
const error = ref('');

const columns = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'title', label: 'Title' },
    { key: 'creatorId', label: 'Customer' },
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
            fetchAssignedTicketsForCurrentUser(),
            fetchUsers(),
        ]);
        tickets.value = fetchedTickets;
        usersMap.value = Object.fromEntries(
            users.map((u) => [u.id, u.company || u.username]),
        );
    } catch (e) {
        error.value = e.message;
    } finally {
        isLoading.value = false;
    }
});

function resolveUser(userId) {
    if (!userId) {
        return '—';
    }
    return usersMap.value[userId] ?? userId;
}

function onRowClick(ticket) {
    router.push(`/consultant/assigned/ticket/TKT-${ticket.id}`);
}
</script>

<template>
    <ConsultantLayout>
        <div class="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
            <div>
                <h1 class="text-xl font-semibold text-slate-900">Assigned to Me</h1>
                <p class="mt-0.5 text-sm text-slate-500">{{ tickets.length }} tickets</p>
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
                    :resolve-user="resolveUser"
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
    </ConsultantLayout>
</template>
