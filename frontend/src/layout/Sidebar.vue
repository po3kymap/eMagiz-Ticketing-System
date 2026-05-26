<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  List,
  ClipboardList,
  Users,
  FileText,
  Settings,
  ChevronLeft
} from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Ticket Queue',
    to: '/ticket-queue',
    icon: List,
    badge: 4,
  },
  {
    label: 'Triage Board',
    to: '/triage-board',
    icon: ClipboardList,
  },
  {
    label: 'Users',
    to: '/users',
    icon: Users,
  },
  {
    label: 'Audit Log',
    to: '/audit-log',
    icon: FileText,
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: Settings,
  },
]

const isActive = (to) => route.path === to

const sidebarClasses = computed(() => [
  'flex h-screen w-[240px] flex-col overflow-hidden border-r border-[#17305B] bg-[#071633] text-white'
])
</script>

<template>
  <aside :class="sidebarClasses">
    <div class="flex h-[58px] items-center justify-between border-b border-[#17305B] px-4">
      <div class="flex items-center">
        <img
            src="/img/loginLogo.png"
            alt="eMagiz Tickets logo"
            class="h-12 w-auto object-contain"
        />
      </div>

      <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-md text-[#A9B7D3] transition hover:bg-white/5 hover:text-white"
          aria-label="Collapse sidebar"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
    </div>

    <div class="px-3 pt-14">
      <p class="mb-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#1CC8C0]">
        Support — Admin
      </p>

      <nav class="space-y-1.5">
        <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="group flex h-11 items-center justify-between rounded-[14px] px-3 transition"
            :class="
            isActive(item.to)
              ? 'border border-[#2E8B89] bg-[#0D615E]/20 text-[#22C7BE] shadow-[inset_0_0_0_1px_rgba(34,199,190,0.08)]'
              : 'border border-transparent text-[#D5DEEE] hover:bg-white/5 hover:text-white'
          "
        >
          <div class="flex min-w-0 items-center gap-3">
            <component
                :is="item.icon"
                class="h-[15px] w-[15px] shrink-0"
                :class="isActive(item.to) ? 'text-[#22C7BE]' : 'text-[#A8B5CF]'"
            />

            <span class="truncate text-[15px] font-medium">
              {{ item.label }}
            </span>
          </div>

          <span
              v-if="item.badge"
              class="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#11C5BC] px-1.5 text-[11px] font-semibold leading-none text-white"
          >
            {{ item.badge }}
          </span>
        </RouterLink>
      </nav>
    </div>

    <div class="mt-auto border-t border-[#17305B] px-3 py-3">
      <button
          type="button"
          class="flex w-full items-center gap-3 rounded-[14px] px-2 py-2 text-left transition hover:bg-white/5"
      >
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#19C2BB] text-[11px] font-semibold text-white">
          EK
        </div>

        <div class="min-w-0">
          <p class="truncate text-[13px] font-semibold leading-4 text-white">
            Elena Kowalski
          </p>
          <p class="truncate text-[12px] leading-4 text-[#8FA2C5]">
            e.kowalski@emagiz.com
          </p>
        </div>
      </button>
    </div>
  </aside>
</template>