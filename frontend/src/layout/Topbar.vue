<script setup>
import {
  Search,
  ChevronDown,
  Bell,
  LogOut
} from 'lucide-vue-next'
</script>

<template>
  <header class="flex h-[58px] items-center justify-between border-b border-[#E7EDF5] bg-white px-[21px]">
    <div class="flex min-w-0 items-center gap-3">
      <div class="relative w-[314px]">
        <Search class="pointer-events-none absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#A4AEC0]" />

        <input
            type="text"
            placeholder="Search tickets, users..."
            class="h-[36px] w-full rounded-[10px] border border-[#DEE6F0] bg-[#F8FAFD] pl-10 pr-4 text-[13px] font-medium text-[#334155] outline-none placeholder:text-[#A7B0C2] focus:border-[#D7E1EE]"
        />
      </div>

      <button
          type="button"
          class="flex h-[36px] items-center gap-2 rounded-[10px] border border-[#DEE6F0] bg-[#F8FAFD] px-3 text-[13px] font-medium text-[#64748B]"
      >
        <span class="flex h-4 w-4 items-center justify-center rounded-full border border-[#9EDFD8]">
          <span class="h-[7px] w-[7px] rounded-full bg-[#19C2BB]" />
        </span>

        <span class="text-[#8B97AA]">Role:</span>
        <span class="text-[#556377]">Support</span>
        <ChevronDown class="h-[14px] w-[14px] text-[#98A3B6]" />
      </button>
    </div>

    <div class="flex items-center gap-3">
      <button
          type="button"
          class="relative flex h-8 w-8 items-center justify-center rounded-full text-[#97A3B6]"
          aria-label="Notifications"
      >
        <Bell class="h-[16px] w-[16px]" />
        <span class="absolute right-[7px] top-[6px] h-[6px] w-[6px] rounded-full bg-[#EF4444]" />
      </button>

      <div class="flex items-center gap-2.5">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#19C2BB] text-[11px] font-semibold text-white">
          EK
        </div>

        <div class="leading-[1.15]">
          <p class="text-[12.5px] font-semibold text-[#1F2937]">
            Elena Kowalski
          </p>
          <p class="mt-0.5 text-[12px] text-[#94A3B8]">
            e.kowalski@emagiz.com
          </p>
        </div>
      </div>

      <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full text-[#94A3B8]"
          aria-label="Log out"
      >
        <LogOut class="h-[15px] w-[15px]" />
      </button>
    </div>
  </header>
</template>