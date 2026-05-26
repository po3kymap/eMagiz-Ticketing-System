<script setup>
import { computed, ref } from 'vue'
import {
  Search,
  Download,
  ShieldCheck,
  ChevronDown
} from 'lucide-vue-next'

const searchQuery = ref('')
const roleFilter = ref('')
const actionFilter = ref('')
const sortOrder = ref('newest')

const auditEntries = [
  {
    id: 'EMAGIZ-AUDIT-2026-001',
    date: '02 May 2025',
    time: '16:10:00 UTC',
    user: 'James van der Berg',
    initials: 'JV',
    role: 'Consultant',
    action: 'Status Changed',
    ticketRef: 'TKT-2047',
    previousValue: 'Accepted',
    newValue: 'Assigned',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-002',
    date: '02 May 2025',
    time: '13:00:00 UTC',
    user: 'Elena Kowalski',
    initials: 'EK',
    role: 'Support',
    action: 'Ticket Accepted',
    ticketRef: 'TKT-2045',
    previousValue: 'In Review',
    newValue: 'Accepted',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-003',
    date: '02 May 2025',
    time: '11:30:00 UTC',
    user: 'Elena Kowalski',
    initials: 'EK',
    role: 'Support',
    action: 'Priority Changed',
    ticketRef: 'TKT-2046',
    previousValue: 'Medium',
    newValue: 'High',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-004',
    date: '01 May 2025',
    time: '18:20:00 UTC',
    user: 'System',
    initials: '•',
    role: 'System',
    action: 'Ticket Created',
    ticketRef: 'TKT-2046',
    previousValue: '—',
    newValue: 'Open',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-005',
    date: '01 May 2025',
    time: '11:15:00 UTC',
    user: 'Lara Nkemdirim',
    initials: 'LN',
    role: 'Consultant',
    action: 'Comment Added',
    ticketRef: 'TKT-2043',
    previousValue: '—',
    newValue: 'Investigating latency root cause',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-006',
    date: '01 May 2025',
    time: '10:50:00 UTC',
    user: 'Elena Kowalski',
    initials: 'EK',
    role: 'Support',
    action: 'Assigned Consultant',
    ticketRef: 'TKT-2043',
    previousValue: 'Unassigned',
    newValue: 'James van der Berg',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-007',
    date: '30 Apr 2025',
    time: '16:05:00 UTC',
    user: 'Sarah Mitchell',
    initials: 'SM',
    role: 'Customer',
    action: 'Ticket Created',
    ticketRef: 'TKT-2044',
    previousValue: '—',
    newValue: 'Open',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-008',
    date: '27 Apr 2025',
    time: '17:30:00 UTC',
    user: 'Lara Nkemdirim',
    initials: 'LN',
    role: 'Consultant',
    action: 'Status Changed',
    ticketRef: 'TKT-2042',
    previousValue: 'Assigned',
    newValue: 'Resolved',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-009',
    date: '24 Apr 2025',
    time: '12:00:00 UTC',
    user: 'Elena Kowalski',
    initials: 'EK',
    role: 'Support',
    action: 'Ticket Denied',
    ticketRef: 'TKT-2041',
    previousValue: 'In Review',
    newValue: 'Denied',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-010',
    date: '22 Apr 2025',
    time: '15:00:00 UTC',
    user: 'GlobalTech BV',
    initials: 'GB',
    role: 'Customer',
    action: 'Ticket Created',
    ticketRef: 'TKT-2041',
    previousValue: '—',
    newValue: 'Open',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-011',
    date: '29 Apr 2025',
    time: '11:10:00 UTC',
    user: 'Sunrise Retail',
    initials: 'SR',
    role: 'Customer',
    action: 'Ticket Created',
    ticketRef: 'TKT-2045',
    previousValue: '—',
    newValue: 'Open',
  },
  {
    id: 'EMAGIZ-AUDIT-2026-012',
    date: '02 May 2025',
    time: '08:00:00 UTC',
    user: 'System',
    initials: '•',
    role: 'System',
    action: 'Ticket Created',
    ticketRef: 'TKT-2040',
    previousValue: '—',
    newValue: 'Open',
  },
]

const roleOptions = ['Consultant', 'Support', 'System', 'Customer']
const actionOptions = [
  'Status Changed',
  'Ticket Accepted',
  'Priority Changed',
  'Ticket Created',
  'Comment Added',
  'Assigned Consultant',
  'Ticket Denied',
]

const toTimestamp = (entry) => new Date(`${entry.date} ${entry.time.replace(' UTC', '')} UTC`).getTime()

const filteredEntries = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  let result = auditEntries.filter((entry) => {
    const matchesSearch =
        !query ||
        entry.user.toLowerCase().includes(query) ||
        entry.ticketRef.toLowerCase().includes(query) ||
        entry.action.toLowerCase().includes(query)

    const matchesRole = !roleFilter.value || entry.role === roleFilter.value
    const matchesAction = !actionFilter.value || entry.action === actionFilter.value

    return matchesSearch && matchesRole && matchesAction
  })

  result = [...result].sort((a, b) => {
    return sortOrder.value === 'newest'
        ? toTimestamp(b) - toTimestamp(a)
        : toTimestamp(a) - toTimestamp(b)
  })

  return result
})

const roleBadgeClass = (role) => {
  const map = {
    Consultant: 'bg-[#EEF0FF] text-[#6C63D9] ring-1 ring-inset ring-[#DCDDFA]',
    Support: 'bg-[#EAFBF8] text-[#269C8D] ring-1 ring-inset ring-[#CDEEE8]',
    System: 'bg-[#EEF2F7] text-[#8A97AB] ring-1 ring-inset ring-[#DDE5EE]',
    Customer: 'bg-[#EEF5FF] text-[#4F7DE8] ring-1 ring-inset ring-[#D9E7FA]',
  }

  return map[role] || 'bg-[#F3F4F6] text-[#667085] ring-1 ring-inset ring-[#E5E7EB]'
}

const actionClass = (action) => {
  const map = {
    'Status Changed': 'text-[#5E5AD7]',
    'Ticket Accepted': 'text-[#1FA78F]',
    'Priority Changed': 'text-[#D48A17]',
    'Ticket Created': 'text-[#4F7DE8]',
    'Comment Added': 'text-[#64748B]',
    'Assigned Consultant': 'text-[#7C5CE0]',
    'Ticket Denied': 'text-[#D95356]',
  }

  return map[action] || 'text-[#475569]'
}

const valueBadgeClass = (value) => {
  const map = {
    Accepted: 'bg-[#FBEAEC] text-[#D75A68]',
    Assigned: 'bg-[#EAFBF2] text-[#29A46A]',
    'In Review': 'bg-[#FFF1F1] text-[#D7636A]',
    Medium: 'bg-[#FFF4D9] text-[#C89B13]',
    High: 'bg-[#EAFBF2] text-[#29A46A]',
    Open: 'bg-[#EAFBF2] text-[#29A46A]',
    Resolved: 'bg-[#E8FBF9] text-[#1DA99E]',
    Denied: 'bg-[#FFF1F1] text-[#D95356]',
    Unassigned: 'bg-[#FFF1F1] text-[#D7636A]',
    'James van der Berg': 'bg-[#EAFBF2] text-[#29936C]',
    'Investigating latency root cause': 'bg-[#EAFBF2] text-[#29936C]',
  }

  if (value === '—') return 'text-[#B1BBC9]'
  return map[value] || 'bg-[#EEF2F7] text-[#64748B]'
}
</script>

<template>
  <div class="min-h-full bg-[#F6F8FB] px-6 py-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="flex items-center gap-2 text-[20px] font-semibold tracking-[-0.02em] text-[#1F2937]">
          <ShieldCheck class="h-5 w-5 text-[#2AA79B]" />
          <span>Audit Log</span>
        </h1>
        <p class="mt-1 text-[13px] font-medium text-[#8A97AA]">
          Complete traceability of all system and user actions
        </p>
      </div>

      <button
          type="button"
          class="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#DDE5EF] bg-white px-4 text-[13px] font-semibold text-[#5E6B80] transition hover:bg-[#F8FAFD]"
      >
        <Download class="h-4 w-4" />
        <span>Export CSV</span>
      </button>
    </div>

    <div class="mt-4 rounded-[16px] border border-[#BFE9E1] bg-[#F1FBF9] px-4 py-4">
      <div class="flex items-start gap-3">
        <div class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#E1F7F3] text-[#1FA78F]">
          <ShieldCheck class="h-3.5 w-3.5" />
        </div>

        <div>
          <p class="text-[14px] font-semibold text-[#249C90]">
            Audit trail is immutable and tamper-proof
          </p>
          <p class="mt-1 text-[12px] font-medium leading-5 text-[#5FA49D]">
            All entries are cryptographically signed and stored in compliance with SOC 2 Type II. Records are retained for a minimum of 7 years. Audit logs cannot be edited or deleted.
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 overflow-hidden rounded-[18px] border border-[#E4EAF2] bg-white">
      <div class="border-b border-[#EDF2F7] px-4 py-3">
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative min-w-[320px] flex-1">
            <Search class="pointer-events-none absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#A6B0C2]" />

            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by user, ticket ID, or action..."
                class="h-[42px] w-full rounded-[12px] border border-[#DDE6F0] bg-[#F9FBFD] pl-11 pr-4 text-[14px] font-medium text-[#334155] outline-none placeholder:text-[#A7B0C2] focus:border-[#D7E1EE]"
            />
          </div>

          <div class="relative">
            <select
                v-model="roleFilter"
                class="h-[42px] min-w-[150px] appearance-none rounded-[12px] border border-[#DDE6F0] bg-white pl-4 pr-10 text-[14px] font-medium text-[#64748B] outline-none"
            >
              <option value="">All Roles</option>
              <option
                  v-for="role in roleOptions"
                  :key="role"
                  :value="role"
              >
                {{ role }}
              </option>
            </select>

            <ChevronDown
                class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F8EA3]"
            />
          </div>

          <div class="relative">
            <select
                v-model="actionFilter"
                class="h-[42px] min-w-[170px] appearance-none rounded-[12px] border border-[#DDE6F0] bg-white pl-4 pr-10 text-[14px] font-medium text-[#64748B] outline-none"
            >
              <option value="">All Actions</option>
              <option
                  v-for="action in actionOptions"
                  :key="action"
                  :value="action"
              >
                {{ action }}
              </option>
            </select>

            <ChevronDown
                class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F8EA3]"
            />
          </div>

          <button
              type="button"
              @click="sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest'"
              class="inline-flex h-[42px] min-w-[150px] items-center justify-center rounded-[12px] border border-[#DDE6F0] bg-white px-4 text-[14px] font-medium text-[#64748B] transition hover:bg-[#F8FAFD]"
          >
            {{ sortOrder === 'newest' ? 'Newest first' : 'Oldest first' }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div class="min-w-[1240px]">
          <div class="grid grid-cols-[1fr_1.05fr_0.9fr_1.55fr_0.9fr_1.2fr_1.2fr] border-b border-[#EDF2F7] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8B98AC]">
            <div>TIMESTAMP</div>
            <div>USER</div>
            <div>ROLE</div>
            <div>ACTION PERFORMED</div>
            <div>TICKET REF</div>
            <div>PREVIOUS VALUE</div>
            <div>NEW VALUE</div>
          </div>

          <div
              v-for="entry in filteredEntries"
              :key="entry.id"
              class="grid grid-cols-[1fr_1.05fr_0.9fr_1.55fr_0.9fr_1.2fr_1.2fr] items-center border-b border-[#F2F5F8] px-4 py-[13px] last:border-b-0"
          >
            <div class="pr-4">
              <p class="text-[13px] font-semibold text-[#66758A]">
                {{ entry.date }}
              </p>
              <p class="mt-0.5 text-[12px] font-medium text-[#A0ADBD]">
                {{ entry.time }}
              </p>
            </div>

            <div class="flex min-w-0 items-center gap-2.5 pr-4">
              <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8EDF5] text-[10px] font-semibold text-[#6E7B91]">
                {{ entry.initials }}
              </div>

              <p class="truncate text-[14px] font-medium text-[#4B5A6E]">
                {{ entry.user }}
              </p>
            </div>

            <div class="pr-4">
              <span
                  class="inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none"
                  :class="roleBadgeClass(entry.role)"
              >
                {{ entry.role }}
              </span>
            </div>

            <div class="truncate pr-4 text-[14px] font-semibold" :class="actionClass(entry.action)">
              {{ entry.action }}
            </div>

            <div class="pr-4">
              <span class="inline-flex rounded-[8px] bg-[#EAFBF8] px-2.5 py-1 text-[12px] font-semibold leading-none text-[#26A092]">
                {{ entry.ticketRef }}
              </span>
            </div>

            <div class="pr-4">
              <span
                  v-if="entry.previousValue !== '—'"
                  class="inline-flex rounded-[8px] px-2.5 py-1 text-[12px] font-semibold leading-none"
                  :class="valueBadgeClass(entry.previousValue)"
              >
                {{ entry.previousValue }}
              </span>

              <span
                  v-else
                  class="text-[13px] font-semibold text-[#B1BBC9]"
              >
                —
              </span>
            </div>

            <div class="pr-2">
              <span
                  v-if="entry.newValue !== '—'"
                  class="inline-flex max-w-full truncate rounded-[8px] px-2.5 py-1 text-[12px] font-semibold leading-none"
                  :class="valueBadgeClass(entry.newValue)"
              >
                {{ entry.newValue }}
              </span>

              <span
                  v-else
                  class="text-[13px] font-semibold text-[#B1BBC9]"
              >
                —
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-[#EDF2F7] px-4 py-3">
        <p class="text-[12px] font-medium text-[#9BA7B8]">
          Showing {{ filteredEntries.length }} of 12 entries · Log ID: EMAGIZ-AUDIT-2026
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