<script setup>
import { ref, computed } from 'vue'
import {
  Search,
  Download,
  Plus,
  Pencil,
  ShieldCheck
} from 'lucide-vue-next'

const activeTab = ref('All Users')
const searchQuery = ref('')

const tabs = [
  { label: 'All Users', count: 10 },
  { label: 'Customers', count: 5 },
  { label: 'Consultants', count: 3 },
  { label: 'Support', count: 2 },
]

const stats = [
  { label: 'Total Users', count: 10, bg: 'bg-white border-[#E4EAF2]' },
  { label: 'Customers', count: 5, bg: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]' },
  { label: 'Consultants', count: 3, bg: 'bg-[#F5F3FF] border-[#DDD6FE] text-[#6D28D9]' },
  { label: 'Support Staff', count: 2, bg: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]' },
]

const users = ref([
  { id: 'u1', name: 'Sarah Mitchell', initials: 'SM', email: 's.mitchell@acmecorp.com', organization: 'Acme Corp', role: 'Customer', status: 'Active', lastLogin: '02/05/2025, 10:00' },
  { id: 'u2', name: 'Tom Eriksen', initials: 'TE', email: 't.eriksen@globaltech.nl', organization: 'GlobalTech BV', role: 'Customer', status: 'Active', lastLogin: '01/05/2025, 16:30' },
  { id: 'u3', name: 'Priya Sharma', initials: 'PS', email: 'p.sharma@sunriseretail.com', organization: 'Sunrise Retail', role: 'Customer', status: 'Active', lastLogin: '28/04/2025, 12:00' },
  { id: 'u5', name: 'Anna Smits', initials: 'AS', email: 'a.smits@nexusmfg.com', organization: 'Nexus Manufacturing', role: 'Customer', status: 'Pending', lastLogin: 'Never logged in' },
  { id: 'u6', name: 'James van der Berg', initials: 'JV', email: 'j.vanderberg@emagiz.com', organization: 'eMagiz', role: 'Consultant', status: 'Active', lastLogin: '02/05/2025, 09:45' },
  { id: 'u7', name: 'Lara Nkemdirim', initials: 'LN', email: 'l.nkemdirim@emagiz.com', organization: 'eMagiz', role: 'Consultant', status: 'Active', lastLogin: '02/05/2025, 11:00' },
  { id: 'u8', name: 'David Osei', initials: 'DO', email: 'd.osei@emagiz.com', organization: 'eMagiz', role: 'Consultant', status: 'Active', lastLogin: '01/05/2025, 18:00' },
  { id: 'u9', name: 'Elena Kowalski', initials: 'EK', email: 'e.kowalski@emagiz.com', organization: 'eMagiz', role: 'Support', status: 'Active', lastLogin: '02/05/2025, 10:30' },
  { id: 'u10', name: 'Marcus Brandt', initials: 'MB', email: 'm.brandt@emagiz.com', organization: 'eMagiz', role: 'Support', status: 'Active', lastLogin: '01/05/2025, 20:00' }
])

const roleBadgeClass = (role) => {
  if (role === 'Customer') return 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]'
  if (role === 'Consultant') return 'bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]'
  return 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
}

const statusBadgeClass = (status) => {
  if (status === 'Active') return 'text-[#10B981]'
  if (status === 'Pending') return 'text-[#F59E0B]'
  return 'text-[#9CA3AF]'
}

const statusDotClass = (status) => {
  if (status === 'Active') return 'bg-[#10B981]'
  if (status === 'Pending') return 'bg-[#F59E0B]'
  return 'bg-[#9CA3AF]'
}

const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return users.value.filter((user) => {
    const matchesSearch = !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.organization.toLowerCase().includes(query)

    let matchesTab = true
    if (activeTab.value === 'Customers') matchesTab = user.role === 'Customer'
    if (activeTab.value === 'Consultants') matchesTab = user.role === 'Consultant'
    if (activeTab.value === 'Support') matchesTab = user.role === 'Support'

    return matchesSearch && matchesTab
  })
})
</script>

<template>
  <div class="min-h-screen bg-[#F6F8FB] px-8 py-6">

    <div class="flex items-start justify-between gap-4 mb-6">
      <div>
        <!-- [code] Контейнер заголовка изменен на flex для выравнивания щита в одну линию -->
        <div class="flex items-center gap-2.5">
          <ShieldCheck class="h-6 w-6 text-[#0FA99D]" />
          <h1 class="text-[24px] font-bold tracking-[-0.02em] text-[#111827]">
            Users
          </h1>
        </div>
        <p class="mt-1 text-[14px] font-medium text-[#6B7280]">
          Manage user accounts and roles
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
          <span>Add User</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 mb-6">
      <div
          v-for="stat in stats"
          :key="stat.label"
          class="border rounded-[16px] p-5 bg-white shadow-sm flex flex-col justify-between h-[104px]"
          :class="stat.bg ? stat.bg.split(' ')[1] + ' ' + stat.bg.split(' ')[2] : ''"
      >
        <span class="text-[32px] font-bold leading-none tracking-tight">
          {{ stat.count }}
        </span>
        <span class="text-[13px] font-semibold text-[#6B7280]">
          {{ stat.label }}
        </span>
      </div>
    </div>

    <div class="rounded-[18px] border border-[#E4EAF2] bg-white overflow-hidden shadow-sm">

      <div class="border-b border-[#EDF2F7] px-4 py-3">
        <div class="relative w-full">
          <Search class="pointer-events-none absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#A6B0C2]" />
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, email, or organization..."
              class="h-[42px] w-full rounded-[12px] border border-[#DDE6F0] bg-[#F9FBFD] pl-11 pr-4 text-[14px] font-medium text-[#334155] outline-none placeholder:text-[#A7B0C2] focus:border-[#D7E1EE]"
          />
        </div>
      </div>

      <div class="border-b border-[#EDF2F7] px-4">
        <div class="flex items-center gap-6">
          <button
              v-for="tab in tabs"
              :key="tab.label"
              type="button"
              @click="activeTab = tab.label"
              class="relative h-[44px] text-[13px] font-semibold transition flex items-center gap-1.5"
              :class="activeTab === tab.label ? 'text-[#159C93]' : 'text-[#6F7E95] hover:text-[#334155]'"
          >
            <span>{{ tab.label }}</span>
            <span class="text-[12px] font-medium text-[#A6B0C2]">({{ tab.count }})</span>
            <span
                v-if="activeTab === tab.label"
                class="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-[#159C93]"
            />
          </button>
        </div>
      </div>

      <div class="w-full">
        <div class="grid grid-cols-[1.2fr_1.5fr_1.2fr_0.8fr_0.8fr_1.2fr_0.3fr] border-b border-[#EDF2F7] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8B98AC]">
          <div>User</div>
          <div>Email</div>
          <div>Organization</div>
          <div>Role</div>
          <div>Status</div>
          <div>Last Login</div>
          <div class="text-right">Actions</div>
        </div>

        <div class="divide-y divide-[#F2F5F8]">
          <div
              v-for="user in filteredUsers"
              :key="user.id"
              class="grid grid-cols-[1.2fr_1.5fr_1.2fr_0.8fr_0.8fr_1.2fr_0.3fr] items-center px-6 py-3.5 text-[14px]"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[12px] font-bold text-white">
                {{ user.initials }}
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-[#111827] truncate">{{ user.name }}</p>
                <p class="text-[11px] font-medium text-[#9CA3AF]">ID: {{ user.id }}</p>
              </div>
            </div>

            <div class="text-[#4B5563] font-medium truncate pr-4">
              {{ user.email }}
            </div>

            <div class="text-[#4B5563] font-medium truncate pr-4">
              {{ user.organization }}
            </div>

            <div>
              <span :class="['inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-medium', roleBadgeClass(user.role)]">
                {{ user.role }}
              </span>
            </div>

            <div class="flex items-center gap-1.5 font-semibold text-[13px]" :class="statusBadgeClass(user.status)">
              <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(user.status)" />
              <span>{{ user.status }}</span>
            </div>

            <div class="text-[#6B7280] font-medium">
              {{ user.lastLogin }}
            </div>

            <div class="text-right">
              <button type="button" class="text-[#9CA3AF] hover:text-[#4B5563] p-1 transition">
                <Pencil class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-[#EDF2F7] px-6 py-3.5 bg-[#FBFCFE]">
        <p class="text-[12px] font-medium text-[#9BA7B8]">
          Showing {{ filteredUsers.length }} users
        </p>

        <div class="flex items-center gap-4 text-[12px] font-medium text-[#97A3B6]">
          <div class="flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-[#10B981]" />
            <span>Active</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-[#F59E0B]" />
            <span>Pending</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-[#9CA3AF]" />
            <span>Inactive</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>