<script setup>
import {
  Zap,
  Ticket,
  Clock3,
  CircleCheck,
  CircleX,
  UserPlus,
  TriangleAlert,
  ChevronRight
} from 'lucide-vue-next'

const statCards = [
  {
    icon: Ticket,
    value: '3',
    label: 'New Tickets',
    hint: '+2 today',
    iconWrap: 'bg-[#EEF4FF] text-[#4B7BFF]',
    border: 'border-[#DCE7FB]',
    hintColor: 'text-[#4B7BFF]',
  },
  {
    icon: Clock3,
    value: '2',
    label: 'In Review',
    hint: 'Avg 4h',
    iconWrap: 'bg-[#FFF6E7] text-[#E8A11C]',
    border: 'border-[#F3E1B8]',
    hintColor: 'text-[#E39A15]',
  },
  {
    icon: CircleCheck,
    value: '1',
    label: 'Accepted',
    hint: 'SLA: 98%',
    iconWrap: 'bg-[#ECFBF2] text-[#33B26F]',
    border: 'border-[#D6F0E0]',
    hintColor: 'text-[#27A760]',
  },
  {
    icon: CircleX,
    value: '1',
    label: 'Denied',
    hint: '13% rate',
    iconWrap: 'bg-[#FFF1F1] text-[#E24B58]',
    border: 'border-[#F2D9DC]',
    hintColor: 'text-[#D84A55]',
  },
  {
    icon: UserPlus,
    value: '5',
    label: 'Unassigned',
    hint: 'Action needed',
    iconWrap: 'bg-[#FFF6EA] text-[#E58B1B]',
    border: 'border-[#F2E0CD]',
    hintColor: 'text-[#E67E16]',
  },
  {
    icon: TriangleAlert,
    value: '2',
    label: 'SLA Risk',
    hint: 'Escalate now',
    iconWrap: 'bg-[#FFF1F0] text-[#D9534F]',
    border: 'border-[#F1D8D5]',
    hintColor: 'text-[#DB4D45]',
  },
]

const queueItems = [
  {
    id: 'TKT-2047',
    title: 'API integration failure in produ...',
    company: 'Acme Corp',
    type: 'Incident',
    typeClass: 'bg-[#FFF2F2] text-[#DC5A61] ring-1 ring-inset ring-[#F2D8DA]',
    priority: 'Critical',
    priorityClass: 'bg-[#FBE8EA] text-[#D64A5B]',
    sla: 'At Risk',
    slaClass: 'bg-[#FFF4DB] text-[#E39A13]',
    owner: 'J. Smith',
  },
  {
    id: 'TKT-2046',
    title: 'Unexpected memory spike in i...',
    company: 'GlobalTech BV',
    type: 'Incident',
    typeClass: 'bg-[#FFF2F2] text-[#DC5A61] ring-1 ring-inset ring-[#F2D8DA]',
    priority: 'High',
    priorityClass: 'bg-[#FFF3E3] text-[#E68A16]',
    sla: 'Stable',
    slaClass: 'bg-[#ECFBF3] text-[#2FA364]',
    owner: 'E. Kowalski',
  },
  {
    id: 'TKT-2045',
    title: 'Request to add new SAP endp...',
    company: 'Sunrise Retail',
    type: 'RFC',
    typeClass: 'bg-[#EEF5FF] text-[#5A8EF2] ring-1 ring-inset ring-[#D9E7FA]',
    priority: 'Medium',
    priorityClass: 'bg-[#FFF9D9] text-[#C89D12]',
    sla: 'Stable',
    slaClass: 'bg-[#ECFBF3] text-[#2FA364]',
    owner: 'M. Janssen',
  },
  {
    id: 'TKT-2044',
    title: 'Logging issue after deployment',
    company: 'Delta Logistics',
    type: 'Incident',
    typeClass: 'bg-[#FFF2F2] text-[#DC5A61] ring-1 ring-inset ring-[#F2D8DA]',
    priority: 'Medium',
    priorityClass: 'bg-[#FFF9D9] text-[#C89D12]',
    sla: 'Monitor',
    slaClass: 'bg-[#EEF2FF] text-[#6F8FD8]',
    owner: 'A. Vermeer',
  },
  {
    id: 'TKT-2043',
    title: 'Performance degradation in cu...',
    company: 'Nexus Manufacturing',
    type: 'Incident',
    typeClass: 'bg-[#FFF2F2] text-[#DC5A61] ring-1 ring-inset ring-[#F2D8DA]',
    priority: 'High',
    priorityClass: 'bg-[#FFF3E3] text-[#E68A16]',
    sla: 'Stable',
    slaClass: 'bg-[#ECFBF3] text-[#2FA364]',
    owner: 'R. Brown',
  },
]

const assignmentItems = [
  {
    id: 'TKT-2046',
    title: 'Unexpected memory ...',
    company: 'GlobalTech BV',
    priority: 'High',
    priorityClass: 'bg-[#FFF2E5] text-[#E3891C]',
  },
  {
    id: 'TKT-2044',
    title: 'Logging issue after...',
    company: 'Delta Logistics',
    priority: 'Medium',
    priorityClass: 'bg-[#FFF9D9] text-[#C99C10]',
  },
  {
    id: 'TKT-2040',
    title: 'Scheduled job not ...',
    company: 'Sunrise Retail',
    priority: 'Medium',
    priorityClass: 'bg-[#FFF9D9] text-[#C99C10]',
  },
  {
    id: 'TKT-2039',
    title: 'TLS certificate expiry ...',
    company: 'Delta Logistics',
    priority: 'High',
    priorityClass: 'bg-[#FFF2E5] text-[#E3891C]',
  },
  {
    id: 'TKT-2038',
    title: 'Add retry mechanis...',
    company: 'Nexus Manufacturing',
    priority: 'Medium',
    priorityClass: 'bg-[#FFF9D9] text-[#C99C10]',
  },
]

const auditItems = [
  {
    text: 'Status Changed on TKT-2047',
    meta: 'James van der Berg · 16:10',
  },
  {
    text: 'Ticket Accepted on TKT-2045',
    meta: 'Elena Kowalski · 13:00',
  },
  {
    text: 'Priority Changed on TKT-2046',
    meta: 'Elena Kowalski · 11:30',
  },
  {
    text: 'Ticket Created on TKT-2046',
    meta: 'System · 18:20',
  },
]

const priorityBreakdown = [
  { label: 'Critical', value: 1, width: 'w-[16%]', color: 'bg-[#EF4444]' },
  { label: 'High', value: 4, width: 'w-[46%]', color: 'bg-[#F28C1B]' },
  { label: 'Medium', value: 5, width: 'w-[58%]', color: 'bg-[#E8B11B]' },
  { label: 'Low', value: 2, width: 'w-[24%]', color: 'bg-[#94A3B8]' },
]
</script>

<template>
  <div class="min-h-full bg-[#F7FAFC] px-5 py-5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-[22px] font-semibold leading-none tracking-[-0.02em] text-[#1E293B]">
          Support Command Center
        </h1>
        <p class="mt-2 text-[13px] font-medium text-[#7C8AA5]">
          Full administrative access · Tue, May 5 2026 · 09:42 CEST
        </p>
      </div>

      <button
          type="button"
          class="inline-flex h-11 items-center gap-2 rounded-[14px] bg-[#0FA99D] px-5 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(15,169,157,0.18)] transition hover:bg-[#0C9B90]"
      >
        <Zap class="h-4 w-4" />
        <span>Open Triage Board</span>
      </button>
    </div>

    <div class="mt-6 grid grid-cols-6 gap-4">
      <div
          v-for="card in statCards"
          :key="card.label"
          class="rounded-[18px] border bg-white px-4 py-4"
          :class="card.border"
      >
        <div
            class="flex h-8 w-8 items-center justify-center rounded-[10px]"
            :class="card.iconWrap"
        >
          <component :is="card.icon" class="h-4 w-4" />
        </div>

        <div class="mt-5 text-[16px] font-semibold text-[#111827]">
          {{ card.value }}
        </div>
        <div class="mt-1 text-[13px] font-medium text-[#7F8CA3]">
          {{ card.label }}
        </div>
        <div class="mt-1 text-[13px] font-semibold" :class="card.hintColor">
          {{ card.hint }}
        </div>
      </div>
    </div>

    <div class="mt-5 grid grid-cols-[minmax(0,1fr)_210px] gap-4">
      <div class="rounded-[18px] border border-[#E8EDF4] bg-white overflow-hidden">
        <div class="flex items-center justify-between border-b border-[#EEF2F7] px-4 py-4">
          <div class="flex items-center gap-3">
            <h2 class="text-[16px] font-semibold text-[#243248]">
              Central Triage Queue
            </h2>
            <span class="rounded-full bg-[#FFE8EA] px-2.5 py-1 text-[11px] font-semibold leading-none text-[#D9545C]">
              5 unassigned
            </span>
          </div>

          <button
              type="button"
              class="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0FA99D]"
          >
            <span>Full view</span>
            <ChevronRight class="h-3.5 w-3.5" />
          </button>
        </div>

        <div class="grid grid-cols-[78px_minmax(0,1.9fr)_112px_108px_90px_82px] border-b border-[#EEF2F7] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#8C99AE]">
          <div>ID</div>
          <div>TITLE</div>
          <div>TYPE</div>
          <div>PRIORITY</div>
          <div>SLA</div>
          <div>OWNER</div>
        </div>

        <div
            v-for="item in queueItems"
            :key="item.id"
            class="grid grid-cols-[78px_minmax(0,1.9fr)_112px_108px_90px_82px] items-center border-b border-[#F2F5F9] px-4 py-4 last:border-b-0"
        >
          <div>
            <p class="text-[12px] font-semibold text-[#7B8AA2]">
              {{ item.id }}
            </p>
          </div>

          <div class="min-w-0">
            <p class="truncate text-[14px] font-semibold text-[#2D3748]">
              {{ item.title }}
            </p>
            <p class="mt-1 truncate text-[13px] text-[#9AA7B8]">
              {{ item.company }}
            </p>
          </div>

          <div>
            <span class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none" :class="item.typeClass">
              {{ item.type }}
            </span>
          </div>

          <div>
            <span class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none" :class="item.priorityClass">
              {{ item.priority }}
            </span>
          </div>

          <div>
            <span class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none" :class="item.slaClass">
              {{ item.sla }}
            </span>
          </div>

          <div class="text-[12px] font-medium text-[#8292A8]">
            {{ item.owner }}
          </div>
        </div>
      </div>

      <div class="rounded-[18px] border border-[#F0DADB] bg-white p-0 overflow-hidden">
        <div class="flex items-center justify-between border-b border-[#F7E7E7] px-4 py-4">
          <div class="flex items-center gap-2">
            <UserPlus class="h-4 w-4 text-[#D55356]" />
            <h3 class="text-[15px] font-semibold text-[#C14547]">
              Needs Assignment (5)
            </h3>
          </div>

          <button
              type="button"
              class="text-[12px] font-semibold text-[#D55356]"
          >
            Triage →
          </button>
        </div>

        <div class="space-y-0">
          <div
              v-for="item in assignmentItems"
              :key="item.id"
              class="border-b border-[#F6F0F0] px-4 py-4 last:border-b-0"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[12px] font-semibold text-[#97A5B7]">
                  {{ item.id }}
                </p>
                <p class="mt-1 truncate text-[14px] font-semibold text-[#39465A]">
                  {{ item.title }}
                </p>
                <p class="mt-1 truncate text-[13px] text-[#A1AEBE]">
                  {{ item.company }}
                </p>
              </div>

              <span class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none" :class="item.priorityClass">
                {{ item.priority }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 grid grid-cols-[214px_214px_minmax(0,1fr)] gap-4">
      <div class="rounded-[18px] border border-[#E8EDF4] bg-white px-4 py-4">
        <h3 class="text-[15px] font-semibold text-[#445066]">
          Tickets by Type
        </h3>

        <div class="mt-5 flex justify-center">
          <div class="relative h-[118px] w-[118px] rounded-full bg-[conic-gradient(#EF4444_0deg_250deg,#4F83FF_250deg_330deg,#8B5CF6_330deg_360deg)]">
            <div class="absolute left-1/2 top-1/2 h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </div>
        </div>

        <div class="mt-5 space-y-2 text-[12px]">
          <div class="flex items-center gap-2 text-[#6D7B91]">
            <span class="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
            <span>Incident (8)</span>
          </div>
          <div class="flex items-center gap-2 text-[#6D7B91]">
            <span class="h-2.5 w-2.5 rounded-full bg-[#4F83FF]" />
            <span>RFC (3)</span>
          </div>
          <div class="flex items-center gap-2 text-[#6D7B91]">
            <span class="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
            <span>Internal (1)</span>
          </div>
        </div>
      </div>

      <div class="rounded-[18px] border border-[#E8EDF4] bg-white px-4 py-4">
        <h3 class="text-[15px] font-semibold text-[#445066]">
          Priority Breakdown
        </h3>

        <div class="mt-4 space-y-3">
          <div
              v-for="item in priorityBreakdown"
              :key="item.label"
              class="grid grid-cols-[44px_minmax(0,1fr)_16px] items-center gap-3"
          >
            <span class="text-[13px] font-medium text-[#7F8CA3]">
              {{ item.label }}
            </span>

            <div class="h-2 rounded-full bg-[#EDF2F7]">
              <div class="h-2 rounded-full" :class="[item.color, item.width]" />
            </div>

            <span class="text-right text-[13px] font-semibold text-[#6A768D]">
              {{ item.value }}
            </span>
          </div>
        </div>
      </div>

      <div class="rounded-[18px] border border-[#E8EDF4] bg-white px-4 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-[15px] font-semibold text-[#445066]">
            Recent Audit Actions
          </h3>

          <button
              type="button"
              class="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0FA99D]"
          >
            <span>Full log</span>
            <ChevronRight class="h-3.5 w-3.5" />
          </button>
        </div>

        <div class="mt-4 space-y-4">
          <div
              v-for="item in auditItems"
              :key="item.text"
              class="flex gap-3"
          >
            <span class="mt-1.5 h-2 w-2 rounded-full bg-[#18B8AF]" />
            <div>
              <p class="text-[13px] font-medium text-[#4A5568]">
                {{ item.text }}
              </p>
              <p class="mt-1 text-[12px] text-[#9AA7B8]">
                {{ item.meta }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 rounded-[18px] border border-[#E8EDF4] bg-white px-4 py-4">
      <div class="flex items-center justify-between">
        <h3 class="text-[15px] font-semibold text-[#445066]">
          Ticket Trend (5 days)
        </h3>

        <div class="flex items-center gap-4 text-[12px]">
          <div class="flex items-center gap-1.5 text-[#6A7A92]">
            <span class="h-[2px] w-3 rounded-full bg-[#4F83FF]" />
            <span>New</span>
          </div>
          <div class="flex items-center gap-1.5 text-[#6A7A92]">
            <span class="h-[2px] w-3 rounded-full bg-[#16B4A9]" />
            <span>Resolved</span>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <svg viewBox="0 0 760 120" class="h-[84px] w-full">
          <path
              d="M20 68 C 100 84, 165 95, 235 78 S 360 34, 455 55 S 610 78, 740 28"
              fill="none"
              stroke="#16B4A9"
              stroke-width="2.5"
              stroke-linecap="round"
          />
        </svg>

        <div class="mt-1 grid grid-cols-4 px-2 text-center text-[11px] font-medium text-[#9AA7B8]">
          <span>Apr 29</span>
          <span>Apr 30</span>
          <span>May 1</span>
          <span>May 2</span>
        </div>
      </div>
    </div>
  </div>
</template>