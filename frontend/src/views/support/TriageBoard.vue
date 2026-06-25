<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SupportLayout from '@/layouts/SupportLayout.vue';
import TriageBoardCard from '@/components/tickets/triage/TriageBoardCard.vue';
import { formatTicketDate } from '@js/composables/useTicketTable';
import { getTicketCompanyLabel } from '@js/domain/tickets/ticketCatalog';
import {
    acceptTicket,
    assignTicket,
    changeTicketStatus,
    denyTicket,
    fetchAllTickets,
} from '@api/tickets';
import { fetchUsers } from '@api/users';

const router = useRouter();

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
const reviewingTicketId = ref(null);

const COLUMN_TICKET_LIMIT = 4;

const TRIAGE_COLUMNS = [
    {
        status: 'OPEN',
        label: 'Open',
        dotClass: 'bg-blue-500',
        headerClass: 'bg-blue-50/90',
        showAccept: false,
        showDeny: false,
        showAssign: false,
        showAddToReview: true,
    },
    {
        status: 'IN_REVIEW',
        label: 'Under Review',
        dotClass: 'bg-amber-500',
        headerClass: 'bg-amber-50/90',
        showAccept: true,
        showDeny: true,
        showAssign: false,
    },
    {
        status: 'ACCEPTED',
        label: 'Accepted',
        dotClass: 'bg-emerald-500',
        headerClass: 'bg-emerald-50/90',
        showAccept: false,
        showDeny: false,
        showAssign: true,
    },
    {
        status: 'DENIED',
        label: 'Denied',
        dotClass: 'bg-red-500',
        headerClass: 'bg-red-50/90',
        showAccept: false,
        showDeny: false,
        showAssign: false,
    },
    {
        status: 'ASSIGNED',
        label: 'Assigned',
        dotClass: 'bg-violet-500',
        headerClass: 'bg-violet-50/90',
        showAccept: false,
        showDeny: false,
        showAssign: false,
    },
];

const ticketsByStatus = computed(() => {
    const grouped = Object.fromEntries(
        TRIAGE_COLUMNS.map((col) => [col.status, []]),
    );

    for (const ticket of tickets.value) {
        const status = String(ticket.status).toUpperCase();
        if (grouped[status]) {
            grouped[status].push(ticket);
        }
    }

    for (const status of Object.keys(grouped)) {
        grouped[status].sort((a, b) => Number(b.id) - Number(a.id));
    }

    return grouped;
});

function visibleTickets(status) {
    return (ticketsByStatus.value[status] ?? []).slice(0, COLUMN_TICKET_LIMIT);
}

function hasMoreTickets(status) {
    return (ticketsByStatus.value[status]?.length ?? 0) > COLUMN_TICKET_LIMIT;
}

function onSeeMore(status) {
    router.push({ path: '/support/queue', query: { status } });
}

onMounted(loadData);

async function loadData() {
    isLoading.value = true;
    error.value = '';
    try {
        tickets.value = await fetchAllTickets();
        const usersData = await fetchUsers();
        allUsers.value = usersData;
        consultantUsers.value = usersData.filter((u) => u.role === 'Consultant');
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
</script>

<template>
    <SupportLayout>
        <div class="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
            <div class="border-b border-slate-200 pb-5">
                <h1 class="text-[1.65rem] font-semibold tracking-tight text-slate-900">
                    Triage &amp; Assignment Board
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Review, approve, and assign incoming tickets
                </p>
            </div>

            <div v-if="isLoading" class="mt-8 py-16 text-center text-sm text-slate-400">
                Loading triage board…
            </div>

            <div v-else-if="error" class="mt-8 py-16 text-center text-sm text-red-500">
                {{ error }}
            </div>

            <div
                v-else
                class="mt-6 overflow-x-auto overscroll-x-contain pb-2"
            >
                <div class="flex min-w-full w-[calc(125%+1rem)] gap-5">
                <section
                    v-for="column in TRIAGE_COLUMNS"
                    :key="column.status"
                    class="min-w-0 flex-[0_0_calc(20%-0.8rem)]"
                >
                    <header
                        class="flex items-center gap-2 rounded-lg px-3 py-2"
                        :class="column.headerClass"
                    >
                        <span class="h-2 w-2 shrink-0 rounded-full" :class="column.dotClass" />
                        <h2 class="text-sm font-semibold text-slate-800">{{ column.label }}</h2>
                        <span
                            class="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/80 px-2 text-xs font-semibold text-slate-500 ring-1 ring-slate-200/80"
                        >
                            {{ ticketsByStatus[column.status]?.length ?? 0 }}
                        </span>
                    </header>

                    <p
                        v-if="!ticketsByStatus[column.status]?.length"
                        class="mt-3 text-center text-sm text-slate-400"
                    >
                        No tickets
                    </p>

                    <div v-else class="mt-3 flex max-h-[44rem] flex-col gap-2.5 overflow-hidden">
                        <TriageBoardCard
                            v-for="ticket in visibleTickets(column.status)"
                            :key="ticket.id"
                            :ticket="ticket"
                            :company-label="getTicketCompanyLabel(ticket)"
                            :date-label="formatTicketDate(ticket.createdAt)"
                            :show-accept="column.showAccept"
                            :show-deny="column.showDeny"
                            :show-assign="column.showAssign"
                            :show-add-to-review="column.showAddToReview"
                            @view="onView"
                            @accept="onAccept"
                            @deny="onDeny"
                            @assign="onAssign"
                            @add-to-review="onAddToReview"
                        />

                        <button
                            v-if="hasMoreTickets(column.status)"
                            type="button"
                            class="mt-1 w-full rounded-lg py-2 text-center text-xs font-medium text-teal-600 transition hover:bg-teal-50 hover:text-teal-700"
                            @click="onSeeMore(column.status)"
                        >
                            See more ({{ ticketsByStatus[column.status].length - COLUMN_TICKET_LIMIT }} more)
                        </button>
                    </div>
                </section>
                </div>
            </div>
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
                    <button
                        type="button"
                        class="rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
                        @click="closeConfirmModal"
                    >
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
                    <button
                        type="button"
                        class="rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
                        @click="closeAssignModal"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
                        :disabled="!selectedAssignee || isAssigning"
                        @click="handleAssignConfirm"
                    >
                        {{ isAssigning ? 'Assigning...' : 'Assign' }}
                    </button>
                </div>
            </div>
        </div>
    </SupportLayout>
</template>
