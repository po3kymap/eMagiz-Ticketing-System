<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SupportLayout from '@/layouts/SupportLayout.vue';
import TicketTypeBadge from '@/components/tickets/TicketTypeBadge.vue';
import TicketPriorityBadge from '@/components/tickets/TicketPriorityBadge.vue';
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge.vue';
import { fetchTicketById, acceptTicket, denyTicket, assignTicket, changeTicketStatus } from '@api/tickets';
import { fetchUsers } from '@api/users';
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  UserPlus,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const ticket = ref(null);
const isLoading = ref(true);
const error = ref('');
const actionError = ref('');

const showAssignModal = ref(false);
const consultantUsers = ref([]);
const selectedAssignee = ref('');
const isAssigning = ref(false);
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const showConfirmModal = ref(false);
const confirmActionType = ref('');
const isProcessing = ref(false);

// Assign доступен для OPEN и IN_REVIEW
const canAssign = computed(() =>
    ['OPEN', 'IN_REVIEW'].includes(String(ticket.value?.status).toUpperCase())
);

// Accept только для OPEN
const canAccept = computed(() =>
    String(ticket.value?.status).toUpperCase() === 'OPEN'
);

// Deny для OPEN и IN_REVIEW
const canDeny = computed(() =>
    ['OPEN', 'IN_REVIEW'].includes(String(ticket.value?.status).toUpperCase())
);

async function loadTicket() {
  isLoading.value = true;
  error.value = '';
  try {
    ticket.value = await fetchTicketById(route.params.id.replace('TKT-', ''));
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

async function loadConsultants() {
  try {
    const users = await fetchUsers();
    consultantUsers.value = users.filter(u => u.role === 'Consultant');
  } catch (e) {
    console.error('Failed to load consultants', e);
  }
}

function openAssignModal() {
  if (!canAssign.value) return;
  selectedAssignee.value = '';
  dropdownOpen.value = false;
  showAssignModal.value = true;
}

function closeAssignModal() {
  showAssignModal.value = false;
  selectedAssignee.value = '';
  dropdownOpen.value = false;
}

function openConfirm(type) {
  if (type === 'ACCEPT' && !canAccept.value) return;
  if (type === 'DENY' && !canDeny.value) return;
  confirmActionType.value = type;
  showConfirmModal.value = true;
}

async function handleConfirm() {
  if (isProcessing.value) return;
  isProcessing.value = true;
  actionError.value = '';
  try {
    if (confirmActionType.value === 'ACCEPT') {
      await acceptTicket(ticket.value.id);
      ticket.value.status = 'IN_REVIEW';
    } else if (confirmActionType.value === 'DENY') {
      await denyTicket(ticket.value.id);
      ticket.value.status = 'DENIED';
    }
    showConfirmModal.value = false;
  } catch (e) {
    actionError.value = e.message;
  } finally {
    isProcessing.value = false;
  }
}

async function handleAssign() {
  if (!selectedAssignee.value || isAssigning.value) return;
  isAssigning.value = true;
  actionError.value = '';
  try {
    await assignTicket(ticket.value.id, selectedAssignee.value);
    await changeTicketStatus(ticket.value.id, 'ASSIGNED');
    ticket.value.assigneeId = selectedAssignee.value;
    ticket.value.status = 'ASSIGNED';
    closeAssignModal();
  } catch (e) {
    actionError.value = e.message;
  } finally {
    isAssigning.value = false;
  }
}

function getConsultantName(id) {
  if (!id) return null;
  const user = consultantUsers.value.find(u => u.id === id);
  return user?.username ?? String(id);
}

function formatDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(async () => {
  document.addEventListener('mousedown', handleClickOutside);
  await Promise.all([loadTicket(), loadConsultants()]);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
  <SupportLayout>
    <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      <div v-if="isLoading" class="py-24 text-center text-sm text-slate-400">
        Loading ticket…
      </div>

      <div v-else-if="error" class="py-24 text-center text-sm text-red-500">
        {{ error }}
      </div>

      <template v-else-if="ticket">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <button
              class="flex items-center gap-1 hover:text-teal-600 transition font-medium"
              @click="router.push('/support/queue')"
          >
            <ArrowLeft class="h-4 w-4" />
            Tickets
          </button>
          <ChevronRight class="h-4 w-4" />
          <span class="font-mono text-slate-600">TKT-{{ ticket.id }}</span>
        </div>

        <!-- Header row -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-mono text-xs text-slate-400">TKT-{{ ticket.id }}</span>
            <TicketTypeBadge :type="ticket.type" />
            <TicketPriorityBadge :priority="ticket.priority" />
            <TicketStatusBadge :status="ticket.status" />
          </div>

          <div class="flex flex-wrap gap-2">
            <!-- Assign -->
            <button
                class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition"
                :class="canAssign
                ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer'
                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'"
                :disabled="!canAssign"
                @click="openAssignModal"
            >
              <UserPlus class="h-4 w-4" />
              Assign
            </button>

            <!-- Accept -->
            <button
                class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition"
                :class="canAccept
                ? 'border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-50 cursor-pointer'
                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'"
                :disabled="!canAccept"
                @click="openConfirm('ACCEPT')"
            >
              <CheckCircle class="h-4 w-4" />
              Accept
            </button>

            <!-- Deny -->
            <button
                class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition"
                :class="canDeny
                ? 'border-red-200 bg-white text-red-600 hover:bg-red-50 cursor-pointer'
                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'"
                :disabled="!canDeny"
                @click="openConfirm('DENY')"
            >
              <XCircle class="h-4 w-4" />
              Deny
            </button>
          </div>
        </div>

        <!-- Error banner -->
        <div v-if="actionError" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {{ actionError }}
        </div>

        <!-- Main content -->
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div class="space-y-6">
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h1 class="text-xl font-semibold text-slate-900 mb-4">{{ ticket.title }}</h1>
              <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {{ ticket.description || 'No description provided.' }}
              </p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 class="text-sm font-semibold text-slate-700 mb-4">Details</h2>
              <dl class="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt class="text-xs text-slate-400 uppercase tracking-wide mb-1">Customer</dt>
                  <dd class="text-slate-700">{{ ticket.creatorId ?? '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-400 uppercase tracking-wide mb-1">Source</dt>
                  <dd class="text-slate-700">Customer</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-400 uppercase tracking-wide mb-1">Created</dt>
                  <dd class="text-slate-700">{{ formatDate(ticket.createdAt) }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-400 uppercase tracking-wide mb-1">Last Updated</dt>
                  <dd class="text-slate-700">{{ formatDate(ticket.updatedAt) }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-400 uppercase tracking-wide mb-1">Type</dt>
                  <dd><TicketTypeBadge :type="ticket.type" /></dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-400 uppercase tracking-wide mb-1">Priority</dt>
                  <dd><TicketPriorityBadge :priority="ticket.priority" /></dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-4">
            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 class="text-sm font-semibold text-slate-700 mb-3">Assignment</h2>
              <div class="space-y-2 text-sm">
                <div>
                  <p class="text-xs text-slate-400 uppercase tracking-wide mb-1">Assigned To</p>
                  <p :class="ticket.assigneeId ? 'text-slate-700' : 'text-amber-500 font-medium'">
                    {{ getConsultantName(ticket.assigneeId) ?? 'Unassigned' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 class="text-sm font-semibold text-slate-700 mb-3">Status</h2>
              <TicketStatusBadge :status="ticket.status" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Assign modal -->
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="showAssignModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeAssignModal" />

        <div class="relative overflow-hidden rounded-xl bg-white shadow-2xl sm:w-full sm:max-w-md">
          <div class="px-6 py-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <UserPlus class="h-6 w-6" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900">Assign Ticket</h3>
                <p class="mt-1 text-sm text-slate-500">
                  Select a consultant for <span class="font-medium text-slate-700">TKT-{{ ticket?.id }}</span>
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Assign to</label>

              <div class="relative" ref="dropdownRef">
                <button
                    type="button"
                    class="w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    @click="dropdownOpen = !dropdownOpen"
                >
                  <span :class="selectedAssignee ? 'text-slate-900' : 'text-slate-400'">
                    {{ selectedAssignee
                      ? consultantUsers.find(u => u.id === selectedAssignee)?.username
                      : 'Select a team member...' }}
                  </span>
                  <ChevronDown
                      class="h-4 w-4 text-slate-400 transition-transform duration-150"
                      :class="dropdownOpen ? 'rotate-180' : ''"
                  />
                </button>

                <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95"
                >
                  <div
                      v-if="dropdownOpen"
                      class="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden"
                  >
                    <div class="px-4 py-2.5 text-sm text-slate-400 bg-slate-50 cursor-default select-none">
                      Select a team member...
                    </div>
                    <div
                        v-for="user in consultantUsers"
                        :key="user.id"
                        class="px-4 py-2.5 text-sm cursor-pointer transition"
                        :class="selectedAssignee === user.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-50'"
                        @click="selectedAssignee = user.id; dropdownOpen = false"
                    >
                      {{ user.username }}
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3">
            <button
                class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
                :disabled="isAssigning"
                @click="closeAssignModal"
            >
              Cancel
            </button>
            <button
                class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition shadow-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed"
                :disabled="!selectedAssignee || isAssigning"
                @click="handleAssign"
            >
              <Loader2 v-if="isAssigning" class="h-4 w-4 animate-spin" />
              {{ isAssigning ? 'Assigning…' : 'Assign' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirm modal (Accept / Deny) -->
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="showConfirmModal = false" />

        <div class="relative overflow-hidden rounded-xl bg-white shadow-2xl sm:w-full sm:max-w-md">
          <div class="px-6 py-6">
            <div class="flex items-center gap-4">
              <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                  :class="confirmActionType === 'ACCEPT' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'"
              >
                <CheckCircle v-if="confirmActionType === 'ACCEPT'" class="h-6 w-6" />
                <XCircle v-else class="h-6 w-6" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  {{ confirmActionType === 'ACCEPT' ? 'Accept Ticket' : 'Deny Ticket' }}
                </h3>
                <p class="mt-1 text-sm text-slate-500">
                  Are you sure you want to {{ confirmActionType === 'ACCEPT' ? 'accept' : 'deny' }} ticket
                  <span class="font-medium text-slate-700">TKT-{{ ticket?.id }}</span>?
                </p>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3">
            <button
                class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
                :disabled="isProcessing"
                @click="showConfirmModal = false"
            >
              Cancel
            </button>
            <button
                class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition shadow-sm disabled:opacity-75"
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
    </Transition>

  </SupportLayout>
</template>