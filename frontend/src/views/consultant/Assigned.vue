<script setup>
import { ref, computed, onMounted } from 'vue';
import ConsultantLayout from '@/layouts/ConsultantLayout.vue';
import TicketTypeBadge from '@/components/tickets/TicketTypeBadge.vue';
import TicketPriorityBadge from '@/components/tickets/TicketPriorityBadge.vue';
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge.vue';
import { fetchAssignedTicketsForCurrentUser } from '@api/tickets';
import { fetchUsers } from '@api/users';
import { useRouter } from 'vue-router';

const router = useRouter();
const tickets = ref([]);
const usersMap = ref({});
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

const statusOptions   = ['IN_REVIEW', 'ACCEPTED', 'DENIED', 'ASSIGNED', 'RESOLVED', 'CLOSED'];
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

onMounted(async () => {
  try {
    const [fetchedTickets, users] = await Promise.all([
      fetchAssignedTicketsForCurrentUser(),
      fetchUsers(),
    ]);
    tickets.value = fetchedTickets;
    usersMap.value = Object.fromEntries(users.map(u => [u.id, u.username]));
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
});

function getAssigneeName(assigneeId) {
  if (!assigneeId) return '—';
  return usersMap.value[assigneeId] ?? assigneeId;
}

const searched = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return tickets.value.filter(t => {
    const matchesQuery    = !q || t.title?.toLowerCase().includes(q) || t.id?.toString().includes(q);
    const matchesStatus   = !filterStatus.value   || t.status   === filterStatus.value;
    const matchesPriority = !filterPriority.value || t.priority === filterPriority.value;
    const matchesType     = !filterType.value     || t.type     === filterType.value;
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
</script>

<template>
  <ConsultantLayout>
    <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Tickets</h1>
          <p class="text-sm text-slate-500 mt-0.5">
            {{ tickets.length }} tickets
          </p>
        </div>
      </div>

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
                placeholder="Search by title or ID..."
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
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="ticket in paginated"
              :key="ticket.id"
              class="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition"
              @click="router.push(`/consultant/assigned/ticket/TKT-${ticket.id}`)"
          >
            <td class="px-4 py-3 font-mono text-xs text-teal-600 whitespace-nowrap">
              TKT-{{ ticket.id }}
            </td>
            <td class="px-4 py-3 text-slate-800 max-w-[200px] truncate">
              {{ ticket.title }}
            </td>
            <td class="px-4 py-3 text-slate-500 whitespace-nowrap">
              {{ ticket.creatorId ?? '—' }}
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
              {{ getAssigneeName(ticket.assigneeId) }}
            </td>
            <td class="px-4 py-3 text-slate-400 whitespace-nowrap">
              {{ formatDate(ticket.createdAt) }}
            </td>
            <td class="px-4 py-3 text-slate-400 whitespace-nowrap">
              {{ formatDate(ticket.updatedAt) }}
            </td>
          </tr>

          <tr v-if="paginated.length === 0">
            <td colspan="9" class="px-4 py-12 text-center text-sm text-slate-400">
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
  </ConsultantLayout>
</template>