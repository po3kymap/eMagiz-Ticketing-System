<script setup>
import { ref } from 'vue'
import {
  SlidersHorizontal,
  ArrowUpDown,
  Eye,
  Check,
  X,
  UserPlus,
  MessageSquare,
  ChevronDown
} from 'lucide-vue-next'

const pageTitle = 'Triage & Assignment Board'
const pageDescription = 'Review, approve, and assign incoming tickets'

const columns = [
  { id: 'new', label: 'New', color: '#2563EB', bg: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]' },
  { id: 'review', label: 'Under Review', color: '#D97706', bg: 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]' },
  { id: 'accepted', label: 'Accepted', color: '#10B981', bg: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' },
  { id: 'denied', label: 'Denied', color: '#EF4444', bg: 'bg-[#FEF2F2] border-[#FEE2E2] text-[#991B1B]' },
  { id: 'assignment', label: 'Needs Assignment', color: '#6366F1', bg: 'bg-[#EEF2FF] border-[#C7D2FE] text-[#3730A3]' },
]

const tickets = ref([
  {
    id: 'TKT-2044',
    title: 'Logging issue after deployment',
    customer: 'Delta Logistics',
    type: 'Incident',
    priority: 'Medium',
    status: 'new',
    date: '30 Apr'
  },
  {
    id: 'TKT-2040',
    title: 'Scheduled job not executing at defined interval',
    customer: 'Sunrise Retail',
    type: 'Incident',
    priority: 'Medium',
    status: 'new',
    date: '02 May'
  },
  {
    id: 'TKT-2039',
    title: 'TLS certificate expiry warning across validation node',
    customer: 'Delta Logistics',
    type: 'Incident',
    priority: 'High',
    status: 'new',
    date: '02 May'
  },
  {
    id: 'TKT-2046',
    title: 'Unexpected memory spike in integration flow',
    customer: 'GlobalTech BV',
    type: 'Incident',
    priority: 'High',
    status: 'review',
    date: '01 May'
  },
  {
    id: 'TKT-2038',
    title: 'Add retry mechanism to outbound HTTP connector',
    customer: 'Nexus Manufacturing',
    type: 'RFC',
    priority: 'Medium',
    status: 'review',
    date: '26 Apr'
  },
  {
    id: 'TKT-2045',
    title: 'Request to add new SAP endpoint',
    customer: 'Sunrise Retail',
    type: 'RFC',
    priority: 'Medium',
    status: 'accepted',
    date: '29 Apr'
  },
  {
    id: 'TKT-2041',
    title: 'Request to update authentication flow to OAuth2',
    customer: 'GlobalTech BV',
    type: 'RFC',
    priority: 'Low',
    status: 'denied',
    date: '22 Apr'
  },
  {
    id: 'TKT-2047',
    title: 'API integration failure in production',
    customer: 'Acme Corp',
    type: 'Incident',
    priority: 'Critical',
    status: 'assignment',
    date: '01 May'
  },
  {
    id: 'TKT-2043',
    title: 'Performance degradation in customer environment',
    customer: 'Nexus Manufacturing',
    type: 'Incident',
    priority: 'High',
    status: 'assignment',
    date: '28 Apr'
  }
])

const badgeMap = {
  type: {
    Incident: 'bg-[#FFF2F2] text-[#DC5A61] ring-1 ring-[#F2D8DA]',
    RFC: 'bg-[#EEF5FF] text-[#5A8EF2] ring-1 ring-[#D9E7FA]',
  },
  priority: {
    Critical: 'bg-[#FBE8EA] text-[#D64A5B] ring-1 ring-[#F0D2D7]',
    High: 'bg-[#FFF3E3] text-[#E68A16] ring-1 ring-[#F6DEC2]',
    Medium: 'bg-[#FFF9D9] text-[#C89D12] ring-1 ring-[#EFE1A6]',
    Low: 'bg-[#EEF2F7] text-[#94A3B8] ring-1 ring-[#DFE7F0]',
  }
}

const getTicketsByStatus = (statusId) => {
  return tickets.value.filter(t => t.status === statusId)
}
</script>

<template>
  <div class="min-h-screen bg-[#F6F8FB] px-8 py-6 flex flex-col select-none">

    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-[24px] font-bold tracking-[-0.02em] text-[#111827]">
          {{ pageTitle }}
        </h1>
        <p class="mt-1 text-[14px] font-medium text-[#6B7280]">
          {{ pageDescription }}
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
            type="button"
            class="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3.5 text-[13px] font-semibold text-[#4B5563] transition hover:bg-[#F9FAFB]"
        >
          <SlidersHorizontal class="h-3.5 w-3.5 text-[#6B7280]" />
          <span>Filter by Priority</span>
        </button>

        <button
            type="button"
            class="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3.5 text-[13px] font-semibold text-[#4B5563] transition hover:bg-[#F9FAFB]"
        >
          <ArrowUpDown class="h-3.5 w-3.5 text-[#6B7280]" />
          <span>Sort by Date</span>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-x-auto pb-4 custom-scrollbar">
      <div class="inline-flex gap-4 items-start min-w-full">

        <div
            v-for="column in columns"
            :key="column.id"
            class="w-[310px] shrink-0 flex flex-col max-h-[calc(100vh-160px)]"
        >

          <div
              class="flex items-center justify-between h-10 px-4 rounded-[12px] border mb-3 font-semibold text-[13px]"
              :class="column.bg"
          >
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: column.color }" />
              <span>{{ column.label }}</span>
            </div>
            <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold border shadow-sm">
              {{ getTicketsByStatus(column.id).length }}
            </span>
          </div>

          <div class="space-y-3 overflow-y-auto pr-1 flex-1 pb-4 card-stack-scrollbar">
            <div
                v-for="ticket in getTicketsByStatus(column.id)"
                :key="ticket.id"
                class="bg-white border border-[#E5E7EB] rounded-[16px] p-4 shadow-sm hover:shadow-md transition flex flex-col gap-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-[12px] font-medium text-[#9CA3AF] tracking-wide">
                  {{ ticket.id }}
                </span>

                <div class="flex gap-1.5">
                  <span :class="['inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold leading-none', badgeMap.type[ticket.type]]">
                    {{ ticket.type }}
                  </span>
                  <span :class="['inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold leading-none', badgeMap.priority[ticket.priority]]">
                    {{ ticket.priority }}
                  </span>
                </div>
              </div>

              <h3 class="text-[14px] font-semibold text-[#1F2937] leading-[1.35] tracking-tight">
                {{ ticket.title }}
              </h3>

              <div class="text-[12px] text-[#6B7280] font-medium flex items-center gap-1.5">
                <span class="text-[#4B5563] font-semibold">{{ ticket.customer }}</span>
                <span class="text-[#D1D5DB]">•</span>
                <span>{{ ticket.date }}</span>
              </div>

              <div class="flex items-center justify-between pt-1 border-t border-[#F3F4F6] mt-1">
                <div class="flex flex-wrap gap-1.5">

                  <button type="button" class="inline-flex h-7 items-center gap-1 rounded-[6px] border border-[#E5E7EB] bg-white px-2.5 text-[12px] font-semibold text-[#4B5563] hover:bg-[#F9FAFB]">
                    <Eye class="h-3.5 w-3.5 text-[#9CA3AF]" />
                    <span>View</span>
                  </button>

                  <template v-if="column.id === 'new' || column.id === 'review'">
                    <button type="button" class="inline-flex h-7 items-center gap-1 rounded-[6px] border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 text-[12px] font-semibold text-[#065F46] hover:bg-[#D1FAE5]">
                      <Check class="h-3.5 w-3.5" />
                      <span>Accept</span>
                    </button>
                    <button type="button" class="inline-flex h-7 items-center gap-1 rounded-[6px] border border-[#FCA5A5] bg-[#FEF2F2] px-2.5 text-[12px] font-semibold text-[#991B1B] hover:bg-[#FEE2E2]">
                      <X class="h-3.5 w-3.5" />
                      <span>Deny</span>
                    </button>
                  </template>

                  <template v-if="column.id === 'accepted' || column.id === 'assignment'">
                    <button type="button" class="inline-flex h-7 items-center gap-1 rounded-[6px] border border-[#C7D2FE] bg-[#EEF2FF] px-2.5 text-[12px] font-semibold text-[#3730A3] hover:bg-[#E0E7FF]">
                      <UserPlus class="h-3.5 w-3.5" />
                      <span>Assign</span>
                    </button>
                  </template>

                  <button type="button" class="inline-flex h-7 items-center gap-1 rounded-[6px] border border-[#E5E7EB] bg-white px-2.5 text-[12px] font-semibold text-[#4B5563] hover:bg-[#F9FAFB]">
                    <MessageSquare class="h-3.5 w-3.5 text-[#9CA3AF]" />
                    <span>Note</span>
                  </button>
                </div>

                <button type="button" class="text-[#9CA3AF] hover:text-[#4B5563] p-0.5 transition">
                  <ChevronDown class="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #94A3B8;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748B;
}

.card-stack-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.card-stack-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.card-stack-scrollbar::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 4px;
}
.card-stack-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}
</style>