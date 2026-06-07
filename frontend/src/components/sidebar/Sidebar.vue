<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCurrentUser } from '@/js/api/auth'
import { ButtonsByRoles } from '@js/sidebar/ButtonsByRoles.js'
import Button from '@/components/sidebar/Button.vue'

const user = ref(null)
const collapsed = ref(false)

onMounted(async () => {
  user.value = await getCurrentUser()
})

const nav = computed(() => {
  if (!user.value) return []
  return ButtonsByRoles[user.value.role] ?? []
})

const sectionLabel = computed(() => {
  switch (user.value?.role) {
    case 'Customer':   return 'CUSTOMER PORTAL'
    case 'Consultant': return 'CONSULTANT VIEW'
    case 'Support':    return 'SUPPORT — ADMIN'
    default:           return ''
  }
})
</script>

<template>
  <aside
      class="min-h-screen flex flex-col px-3 py-5 gap-1 transition-all duration-300"
      :class="collapsed ? 'w-16' : 'w-59'"
      style="background-color: #0d1a2d;"
  >
    <div class="flex items-center justify-between px-2 mb-4">
      <div v-if="!collapsed" class="flex items-center gap-2">
        <div v-if="!collapsed" class="flex items-center gap-2">
          <img src="/img/logo.png" alt="eMagiz" class="h-12 w-auto" style="filter: drop-shadow(0 0 6px rgba(255,255,255,0.5));" />
        </div>
      </div>
      <button class="text-slate-500 hover:text-slate-300 transition-colors shrink-0 ml-auto" @click="collapsed = !collapsed">
        <svg class="w-4 h-4 transition-transform duration-300" :class="collapsed ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
    </div>

    <span v-if="!collapsed" class="text-xs font-bold tracking-widest px-2 pb-2 uppercase" style="color: #2596be;">
            {{ sectionLabel }}
        </span>

    <Button
        v-for="item in nav"
        :key="item.id"
        :item="item"
        :collapsed="collapsed"
    />
  </aside>
</template>