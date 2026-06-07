<script setup>
import { computed, reactive, ref } from 'vue'
import {
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  Eye,
  UserPlus,
  Check,
  CircleX,
  ChevronUp,
  ChevronDown
} from 'lucide-vue-next'

const activeTab = ref('All')
const searchQuery = ref('')
const showFilters = ref(false)

const currentUserShort = 'E. K.'

const tabs = [
  { label: 'All', value: 'All' },
  { label: 'My Tickets', value: 'My Tickets' },
  { label: 'Unassigned', value: 'Unassigned' },
  { label: 'Open', value: 'Open' },
  { label: 'Closed', value: 'Closed' },
]

const filters = reactive({
  status: '',
  priority: '',
  type: '',
})

const tickets = [
  {
    id: 'TKT-2039',
    title: 'TLS certificate expiry warning ...',
    customer: 'Delta Logistics',
    type: 'Incident',
    priority: 'High',
    status: 'Open',
    assignedTo: '—',
    created: '02 May',
    updated: '02 May',
  },
  {
    id: 'TKT-2040',
    title: 'Scheduled job not executing at...',
    customer: 'Sunrise Retail',
    type: 'Incident',
    priority: 'Medium',
    status: 'Open',
    assignedTo: '—',
    created: '02 May',
    updated: '02 May',
  },
  {
    id: 'TKT-2046',
    title: 'Unexpected memory spike in i...',
    customer: 'GlobalTech BV',
    type: 'Incident',
    priority: 'High',
    status: 'In Review',
    assignedTo: '—',
    created: '01 May',
    updated: '01 May',
  },
  {
    id: 'TKT-2047',
    title: 'API integration failure in produ...',
    customer: 'Acme Corp',
    type: 'Incident',
    priority: 'Critical',
    status: 'Assigned',
    assignedTo: 'J. v. d. B.',
    created: '01 May',
    updated: '02 May',
  },
  {
    id: 'TKT-2044',
    title: 'Logging issue after deployment',
    customer: 'Delta Logistics',
    type: 'Incident',
    priority: 'Medium',
    status: 'Open',
    assignedTo: '—',
    created: '30 Apr',
    updated: '30 Apr',
  },
  {
    id: 'TKT-2045',
    title: 'Request to add new SAP endp...',
    customer: 'Sunrise Retail',
    type: 'RFC',
    priority: 'Medium',
    status: 'Accepted',
    assignedTo: 'L. N.',
    created: '29 Apr',
    updated: '02 May',
  },
  {
    id: 'TKT-2043',
    title: 'Performance degradation in cu...',
    customer: 'Nexus Manufacturing',
    type: 'Incident',
    priority: 'High',
    status: 'Assigned',
    assignedTo: 'J. v. d. B.',
    created: '28 Apr',
    updated: '01 May',
  },
  {
    id: 'TKT-2038',
    title: 'Add retry mechanism to outbo...',
    customer: 'Nexus Manufacturing',
    type: 'RFC',
    priority: 'Medium',
    status: 'In Review',
    assignedTo: '—',
    created: '26 Apr',
    updated: '01 May',
  },
  {
    id: 'TKT-2042',
    title: 'Data mapping error in order sy...',
    customer: 'Acme Corp',
    type: 'Incident',
    priority: 'High',
    status: 'Resolved',
    assignedTo: 'L. N.',
    created: '25 Apr',
    updated: '27 Apr',
  },
  {
    id: 'TKT-2034',
    title: 'Request to update authenticati...',
    customer: 'GlobalTech BV',
    type: 'RFC',
    priority: 'Low',
    status: 'Denied',
    assignedTo: '—',
    created: '22 Apr',
    updated: '24 Apr',
  },
  {
    id: 'TKT-2033',
    title: 'Incorrect timestamp format in e...',
    customer: 'Acme Corp',
    type: 'Incident',
    priority: 'Low',
    status: 'Resolved',
    assignedTo: 'J. v. d. B.',
    created: '20 Apr',
    updated: '22 Apr',
  },
  {
    id: 'TKT-2031',
    title: 'Internal: Review SLA complianc...',
    customer: 'eMagiz Internal',
    type: 'Internal',
    priority: 'Low',
    status: 'Closed',
    assignedTo: currentU
    erShort,
    created: '01 Apr',
    updated: '15 Apr',
  },
]

const badgeMap = {
  type: {
    Incident: 'bg-[#FFF2F2] text-[#DC5A61] ring-1 ring-inset ring-[#F2D8DA]',
    RFC: 'bg-[#EEF5FF] text-[#5A8EF2] ring-1 ring-inset ring-[#D9E7FA]',
    Internal: 'bg-[#F7ECFF] text-[#B05AE3] ring-1 ring-inset ring-[#E9D6FA]',
  },
  priority: {
    Critical: 'bg-[#FBE8EA] text-[#D64A5B] ring-1 ring-inset ring-[#F0D2D7]',
    High: 'bg-[#FFF3E3] text-[#E68A16] ring-1 ring-inset ring-[#F6DEC2]',
    Medium: 'bg-[#FFF9D9] text-[#C89D12] ring-1 ring-inset ring-[#EFE1A6]',
    Low: 'bg-[#EEF2F7] text-[#94A3B8] ring-1 ring-inset ring-[#DFE7F0]',
  },
  status: {
    Open: 'bg-[#EDF4FF] text-[#4F7DE8] ring-1 ring-inset ring-[#D7E4FB]',
    'In Review': 'bg-[#FFF6E7] text-[#D08A16] ring-1 ring-inset ring-[#F0DEB8]',
    Assigned: 'bg-[#EEF0FF] text-[#6658D3] ring-1 ring-inset ring-[#D9D8F7]',
    Accepted: 'bg-[#EAFBF2] text-[#28A267] ring-1 ring-inset ring-[#D0EFDF]',
    Resolved: 'bg-[#E8FBF9] text-[#1DA99E] ring-1 ring-inset ring-[#CBEDE9]',
    Denied: 'bg-[#FFF1F1] text-[#D95356] ring-1 ring-inset ring-[#F1D7D9]',
    Closed: 'bg-[#EEF2F7] text-[#7B8AA2] ring-1 ring-inset ring-[#DCE4EE]',
  },
}

const actionIcons = [
  { key: 'view', icon: Eye },
  { key: 'assign', icon: UserPlus },
  { key: 'approve', icon: Check },
  { key: 'close', icon: CircleX },
]

const badgeClass = (group, value) =>
    badgeMap[group][value] || 'bg-[#F3F4F6] text-[#667085] ring-1 ring-inset ring-[#E5E7EB]'

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const filteredTickets = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return tickets.filter((ticket) => {
    const matchesSearch =
        !query ||
        ticket.id.toLowerCase().includes(query) ||
        ticket.title.toLowerCase().includes(query) ||
        ticket.customer.toLowerCase().includes(query)

    const matchesStatus = !filters.status || ticket.status === filters.status
    const matchesPriority = !filters.priority || ticket.priority === filters.priority
    const matchesType = !filters.type || ticket.type === filters.type

    let matchesTab = true

    if (activeTab.value === 'My Tickets') {
      matchesTab = ticket.assignedTo === currentUserShort
    } else if (activeTab.value === 'Unassigned') {
      matchesTab = ticket.assignedTo === '—'
    } else if (activeTab.value === 'Open') {
      matchesTab = ticket.status === 'Open'
    } else if (activeTab.value === 'Closed') {
      matchesTab = ['Closed', 'Resolved', 'Denied'].includes(ticket.status)
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesTab
  })
})
</script>

<template>
  <div class="min-h-full bg-[#F6F8FB] px-6 py-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-[20px] font-semibold tracking-[-0.02em] text-[#1F2937]">
          Tickets
        </h1>
        <p class="mt-1 text-[13px] font-medium text-[#8A97AA]">
          12 tickets · Full access
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
            type="button"
            class="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#DDE5EF] bg-white px-4 text-[13px] font-semibold text-[#5E6B80] transition hover:bg-[#F8FAFD]"
        >
          <Download class="h-4 w-4" />
          <span>Export</span>
        </button>

        <button
            type="button"
            class="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-[#0FA99D] px-4 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(15,169,157,0.16)] transition hover:bg-[#0C9A8F]"
        >
          <Plus class="h-4 w-4 shrink-0" />
          <span>Create Ticket</span>
        </button>
      </div>
    </div>

    <div class="mt-4 overflow-hidden rounded-[18px] border border-[#E4EAF2] bg-white">
      <div class="border-b border-[#EDF2F7] px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="relative flex-1">
            <Search class="pointer-events-none absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#A6B0C2]" />

            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by title, ID, or customer..."
                class="h-[42px] w-full rounded-[12px] border border-[#DDE6F0] bg-[#F9FBFD] pl-11 pr-4 text-[14px] font-medium text-[#334155] outline-none placeholder:text-[#A7B0C2] focus:border-[#D7E1EE]"
            />
          </div>

          <button
              type="button"
              @click="toggleFilters"
              class="inline-flex h-[42px] items-center gap-2 rounded-[12px] border px-4 text-[14px] font-semibold transition"
              :class="showFilters
              ? 'border-[#BFE9E5] bg-[#F2FFFD] text-[#159C93]'
              : 'border-[#DDE6F0] bg-[#FBFCFE] text-[#64748B] hover:bg-[#F4F7FB]'"
          >
            <SlidersHorizontal class="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div
          v-if="showFilters"
          class="border-b border-[#EDF2F7] px-4 py-2.5"
      >
        <div class="flex flex-wrap items-center gap-2">
          <div class="relative">
            <select
                v-model="filters.status"
                class="h-8 min-w-[128px] appearance-none rounded-[9px] border border-[#DDE5EF] bg-white pl-3 pr-8 text-[12px] font-medium text-[#6C7B90] outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Denied">Denied</option>
              <option value="Assigned">Assigned</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <ChevronDown
                class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9AA7B8]"
            />
          </div>

          <div class="relative">
            <select
                v-model="filters.priority"
                class="h-8 min-w-[128px] appearance-none rounded-[9px] border border-[#DDE5EF] bg-white pl-3 pr-8 text-[12px] font-medium text-[#6C7B90] outline-none"
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <ChevronDown
                class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9AA7B8]"
            />
          </div>

          <div class="relative">
            <select
                v-model="filters.type"
                class="h-8 min-w-[128px] appearance-none rounded-[9px] border border-[#DDE5EF] bg-white pl-3 pr-8 text-[12px] font-medium text-[#6C7B90] outline-none"
            >
              <option value="">All Types</option>
              <option value="Incident">Incident</option>
              <option value="RFC">RFC</option>
              <option value="Internal">Internal</option>
            </select>

            <ChevronDown
                class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9AA7B8]"
            />
          </div>
        </div>
      </div>

      <div class="border-b border-[#EDF2F7] px-4">
        <div class="flex items-center gap-8">
          <button
              v-for="tab in tabs"
              :key="tab.value"
              type="button"
              @click="activeTab = tab.value"
              class="relative h-[42px] text-[13px] font-semibold transition"
              :class="activeTab === tab.value ? 'text-[#159C93]' : 'text-[#6F7E95] hover:text-[#334155]'"
          >
            {{ tab.label }}

            <span
                v-if="activeTab === tab.value"
                class="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-[#159C93]"
            />
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div class="min-w-[1120px]">
          <div class="grid grid-cols-[1.45fr_1fr_0.58fr_0.66fr_0.64fr_0.8fr_0.62fr_0.62fr_0.72fr] border-b border-[#EDF2F7] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8B98AC]">
            <div class="flex items-center gap-1">
              <span>TITLE</span>
              <ChevronUp class="h-3.5 w-3.5 text-[#CFD7E2]" />
            </div>

            <div class="flex items-center gap-1">
              <span>CUSTOMER</span>
              <ChevronUp class="h-3.5 w-3.5 text-[#CFD7E2]" />
            </div>

            <div class="flex items-center gap-1">
              <span>TYPE</span>
              <ChevronUp class="h-3.5 w-3.5 text-[#CFD7E2]" />
            </div>

            <div class="flex items-center gap-1">
              <span>PRIORITY</span>
              <ChevronUp class="h-3.5 w-3.5 text-[#CFD7E2]" />
            </div>

            <div class="flex items-center gap-1">
              <span>STATUS</span>
              <ChevronUp class="h-3.5 w-3.5 text-[#CFD7E2]" />
            </div>

            <div class="flex items-center gap-1">
              <span>ASSIGNED TO</span>
              <ChevronUp class="h-3.5 w-3.5 text-[#CFD7E2]" />
            </div>

            <div class="flex items-center gap-1">
              <span>CREATED</span>
              <ChevronUp class="h-3.5 w-3.5 text-[#15A198]" />
            </div>

            <div class="flex items-center gap-1">
              <span>UPDATED</span>
              <ChevronUp class="h-3.5 w-3.5 text-[#CFD7E2]" />
            </div>

            <div class="flex items-center gap-1">
              <span>ACTIONS</span>
            </div>
          </div>

          <div
              v-for="ticket in filteredTickets"
              :key="ticket.id"
              class="grid grid-cols-[1.45fr_1fr_0.58fr_0.66fr_0.64fr_0.8fr_0.62fr_0.62fr_0.72fr] items-center border-b border-[#F2F5F8] px-4 py-[14px] last:border-b-0"
          >
            <div class="min-w-0 pr-5">
              <p class="truncate text-[14px] font-semibold text-[#39485C]">
                {{ ticket.title }}
              </p>
            </div>

            <div class="truncate pr-4 text-[14px] font-medium text-[#5E6D80]">
              {{ ticket.customer }}
            </div>

            <div>
              <span
                  class="inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none"
                  :class="badgeClass('type', ticket.type)"
              >
                {{ ticket.type }}
              </span>
            </div>

            <div>
              <span
                  class="inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none"
                  :class="badgeClass('priority', ticket.priority)"
              >
                {{ ticket.priority }}
              </span>
            </div>

            <div>
              <span
                  class="inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none"
                  :class="badgeClass('status', ticket.status)"
              >
                {{ ticket.status }}
              </span>
            </div>

            <div class="truncate pr-3 text-[14px] font-medium text-[#546376]">
              {{ ticket.assignedTo }}
            </div>

            <div class="text-[13px] font-semibold text-[#97A5B7]">
              {{ ticket.created }}
            </div>

            <div class="text-[13px] font-semibold text-[#97A5B7]">
              {{ ticket.updated }}
            </div>

            <div class="flex items-center gap-3 text-[#AAB5C5]">
              <button
                  v-for="action in actionIcons"
                  :key="`${ticket.id}-${action.key}`"
                  type="button"
                  class="transition hover:text-[#68778C]"
              >
                <component :is="action.icon" class="h-[14px] w-[14px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-[#EDF2F7] px-4 py-3">
        <p class="text-[12px] font-medium text-[#9BA7B8]">
          Showing {{ filteredTickets.length }} tickets
        </p>

        <div class="flex items-center gap-2 text-[12px] font-medium text-[#97A3B6]">
          <button
              type="button"
              class="rounded-md px-2.5 py-1 transition hover:bg-[#F5F7FA] hover:text-[#5E6B80]"
          >
            Previous
          </button>

          <span class="text-[#7D8A9F]">Page 1 of 1</span>

          <button
              type="button"
              class="rounded-md px-2.5 py-1 transition hover:bg-[#F5F7FA] hover:text-[#5E6B80]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>