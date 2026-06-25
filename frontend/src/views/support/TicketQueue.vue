<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SupportLayout from '@/layouts/SupportLayout.vue';
import TicketDataTable from '@/components/tickets/ticket_table/TicketDataTable.vue';
import TicketTablePagination from '@/components/tickets/ticket_table/TicketTablePagination.vue';
import TicketTableToolbar from '@/components/tickets/ticket_table/TicketTableToolbar.vue';
import { useTicketTable } from '@js/composables/useTicketTable';
import {
    acceptTicket,
    assignTicket,
    changeTicketStatus,
    denyTicket,
    fetchAllTickets,
} from '@api/tickets';
import { fetchUsers } from '@api/users';
import { isConsultantRole, isCustomerRole } from '@js/domain/auth/roles';
import { isInternalTicket } from '@js/domain/tickets/ticketCatalog';
import CreateTicketModal from '@/components/tickets/CreateTicketModal.vue';

const router = useRouter();
const route = useRoute();
const tickets = ref([]);
const allUsers = ref([]);
const consultantUsers = ref([]);
const isLoading = ref(true);
const error = ref('');

const showConfirmModal = ref(false);
const confirmTicket = ref(null);
const confirmActionType = ref('');
const isProcessing = ref(false);

const showAssignModal = ref(false);
const assignTicketObj = ref(null);
const selectedAssignee = ref('');
const isAssigning = ref(false);

const showCreateModal = ref(false);
const customerUsers = ref([]);

const columns = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'title', label: 'Title' },
    { key: 'company', label: 'Customer' },
    { key: 'type', label: 'Type' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
    { key: 'assigneeId', label: 'Assigned To' },
    { key: 'createdAt', label: 'Created' },
    { key: 'updatedAt', label: 'Updated' },
];

function getUserNameDisplay(id) {
    if (!id) {
        return '—';
    }
    const user = allUsers.value.find((u) => u.id === id);
    return user?.username ? `${user.username} (${id})` : id;
}

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
    statusOptions: ['OPEN', 'IN_REVIEW', 'ACCEPTED', 'DENIED', 'ASSIGNED', 'CLOSED'],
    matchSearch: (ticket, q) => {
        const company = String(ticket.company || '').toLowerCase();
        return ticket.title?.toLowerCase().includes(q)
            || ticket.id?.toString().includes(q)
            || company.includes(q);
    },
});

function applyRouteStatusFilter() {
    const status = String(route.query.status || '').toUpperCase();
    if (!status || !statusOptions.includes(status)) {
        return;
    }
    filterStatus.value = status;
    showFilters.value = true;
    currentPage.value = 1;
}

onMounted(async () => {
    await loadData();
    applyRouteStatusFilter();
});

watch(() => route.query.status, applyRouteStatusFilter);

async function loadData() {
    isLoading.value = true;
    error.value = '';
    try {
        tickets.value = await fetchAllTickets();
        const usersData = await fetchUsers();
        allUsers.value = usersData;
        customerUsers.value = usersData.filter((u) => isCustomerRole(u.role));
        consultantUsers.value = usersData.filter((u) => isConsultantRole(u.role));
    } catch (e) {
        error.value = e.message;
    } finally {
        isLoading.value = false;
    }
}

function onView(ticket) {
    router.push(`/support/queue/ticket/TKT-${ticket.id}`);
}

function onAccept(ticket) {
    confirmTicket.value = ticket;
    confirmActionType.value = 'ACCEPT';
    showConfirmModal.value = true;
}

function onDeny(ticket) {
    confirmTicket.value = ticket;
    confirmActionType.value = 'DENY';
    showConfirmModal.value = true;
}

function closeConfirmModal() {
    showConfirmModal.value = false;
    confirmTicket.value = null;
    confirmActionType.value = '';
}

async function handleConfirm() {
    if (isProcessing.value || !confirmTicket.value) {
        return;
    }

    isProcessing.value = true;
    try {
        if (confirmActionType.value === 'ACCEPT') {
            await acceptTicket(confirmTicket.value.id);
        } else if (confirmActionType.value === 'DENY') {
            await denyTicket(confirmTicket.value.id);
        }
        await loadData();
        closeConfirmModal();
    } catch {
        alert('Failed to update the ticket. Please try again.');
    } finally {
        isProcessing.value = false;
    }
}

function onAssign(ticket) {
    assignTicketObj.value = ticket;
    selectedAssignee.value = ticket.assigneeId || '';
    showAssignModal.value = true;
}

function closeAssignModal() {
    showAssignModal.value = false;
    assignTicketObj.value = null;
    selectedAssignee.value = '';
}

async function handleAssignConfirm() {
    if (!selectedAssignee.value || isAssigning.value || !assignTicketObj.value) {
        return;
    }

    isAssigning.value = true;
    try {
        await assignTicket(assignTicketObj.value.id, selectedAssignee.value);
        await changeTicketStatus(assignTicketObj.value.id, 'ASSIGNED');
        await loadData();
        closeAssignModal();
    } catch {
        alert('Failed to assign the ticket.');
    } finally {
        isAssigning.value = false;
    }
}

const reviewingTicketId = ref(null);

async function onAddToReview(ticket) {
    if (reviewingTicketId.value) {
        return;
    }

    reviewingTicketId.value = ticket.id;
    try {
        await changeTicketStatus(ticket.id, 'IN_REVIEW');
        await loadData();
    } catch {
        alert('Failed to move the ticket to review.');
    } finally {
        reviewingTicketId.value = null;
    }
}

function onTicketCreated() {
    showCreateModal.value = false;
    loadData();
}

function canAssignInternalTicket(ticket) {
    if (!isInternalTicket(ticket) || ticket.assigneeId) {
        return false;
    }

    return ['OPEN', 'ACCEPTED'].includes(String(ticket.status).toUpperCase());
}
</script>

<template>
    <SupportLayout>
        <div class="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 class="text-xl font-semibold text-slate-900">Ticket Queue</h1>
                    <p class="mt-0.5 text-sm text-slate-500">{{ tickets.length }} tickets · Open tickets</p>
                </div>
                <button
                    type="button"
                    class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                    @click="showCreateModal = true"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Create Ticket
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
                search-placeholder="Search by title, ID, or customer..."
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
                    :resolve-user="getUserNameDisplay"
                    show-actions
                    @sort="toggleSort"
                >
                    <template #actions="{ ticket }">
                        <div class="flex items-center justify-end gap-1 text-slate-400">
                            <button
                                type="button"
                                class="rounded p-1.5 transition hover:bg-slate-200 hover:text-slate-700"
                                title="View"
                                @click="onView(ticket)"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </button>

                            <button
                                v-if="!isInternalTicket(ticket) && String(ticket.status).toUpperCase() === 'OPEN'"
                                type="button"
                                class="rounded p-1.5 transition hover:bg-amber-100 hover:text-amber-600 disabled:opacity-50"
                                title="Add to Review"
                                :disabled="reviewingTicketId === ticket.id"
                                @click="onAddToReview(ticket)"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>

                            <button
                                v-if="(!isInternalTicket(ticket) && String(ticket.status).toUpperCase() === 'ACCEPTED') || canAssignInternalTicket(ticket)"
                                type="button"
                                class="rounded p-1.5 transition hover:bg-blue-100 hover:text-blue-600"
                                title="Assign"
                                @click="onAssign(ticket)"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                </svg>
                            </button>

                            <button
                                v-if="!isInternalTicket(ticket) && ['OPEN', 'IN_REVIEW'].includes(String(ticket.status).toUpperCase())"
                                type="button"
                                class="rounded p-1.5 transition hover:bg-emerald-100 hover:text-emerald-600"
                                title="Accept"
                                @click="onAccept(ticket)"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>

                            <button
                                v-if="!isInternalTicket(ticket) && ['OPEN', 'IN_REVIEW', 'ACCEPTED'].includes(String(ticket.status).toUpperCase())"
                                type="button"
                                class="rounded p-1.5 transition hover:bg-red-100 hover:text-red-600"
                                title="Deny"
                                @click="onDeny(ticket)"
                            >
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                        </div>
                    </template>
                </TicketDataTable>

                <TicketTablePagination
                    :total="sorted.length"
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    @prev="currentPage--"
                    @next="currentPage++"
                />
            </template>
        </div>

        <!-- Accept / Deny modal -->
        <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeConfirmModal" />
            <div class="relative w-full max-w-md rounded-xl bg-white shadow-2xl">
                <div class="px-6 py-6">
                    <h3 class="text-lg font-semibold text-slate-900">
                        {{ confirmActionType === 'ACCEPT' ? 'Accept Ticket' : 'Deny Ticket' }}
                    </h3>
                    <p class="mt-2 text-sm text-slate-500">
                        Are you sure you want to {{ confirmActionType === 'ACCEPT' ? 'accept' : 'deny' }}
                        ticket TKT-{{ confirmTicket?.id }}?
                    </p>
                </div>
                <div class="flex justify-end gap-3 bg-slate-50 px-6 py-4">
                    <button type="button" class="rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-200" @click="closeConfirmModal">
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="rounded-lg px-4 py-2 text-sm font-medium text-white"
                        :class="confirmActionType === 'ACCEPT' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'"
                        :disabled="isProcessing"
                        @click="handleConfirm"
                    >
                        {{ isProcessing ? 'Processing...' : 'Confirm' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Assign modal -->
        <div v-if="showAssignModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeAssignModal" />
            <div class="relative w-full max-w-md rounded-xl bg-white shadow-2xl">
                <div class="px-6 py-6">
                    <h3 class="text-lg font-semibold text-slate-900">Assign Ticket</h3>
                    <p class="mt-1 text-sm text-slate-500">
                        Select a consultant for TKT-{{ assignTicketObj?.id }}
                    </p>
                    <select
                        v-model="selectedAssignee"
                        class="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="" disabled>Select a team member...</option>
                        <option v-for="user in consultantUsers" :key="user.id" :value="user.id">
                            {{ user.username }}
                        </option>
                    </select>
                </div>
                <div class="flex justify-end gap-3 bg-slate-50 px-6 py-4">
                    <button type="button" class="rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-200" @click="closeAssignModal">
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        :disabled="!selectedAssignee || isAssigning"
                        @click="handleAssignConfirm"
                    >
                        {{ isAssigning ? 'Assigning...' : 'Assign' }}
                    </button>
                </div>
            </div>
        </div>

        <CreateTicketModal
            v-if="showCreateModal"
            :customers="customerUsers"
            @close="showCreateModal = false"
            @created="onTicketCreated"
        />
    </SupportLayout>
</template>
