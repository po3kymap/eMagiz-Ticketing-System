<script setup>
import { ref, computed, onMounted } from 'vue';
import SupportLayout from '@/layouts/SupportLayout.vue';
import TicketTypeBadge from '@/components/tickets/TicketTypeBadge.vue';
import TicketPriorityBadge from '@/components/tickets/TicketPriorityBadge.vue';
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge.vue';
import { fetchAllTickets, acceptTicket, denyTicket, assignTicket, changeTicketStatus } from '@api/tickets';
import { fetchUsers } from '@api/users';

const allTickets = ref([]);
const isLoading = ref(true);
const error = ref('');
const searchQuery = ref('');  
const sortKey = ref('createdAt');
const sortDir = ref('desc');
const currentPage = ref(1);
const PAGE_SIZE = 15;
const showFilters = ref(false);
const filterStatus   = ref('');
const filterPriority = ref('');
const filterType     = ref('');
const showAssignModal = ref(false);
const assignTicketObj = ref(null);
const selectedAssignee = ref('');
const isAssigning = ref(false);
const consultantUsers = ref([]);

const statusOptions   = ['OPEN', 'IN_REVIEW', 'DENIED', 'ASSIGNED', 'CLOSED'];
const priorityOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const typeOptions     = ['INCIDENT', 'RFC'];

const columns = [
  { key: 'id',         label: 'Ticket ID' },
  { key: 'title',      label: 'Title' },
  { key: 'creatorId',  label: 'Customer' },
  { key: 'type',       label: 'Type' },
  { key: 'priority',   label: 'Priority' },
  { key: 'status',     label: 'Status' },
  { key: 'assigneeId', label: 'Assigned To' },
  { key: 'createdAt',  label: 'Created' },
  { key: 'updatedAt',  label: 'Updated' },
];

const showConfirmModal = ref(false);
const confirmTicket = ref(null);
const confirmActionType = ref('');
const allUsers = ref([]);

onMounted(async () => {
  try {
    allTickets.value = await fetchAllTickets();
    const usersData = await fetchUsers();
    allUsers.value = usersData;
    consultantUsers.value = usersData.filter(u => u.role === 'Consultant');
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
});

function getUserNameDisplay(id) {
  if (!id) return '—';
  const user = allUsers.value.find(u => u.id === id);
  return user?.username ? `${user.username} (${id})` : id;
}

const searched = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return allTickets.value.filter(t => {
    const creatorName = String(getUserNameDisplay(t.creatorId)).toLowerCase();
    
    const matchesQuery = !q || 
        t.title?.toLowerCase().includes(q) || 
        t.id?.toString().includes(q) ||
        creatorName.includes(q); 

    const matchesStatus   = !filterStatus.value   || String(t.status).toUpperCase() === filterStatus.value;
    const matchesPriority = !filterPriority.value || String(t.priority).toUpperCase() === filterPriority.value;
    const matchesType     = !filterType.value     || String(t.type).toUpperCase() === filterType.value;
    
    return matchesQuery && matchesStatus && matchesPriority && matchesType;
  });
});

const sorted = computed(() => {
  return [...searched.value].sort((a, b) => {
    const valA = a[sortKey.value] ?? '';
    const valB = b[sortKey.value] ?? '';
    const cmp = String(valA).localeCompare(String(valB));
    return sortDir.value === 'asc' ? cmp : -cmp;
  });
});

const totalPages = computed(() => Math.ceil(sorted.value.length / PAGE_SIZE) || 1);

const paginated = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return sorted.value.slice(start, start + PAGE_SIZE);
});

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDir.value = 'asc';
  }
  currentPage.value = 1;
}

function formatDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function onView(ticket) {
  console.log('View ticket', ticket.id);
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

const isProcessing = ref(false);

async function handleConfirm() {
  if (isProcessing.value) return;
  
  isProcessing.value = true;
  
  try {
    if (confirmActionType.value === 'ACCEPT') {
      await acceptTicket(confirmTicket.value?.id);
    } else if (confirmActionType.value === 'DENY') {
      await denyTicket(confirmTicket.value?.id);
    }
    
    allTickets.value = await fetchAllTickets();
    
    closeConfirmModal();
  } catch (err) {
    console.error('Failed to process ticket action:', err);
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
  if (!selectedAssignee.value || isAssigning.value) return;
  
  isAssigning.value = true;
  try {
    await assignTicket(assignTicketObj.value?.id, selectedAssignee.value);
    await changeTicketStatus(assignTicketObj.value?.id, 'ASSIGNED');
    allTickets.value = await fetchAllTickets();
    closeAssignModal();
  } catch (err) {
    console.error(err);
    alert('Failed to assign the ticket.');
  } finally {
    isAssigning.value = false;
  }
}
</script>

<template>
  <SupportLayout>
    <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

      <h1 class="text-xl font-semibold text-slate-900">Tickets</h1>
      <p class="text-sm text-slate-500 mt-0.5">
        {{ allTickets.length }} tickets · Open tickets
      </p>

      <div class="space-y-3">
        <div class="flex gap-3">
          <div class="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
            <svg class="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
                v-model="searchQuery"
                type="search"
                placeholder="Search by title, ID, or customer..."
                class="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                @input="currentPage = 1"
            />
          </div>

          <button
              class="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition"
              :class="showFilters
                ? 'border-teal-500 bg-teal-50 text-teal-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
              @click="showFilters = !showFilters"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            Filters
            <span
                v-if="filterStatus || filterPriority || filterType"
                class="h-2 w-2 rounded-full bg-teal-500"
            />
          </button>
        </div>

        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
        >
          <div v-if="showFilters" class="flex flex-wrap gap-3">
            <div class="relative">
              <select
                  v-model="filterStatus"
                  class="appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-8 py-2 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 cursor-pointer"
                  @change="currentPage = 1"
              >
                <option value="">All Statuses</option>
                <option v-for="s in statusOptions" :key="s" :value="s">
                  {{ s.charAt(0) + s.slice(1).toLowerCase().replace('_', ' ') }}
                </option>
              </select>
              <svg class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            <div class="relative">
              <select
                  v-model="filterPriority"
                  class="appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-8 py-2 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 cursor-pointer"
                  @change="currentPage = 1"
              >
                <option value="">All Priorities</option>
                <option v-for="p in priorityOptions" :key="p" :value="p">
                  {{ p.charAt(0) + p.slice(1).toLowerCase() }}
                </option>
              </select>
              <svg class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            <div class="relative">
              <select
                  v-model="filterType"
                  class="appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-8 py-2 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 cursor-pointer"
                  @change="currentPage = 1"
              >
                <option value="">All Types</option>
                <option v-for="t in typeOptions" :key="t" :value="t">
                  {{ t.charAt(0) + t.slice(1).toLowerCase() }}
                </option>
              </select>
              <svg class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            <button
                v-if="filterStatus || filterPriority || filterType"
                class="text-sm text-slate-400 hover:text-slate-600 transition px-2"
                @click="filterStatus = ''; filterPriority = ''; filterType = ''; currentPage = 1"
            >
              Clear all
            </button>
          </div>
        </Transition>
      </div>

      <div v-if="isLoading" class="py-12 text-center text-sm text-slate-400">
        Loading tickets…
      </div>

      <div v-else-if="error" class="py-12 text-center text-sm text-red-500">
        {{ error }}
      </div>

      <div v-else class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-sm">
          <thead>
          <tr class="border-b border-slate-200">
            <th
                v-for="col in columns"
                :key="col.key"
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 cursor-pointer select-none hover:text-slate-600 transition whitespace-nowrap"
                @click="toggleSort(col.key)"
            >
              {{ col.label }}
              <span v-if="sortKey === col.key" class="ml-0.5">
                  {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400 select-none whitespace-nowrap">
              Actions
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="ticket in paginated"
              :key="ticket.id"
              class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
          >
            <td class="px-4 py-3 font-mono text-xs text-teal-600 whitespace-nowrap cursor-pointer" @click="onView(ticket)">
              TKT-{{ ticket.id }}
            </td>
            <td class="px-4 py-3 text-slate-800 max-w-[200px] truncate">
              {{ ticket.title }}
            </td>
            <td class="px-4 py-3 text-slate-500 whitespace-nowrap">
              {{ getUserNameDisplay(ticket.creatorId) }}
            </td>
            <td class="px-4 py-3">
              <TicketTypeBadge :type="ticket.type" />
            </td>
            <td class="px-4 py-3">
              <TicketPriorityBadge :priority="ticket.priority" />
            </td>
            <td class="px-4 py-3">
              <TicketStatusBadge :status="ticket.status" />
            </td>
            <td class="px-4 py-3 text-slate-500 whitespace-nowrap">
              {{ getUserNameDisplay(ticket.assigneeId) }}
            </td>
            <td class="px-4 py-3 text-slate-400 whitespace-nowrap">
              {{ formatDate(ticket.createdAt) }}
            </td>
            <td class="px-4 py-3 text-slate-400 whitespace-nowrap">
              {{ formatDate(ticket.updatedAt) }}
            </td>
            
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1 text-slate-400">
                
                <button
                    type="button"
                    class="rounded p-1.5 hover:bg-slate-200 hover:text-slate-700 transition"
                    title="View"
                    @click="onView(ticket)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>

                <button
                    v-if="String(ticket.status).toUpperCase() === 'OPEN'"
                    type="button"
                    class="rounded p-1.5 hover:bg-blue-100 hover:text-blue-600 transition"
                    title="Assign"
                    @click="onAssign(ticket)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                  </svg>
                </button>

                <button
                    v-if="['OPEN', 'IN_REVIEW'].includes(String(ticket.status).toUpperCase())"
                    type="button"
                    class="rounded p-1.5 hover:bg-emerald-100 hover:text-emerald-600 transition"
                    title="Accept"
                    @click="onAccept(ticket)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>

                <button
                    v-if="['OPEN', 'IN_REVIEW'].includes(String(ticket.status).toUpperCase())"
                    type="button"
                    class="rounded p-1.5 hover:bg-red-100 hover:text-red-600 transition"
                    title="Deny"
                    @click="onDeny(ticket)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>

              </div>
            </td>
          </tr>

          <tr v-if="paginated.length === 0">
            <td colspan="10" class="px-4 py-12 text-center text-sm text-slate-400">
              No tickets found.
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between text-sm text-slate-500">
        <span>Showing {{ sorted.length }} tickets</span>
        <div class="flex items-center gap-3">
          <button
              class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
              :disabled="currentPage === 1"
              @click="currentPage--"
          >Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
              class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
          >Next</button>
        </div>
      </div>

    </div>

    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        
        <div 
            class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" 
            @click="closeConfirmModal"
        ></div>

        <div class="relative overflow-hidden rounded-xl bg-white shadow-2xl sm:w-full sm:max-w-md transform transition-all">
          <div class="px-6 py-6">
            <div class="flex items-center gap-4">
              
              <div 
                  class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                  :class="confirmActionType === 'ACCEPT' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'"
              >
                <svg v-if="confirmActionType === 'ACCEPT'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
                </svg>
              </div>

              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  {{ confirmActionType === 'ACCEPT' ? 'Accept Ticket' : 'Deny Ticket' }}
                </h3>
                <p class="mt-1 text-sm text-slate-500">
                  Are you sure you want to {{ confirmActionType === 'ACCEPT' ? 'accept' : 'deny' }} ticket <span class="font-medium text-slate-700">TKT-{{ confirmTicket?.id }}</span>? 
                </p>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3">
            <button
                type="button"
                class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isProcessing"
                @click="closeConfirmModal"
            >
              Cancel
            </button>
            <button
                type="button"
                class="flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
                :class="confirmActionType === 'ACCEPT' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'"
                :disabled="isProcessing"
                @click="handleConfirm"
            >
              <svg 
                  v-if="isProcessing" 
                  class="mr-2 h-4 w-4 animate-spin text-white" 
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              
              {{ isProcessing ? 'Processing...' : 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="showAssignModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        
        <div 
            class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" 
            @click="closeAssignModal"
        ></div>

        <div class="relative overflow-hidden rounded-xl bg-white shadow-2xl sm:w-full sm:max-w-md transform transition-all">
          <div class="px-6 py-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900">Assign Ticket</h3>
                <p class="mt-1 text-sm text-slate-500">
                  Select a consultant for <span class="font-medium text-slate-700">TKT-{{ assignTicketObj?.id }}</span>
                </p>
              </div>
            </div>

            <div>
              <label for="assignee" class="block text-sm font-medium text-slate-700 mb-1">
                Assign to
              </label>
              <select
                  id="assignee"
                  v-model="selectedAssignee"
                  class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>Select a team member...</option>
                <option v-for="user in consultantUsers" :key="user.id" :value="user.id">
                  {{ user.username }}
                </option>
              </select>
            </div>
          </div>

          <div class="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3">
            <button
                type="button"
                class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
                :disabled="isAssigning"
                @click="closeAssignModal"
            >
              Cancel
            </button>
            <button
                type="button"
                class="flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition shadow-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed"
                :disabled="!selectedAssignee || isAssigning"
                @click="handleAssignConfirm"
            >
              <svg 
                  v-if="isAssigning" 
                  class="mr-2 h-4 w-4 animate-spin text-white" 
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isAssigning ? 'Assigning...' : 'Assign' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </SupportLayout>
</template>