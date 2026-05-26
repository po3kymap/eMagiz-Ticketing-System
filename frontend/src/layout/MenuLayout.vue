<script setup>
import Sidebar from '@/layout/Sidebar.vue'
import Topbar from '@/layout/Topbar.vue'
</script>

<template>
  <div class="flex h-screen bg-slate-50">
    <Sidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <Topbar />

      <main class="min-h-0 flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>