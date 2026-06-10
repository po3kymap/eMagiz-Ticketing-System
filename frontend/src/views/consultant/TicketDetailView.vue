<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ConsultantLayout from '@/layouts/ConsultantLayout.vue';
import TicketTypeBadge from '@/components/tickets/TicketTypeBadge.vue';
import TicketPriorityBadge from '@/components/tickets/TicketPriorityBadge.vue';
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge.vue';
import { getAuthHeaders, getCurrentUser } from '@api/auth';
import { fetchTicketById } from '@api/tickets';
import { ArrowLeft, Flag, MessageSquare, XCircle, X, ChevronRight } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const ticket = ref(null);
const currentUser = ref(null);
const isLoading = ref(true);
const error = ref('');
const actionError = ref('');
const actionLoading = ref('');

const noteContent = ref('');
const showNotePanel = ref(false);
const noteLoading = ref(false);

const showPriorityPanel = ref(false);
const selectedPriority = ref('');
const priorityOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const isAssignedToMe = computed(() =>
    ticket.value?.assigneeId != null &&
    ticket.value?.assigneeId === currentUser.value?.userId
);

async function fetchTicket() {
  isLoading.value = true;
  error.value = '';
  try {
    ticket.value = await fetchTicketById(route.params.id.replace('TKT-', ''));
    selectedPriority.value = ticket.value.priority ?? '';
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

async function updateStatus(status) {
  actionLoading.value = status;
  actionError.value = '';
  try {
    const res = await fetch(`/api/tickets/${ticket.value.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`Failed to update status`);
    ticket.value.status = status;
  } catch (e) {
    actionError.value = e.message;
  } finally {
    actionLoading.value = '';
  }
}

async function savePriority() {
  actionLoading.value = 'priority';
  actionError.value = '';
  try {
    const res = await fetch(`/api/tickets/update/${ticket.value.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ...ticket.value, priority: selectedPriority.value }),
    });
    if (!res.ok) throw new Error('Failed to update priority');
    ticket.value.priority = selectedPriority.value;
    showPriorityPanel.value = false;
  } catch (e) {
    actionError.value = e.message;
  } finally {
    actionLoading.value = '';
  }
}

async function submitNote() {
  if (!noteContent.value.trim()) return;
  noteLoading.value = true;
  actionError.value = '';
  try {
    const res = await fetch(`/api/tickets/${ticket.value.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ content: noteContent.value.trim(), internal: true }),
    });
    if (!res.ok) throw new Error('Failed to add note');
    noteContent.value = '';
    showNotePanel.value = false;
  } catch (e) {
    actionError.value = e.message;
  } finally {
    noteLoading.value = false;
  }
}

function formatDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

onMounted(async () => {
  currentUser.value = await getCurrentUser();
  await fetchTicket();
});
</script>

<template>
  <ConsultantLayout>
    <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      <div v-if="isLoading" class="py-24 text-center text-sm text-slate-400">
        Loading ticket…
      </div>

      <div v-else-if="error" class="py-24 text-center text-sm text-red-500">
        {{ error }}
      </div>

      <template v-else-if="ticket">
        <div class="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <button
              class="flex items-center gap-1 hover:text-teal-600 transition font-medium"
              @click="router.push('/consultant/assigned')"
          >
            <ArrowLeft class="h-4 w-4" />
            Tickets
          </button>
          <ChevronRight class="h-4 w-4" />
          <span class="font-mono text-slate-600">TKT-{{ ticket.id }}</span>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-mono text-xs text-slate-400">TKT-{{ ticket.id }}</span>
            <TicketTypeBadge :type="ticket.type" />
            <TicketPriorityBadge :priority="ticket.priority" />
            <TicketStatusBadge :status="ticket.status" />
          </div>

          <div v-if="isAssignedToMe" class="flex flex-wrap gap-2">
            <button
                class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                @click="showPriorityPanel = !showPriorityPanel; showNotePanel = false"
            >
              <Flag class="h-4 w-4" />
              Priority
            </button>

            <button
                class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                @click="showNotePanel = !showNotePanel; showPriorityPanel = false"
            >
              <MessageSquare class="h-4 w-4" />
              Note
            </button>

            <button
                class="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                :disabled="actionLoading === 'DENIED' || ticket.status === 'DENIED'"
                @click="updateStatus('DENIED')"
            >
              <XCircle class="h-4 w-4" />
              {{ actionLoading === 'DENIED' ? 'Denying…' : 'Deny' }}
            </button>

            <button
                class="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
                :disabled="actionLoading === 'CLOSED' || ticket.status === 'CLOSED'"
                @click="updateStatus('CLOSED')"
            >
              <X class="h-4 w-4" />
              {{ actionLoading === 'CLOSED' ? 'Closing…' : 'Close' }}
            </button>
          </div>
        </div>

        <div v-if="actionError" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {{ actionError }}
        </div>

        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
        >
          <div v-if="showPriorityPanel" class="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-sm font-medium text-slate-700 mb-3">Set Priority</p>
            <div class="flex flex-wrap gap-2 mb-3">
              <button
                  v-for="p in priorityOptions"
                  :key="p"
                  class="rounded-lg border px-3 py-1.5 text-sm font-medium transition"
                  :class="selectedPriority === p
                                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
                  @click="selectedPriority = p"
              >
                {{ p.charAt(0) + p.slice(1).toLowerCase() }}
              </button>
            </div>
            <div class="flex gap-2">
              <button
                  class="rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 transition"
                  :disabled="actionLoading === 'priority'"
                  @click="savePriority"
              >
                {{ actionLoading === 'priority' ? 'Saving…' : 'Save' }}
              </button>
              <button
                  class="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                  @click="showPriorityPanel = false"
              >
                Cancel
              </button>
            </div>
          </div>
        </Transition>

        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
        >
          <div v-if="showNotePanel" class="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-sm font-medium text-slate-700 mb-3">Internal Note</p>
            <textarea
                v-model="noteContent"
                rows="3"
                placeholder="Write an internal note…"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition resize-none"
            />
            <div class="mt-2 flex gap-2">
              <button
                  class="rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 transition"
                  :disabled="noteLoading || !noteContent.trim()"
                  @click="submitNote"
              >
                {{ noteLoading ? 'Saving…' : 'Save Note' }}
              </button>
              <button
                  class="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                  @click="showNotePanel = false; noteContent = ''"
              >
                Cancel
              </button>
            </div>
          </div>
        </Transition>

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

          <div class="space-y-4">
            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 class="text-sm font-semibold text-slate-700 mb-3">Assignment</h2>
              <div class="space-y-2 text-sm">
                <div>
                  <p class="text-xs text-slate-400 uppercase tracking-wide mb-1">Assigned To</p>
                  <p :class="ticket.assigneeId ? 'text-slate-700' : 'text-amber-500 font-medium'">
                    {{ ticket.assigneeId ?? 'Unassigned' }}
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
  </ConsultantLayout>
</template>