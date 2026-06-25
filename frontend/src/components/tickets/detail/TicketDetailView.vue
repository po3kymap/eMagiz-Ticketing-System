<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TicketTypeBadge from '@/components/tickets/ticket_components/TicketTypeBadge.vue';
import TicketPriorityBadge from '@/components/tickets/ticket_components/TicketPriorityBadge.vue';
import TicketStatusBadge from '@/components/tickets/ticket_components/TicketStatusBadge.vue';
import TicketConversation from '@/components/tickets/detail/TicketConversation.vue';
import TicketSlaPanel from '@/components/tickets/detail/TicketSlaPanel.vue';
import { getCurrentUser } from '@api/auth';
import { fetchTicketAuditLogs } from '@js/api/auditLogs';
import { getAuditTimelineColor, getAuditTimelineLabel, isLifecycleAction } from '@js/domain/audit/auditCatalog';
import {
    acceptTicket,
    assignTicket,
    changeTicketStatus,
    denyTicket,
    fetchTicketById,
    updateTicketPriority,
} from '@api/tickets';
import { fetchUsers } from '@api/users';
import { getTicketCompanyLabel, isInternalTicket } from '@js/domain/tickets/ticketCatalog';
import {
    Activity,
    ArrowLeft,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Flag,
    Loader2,
    Search,
    UserPlus,
    X,
    XCircle,
} from 'lucide-vue-next';

const props = defineProps({
    role: {
        type: String,
        required: true,
        validator: (v) => ['support', 'consultant', 'customer'].includes(v),
    },
    backPath: {
        type: String,
        required: true,
    },
});

const route = useRoute();
const router = useRouter();

const ticket = ref(null);
const currentUser = ref(null);
const allUsers = ref([]);
const consultantUsers = ref([]);
const auditLogs = ref([]);
const isLoading = ref(true);
const error = ref('');
const actionError = ref('');
const isProcessing = ref(false);
const isAssigning = ref(false);
const isSavingPriority = ref(false);

const showConfirmModal = ref(false);
const confirmActionType = ref('');
const showAssignModal = ref(false);
const showPriorityModal = ref(false);
const selectedAssignee = ref('');
const selectedPriority = ref('');
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const priorityOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const ticketStatus = computed(() => String(ticket.value?.status || '').toUpperCase());

const isInternal = computed(() => isInternalTicket(ticket.value));

const isAssignedToMe = computed(() =>
    ticket.value?.assigneeId != null
    && ticket.value?.assigneeId === currentUser.value?.userId,
);

const isSupport = computed(() => props.role === 'support');
const isConsultant = computed(() => props.role === 'consultant');

const canAddToReview = computed(() =>
    isSupport.value && ticketStatus.value === 'OPEN',
);
const canAccept = computed(() =>
    isSupport.value && ['OPEN', 'IN_REVIEW'].includes(ticketStatus.value),
);
const canDeny = computed(() =>
    isSupport.value && ['OPEN', 'IN_REVIEW', 'ACCEPTED'].includes(ticketStatus.value),
);
const canAssign = computed(() =>
    isSupport.value && ['OPEN', 'ACCEPTED'].includes(ticketStatus.value),
);
const canClose = computed(() =>
    isConsultant.value
    && isAssignedToMe.value
    && !['CLOSED', 'DENIED'].includes(ticketStatus.value),
);
const canChangePriority = computed(() =>
    !['CLOSED', 'DENIED'].includes(ticketStatus.value),
);

const creatorUser = computed(() =>
    allUsers.value.find((u) => u.id === ticket.value?.creatorId),
);
const assigneeUser = computed(() =>
    allUsers.value.find((u) => u.id === ticket.value?.assigneeId),
);

const customerLabel = computed(() => getTicketCompanyLabel(ticket.value));

const sourceLabel = computed(() => (isInternal.value ? 'Support' : 'Customer'));

const lifecycleEvents = computed(() => {
    if (!ticket.value) {
        return [];
    }

    const userById = new Map(allUsers.value.map((u) => [u.id, u]));

    const events = auditLogs.value
        .filter((log) => isLifecycleAction(log.action))
        .map((log) => {
            const user = log.userId ? userById.get(log.userId) : null;

            return {
                id: log.id,
                label: getAuditTimelineLabel(log.action, {
                    user,
                    details: log.details,
                    userById,
                    isInternal: isInternal.value,
                }),
                date: log.createdAt,
                color: getAuditTimelineColor(log.action),
                done: true,
            };
        });

    if (events.length === 0 && ticket.value.createdAt) {
        events.push({
            id: 'fallback-created',
            label: isInternal.value ? 'Created by support' : 'Submitted by customer',
            date: ticket.value.createdAt,
            color: 'bg-blue-500',
            done: true,
        });
    }

    if (!['CLOSED', 'DENIED'].includes(ticketStatus.value)) {
        events.push({
            id: 'pending-closed',
            label: 'Resolved / Closed',
            pending: true,
            color: 'bg-slate-200',
            done: false,
        });
    }

    return events;
});

function formatDate(val) {
    if (!val) {
        return '—';
    }
    return new Date(val).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatTimelineDate(val) {
    if (!val) {
        return '';
    }
    const d = new Date(val);
    const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `${date} · ${time}`;
}

function formatShortDate(val) {
    if (!val) {
        return '—';
    }
    return new Date(val).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatPriorityLabel(priority) {
    if (!priority) {
        return '';
    }
    return priority.charAt(0) + priority.slice(1).toLowerCase();
}

async function loadData() {
    isLoading.value = true;
    error.value = '';
    try {
        const id = route.params.id.replace('TKT-', '');
        const [fetchedTicket, users, user, logs] = await Promise.all([
            fetchTicketById(id),
            fetchUsers(),
            getCurrentUser(),
            fetchTicketAuditLogs(id).catch(() => []),
        ]);
        ticket.value = fetchedTicket;
        allUsers.value = users;
        consultantUsers.value = users.filter((u) => u.role === 'Consultant');
        currentUser.value = user;
        auditLogs.value = logs;
        selectedPriority.value = fetchedTicket.priority || 'MEDIUM';
    } catch (e) {
        error.value = e.message;
    } finally {
        isLoading.value = false;
    }
}

async function runStatusUpdate(updater) {
    isProcessing.value = true;
    actionError.value = '';
    try {
        await updater();
        await loadData();
    } catch (e) {
        actionError.value = e.message || 'Action failed';
    } finally {
        isProcessing.value = false;
    }
}

function openConfirm(type) {
    confirmActionType.value = type;
    showConfirmModal.value = true;
}

async function handleConfirm() {
    if (!ticket.value) {
        return;
    }
    await runStatusUpdate(async () => {
        if (confirmActionType.value === 'ACCEPT') {
            await acceptTicket(ticket.value.id);
        } else if (confirmActionType.value === 'DENY') {
            await denyTicket(ticket.value.id);
        }
        showConfirmModal.value = false;
    });
}

async function addToReview() {
    if (!ticket.value) {
        return;
    }
    await runStatusUpdate(() => changeTicketStatus(ticket.value.id, 'IN_REVIEW'));
}

async function closeTicket() {
    if (!ticket.value) {
        return;
    }
    await runStatusUpdate(() => changeTicketStatus(ticket.value.id, 'CLOSED'));
}

function openPriorityModal() {
    selectedPriority.value = ticket.value?.priority || 'MEDIUM';
    showPriorityModal.value = true;
}

function closePriorityModal() {
    showPriorityModal.value = false;
}

async function savePriority() {
    if (!ticket.value || !selectedPriority.value) {
        return;
    }
    isSavingPriority.value = true;
    actionError.value = '';
    try {
        await updateTicketPriority(ticket.value.id, selectedPriority.value);
        closePriorityModal();
        await loadData();
    } catch (e) {
        actionError.value = e.message || 'Failed to update priority';
    } finally {
        isSavingPriority.value = false;
    }
}

function openAssignModal() {
    selectedAssignee.value = ticket.value?.assigneeId || '';
    dropdownOpen.value = false;
    showAssignModal.value = true;
}

function closeAssignModal() {
    showAssignModal.value = false;
    selectedAssignee.value = '';
    dropdownOpen.value = false;
}

async function handleAssign() {
    if (!selectedAssignee.value || !ticket.value) {
        return;
    }
    isAssigning.value = true;
    actionError.value = '';
    try {
        await assignTicket(ticket.value.id, selectedAssignee.value);
        await changeTicketStatus(ticket.value.id, 'ASSIGNED');
        closeAssignModal();
        await loadData();
    } catch (e) {
        actionError.value = e.message || 'Failed to assign ticket';
    } finally {
        isAssigning.value = false;
    }
}

function handleClickOutside(e) {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        dropdownOpen.value = false;
    }
}

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
    loadData();
});

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
    <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div v-if="isLoading" class="py-24 text-center text-sm text-slate-400">
            Loading ticket…
        </div>

        <div v-else-if="error" class="py-24 text-center text-sm text-red-500">
            {{ error }}
        </div>

        <template v-else-if="ticket">
            <div class="mb-6 flex items-center gap-2 text-sm text-slate-400">
                <button
                    type="button"
                    class="flex items-center gap-1 font-medium transition hover:text-teal-600"
                    @click="router.push(backPath)"
                >
                    <ArrowLeft class="h-4 w-4" />
                    Tickets
                </button>
                <ChevronRight class="h-4 w-4" />
                <span class="font-mono text-slate-600">TKT-{{ ticket.id }}</span>
            </div>

            <div class="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="font-mono text-xs text-slate-400">TKT-{{ ticket.id }}</span>
                            <TicketTypeBadge :type="ticket.type" />
                            <TicketPriorityBadge :priority="ticket.priority" />
                            <TicketStatusBadge :status="ticket.status" />
                        </div>
                        <h1 class="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                            {{ ticket.title }}
                        </h1>
                        <p class="mt-2 text-sm text-slate-500">
                            Customer: <span class="text-slate-700">{{ customerLabel }}</span>
                            <span class="mx-2 text-slate-300">·</span>
                            Created: {{ formatShortDate(ticket.createdAt) }}
                            <span class="mx-2 text-slate-300">·</span>
                            Source: {{ sourceLabel }}
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <button
                            v-if="canChangePriority && !(isSupport && isInternal)"
                            type="button"
                            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            @click="openPriorityModal"
                        >
                            <Flag class="h-4 w-4" />
                            Priority
                        </button>

                        <template v-if="isSupport && !isInternal">
                            <button
                                v-if="canAddToReview"
                                type="button"
                                class="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
                                :disabled="isProcessing"
                                @click="addToReview"
                            >
                                <Search class="h-4 w-4" />
                                Add to Review
                            </button>

                            <button
                                v-if="canAccept"
                                type="button"
                                class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50"
                                :disabled="isProcessing"
                                @click="openConfirm('ACCEPT')"
                            >
                                <CheckCircle class="h-4 w-4" />
                                Accept
                            </button>

                            <button
                                v-if="canDeny"
                                type="button"
                                class="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                :disabled="isProcessing"
                                @click="openConfirm('DENY')"
                            >
                                <XCircle class="h-4 w-4" />
                                Deny
                            </button>

                            <button
                                v-if="canAssign"
                                type="button"
                                class="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-medium text-violet-600 transition hover:bg-violet-50 disabled:opacity-50"
                                :disabled="isProcessing"
                                @click="openAssignModal"
                            >
                                <UserPlus class="h-4 w-4" />
                                Assign
                            </button>
                        </template>

                        <button
                            v-if="isSupport && isInternal && canAssign"
                            type="button"
                            class="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-medium text-violet-600 transition hover:bg-violet-50 disabled:opacity-50"
                            :disabled="isProcessing"
                            @click="openAssignModal"
                        >
                            <UserPlus class="h-4 w-4" />
                            Assign
                        </button>

                        <button
                            v-if="canClose"
                            type="button"
                            class="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
                            :disabled="isProcessing"
                            @click="closeTicket"
                        >
                            <X class="h-4 w-4" />
                            Close
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="actionError" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {{ actionError }}
            </div>

            <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 class="text-sm font-semibold text-slate-700">Description</h2>
                    <p class="mt-3 text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                        {{ ticket.description || 'No description provided.' }}
                    </p>

                    <dl class="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 text-sm sm:grid-cols-2">
                        <div>
                            <dt class="text-xs uppercase tracking-wide text-slate-400">Customer</dt>
                            <dd class="mt-1 text-slate-700">{{ customerLabel }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs uppercase tracking-wide text-slate-400">Contact Email</dt>
                            <dd class="mt-1 text-slate-700">{{ creatorUser?.email || '—' }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs uppercase tracking-wide text-slate-400">Source</dt>
                            <dd class="mt-1 text-slate-700">{{ sourceLabel }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs uppercase tracking-wide text-slate-400">Created</dt>
                            <dd class="mt-1 text-slate-700">{{ formatDate(ticket.createdAt) }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs uppercase tracking-wide text-slate-400">Last Updated</dt>
                            <dd class="mt-1 text-slate-700">{{ formatDate(ticket.updatedAt) }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs uppercase tracking-wide text-slate-400">Type</dt>
                            <dd class="mt-1"><TicketTypeBadge :type="ticket.type" /></dd>
                        </div>
                    </dl>
                </section>

                <aside class="space-y-4">
                    <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 class="text-sm font-semibold text-slate-700">Assignment</h2>
                        <div class="mt-4 space-y-4 text-sm">
                            <div>
                                <p class="text-xs uppercase tracking-wide text-slate-400">Assigned To</p>
                                <p
                                    class="mt-1"
                                    :class="ticket.assigneeId ? 'text-slate-700' : 'font-medium text-red-500'"
                                >
                                    {{ assigneeUser?.username || 'Unassigned' }}
                                </p>
                            </div>
                            <div>
                                <p class="text-xs uppercase tracking-wide text-slate-400">Customer</p>
                                <p class="mt-1 text-slate-700">{{ customerLabel }}</p>
                            </div>
                        </div>
                    </section>

                    <TicketSlaPanel :ticket="ticket" :audit-logs="auditLogs" />

                    <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div class="flex items-center gap-2">
                            <Activity class="h-4 w-4 text-teal-600" />
                            <h2 class="text-sm font-semibold text-slate-700">Lifecycle Timeline</h2>
                        </div>

                        <div class="relative mt-5 space-y-0">
                            <div
                                v-for="(event, index) in lifecycleEvents"
                                :key="event.id ?? `${event.label}-${index}`"
                                class="relative flex gap-3 pb-5 last:pb-0"
                            >
                                <div
                                    v-if="index < lifecycleEvents.length - 1"
                                    class="absolute left-[5px] top-3 h-[calc(100%-4px)] w-px bg-slate-200"
                                />

                                <div
                                    class="relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                                    :class="event.color"
                                />

                                <div class="min-w-0 flex-1">
                                    <p
                                        class="text-sm font-medium"
                                        :class="event.pending ? 'text-slate-400' : 'text-slate-700'"
                                    >
                                        {{ event.label }}
                                    </p>
                                    <p v-if="event.pending" class="text-xs text-slate-400">Pending</p>
                                    <p v-else-if="event.date" class="text-xs text-slate-400">
                                        {{ formatTimelineDate(event.date) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>

            <TicketConversation
                class="mt-6"
                :ticket-id="ticket.id"
                :ticket-status="ticket.status"
                :current-user="currentUser"
                :role="role"
                :internal-only="isInternal"
            />
        </template>

        <!-- Priority modal -->
        <div v-if="showPriorityModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closePriorityModal" />
            <div class="relative w-full max-w-md rounded-xl bg-white shadow-2xl">
                <div class="px-6 py-6">
                    <h3 class="text-lg font-semibold text-slate-900">Change Priority</h3>
                    <p class="mt-1 text-sm text-slate-500">Select a new priority for TKT-{{ ticket?.id }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                        <button
                            v-for="priority in priorityOptions"
                            :key="priority"
                            type="button"
                            class="rounded-lg border px-3 py-1.5 text-sm font-medium transition"
                            :class="selectedPriority === priority
                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
                            @click="selectedPriority = priority"
                        >
                            {{ formatPriorityLabel(priority) }}
                        </button>
                    </div>
                </div>
                <div class="flex justify-end gap-3 bg-slate-50 px-6 py-4">
                    <button type="button" class="rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-200" @click="closePriorityModal">
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
                        :disabled="isSavingPriority"
                        @click="savePriority"
                    >
                        <Loader2 v-if="isSavingPriority" class="h-4 w-4 animate-spin" />
                        {{ isSavingPriority ? 'Saving…' : 'Save' }}
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
                        Select a consultant for TKT-{{ ticket?.id }}
                    </p>
                    <div class="relative mt-4" ref="dropdownRef">
                        <button
                            type="button"
                            class="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            @click="dropdownOpen = !dropdownOpen"
                        >
                            <span :class="selectedAssignee ? 'text-slate-900' : 'text-slate-400'">
                                {{ selectedAssignee
                                    ? consultantUsers.find((u) => u.id === selectedAssignee)?.username
                                    : 'Select a team member...' }}
                            </span>
                            <ChevronDown
                                class="h-4 w-4 text-slate-400 transition-transform"
                                :class="dropdownOpen ? 'rotate-180' : ''"
                            />
                        </button>
                        <div
                            v-if="dropdownOpen"
                            class="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg"
                        >
                            <button
                                v-for="user in consultantUsers"
                                :key="user.id"
                                type="button"
                                class="block w-full px-4 py-2.5 text-left text-sm transition hover:bg-slate-50"
                                :class="selectedAssignee === user.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'"
                                @click="selectedAssignee = user.id; dropdownOpen = false"
                            >
                                {{ user.username }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-3 bg-slate-50 px-6 py-4">
                    <button type="button" class="rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-200" @click="closeAssignModal">
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
                        :disabled="!selectedAssignee || isAssigning"
                        @click="handleAssign"
                    >
                        <Loader2 v-if="isAssigning" class="h-4 w-4 animate-spin" />
                        {{ isAssigning ? 'Assigning…' : 'Assign' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Confirm modal -->
        <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="showConfirmModal = false" />
            <div class="relative w-full max-w-md rounded-xl bg-white shadow-2xl">
                <div class="px-6 py-6">
                    <h3 class="text-lg font-semibold text-slate-900">
                        {{ confirmActionType === 'ACCEPT' ? 'Accept Ticket' : 'Deny Ticket' }}
                    </h3>
                    <p class="mt-2 text-sm text-slate-500">
                        Are you sure you want to {{ confirmActionType === 'ACCEPT' ? 'accept' : 'deny' }}
                        ticket TKT-{{ ticket?.id }}?
                    </p>
                </div>
                <div class="flex justify-end gap-3 bg-slate-50 px-6 py-4">
                    <button type="button" class="rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-200" @click="showConfirmModal = false">
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-75"
                        :class="confirmActionType === 'ACCEPT' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'"
                        :disabled="isProcessing"
                        @click="handleConfirm"
                    >
                        <Loader2 v-if="isProcessing" class="h-4 w-4 animate-spin" />
                        {{ isProcessing ? 'Processing…' : 'Confirm' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
