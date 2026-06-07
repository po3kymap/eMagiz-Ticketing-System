<script setup>
defineProps({
  item: Object,
  collapsed: Boolean
})
</script>

<template>
  <router-link
      :to="item.route"
      active-class="bg-teal-900/60 text-teal-400"
      class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all duration-150"
      :class="collapsed ? 'justify-center' : ''"
      :title="collapsed ? item.label : ''"
  >
    <component :is="item.icon" class="w-4 h-4 shrink-0" />
    <span v-if="!collapsed" class="text-sm font-medium flex-1">{{ item.label }}</span>
  </router-link>
</template>