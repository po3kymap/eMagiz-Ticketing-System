<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout } from '@api/auth'
import TopNavigation from '@/components/topbar/TopNavigation.vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'
const router = useRouter()
const user = ref(null)

onMounted(async () => {
  user.value = await getCurrentUser()
})

const displayName = computed(() => {
  if (!user.value) return 'User'
  const u = user.value.username ?? 'User'
  return u.charAt(0).toUpperCase() + u.slice(1)
})
const userEmail = computed(() => user.value?.email ?? '')
const userInitials = computed(() => (user.value?.username ?? 'U').slice(0, 2).toUpperCase())

function onLogout() {
  logout()
  router.replace('/login')
}
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex flex-1 flex-col">
      <TopNavigation
          :role="user?.role || ''"
          :user-name="displayName"
          :user-email="userEmail"
          :user-initials="userInitials"
          @logout="onLogout"
      />
      <main class="flex-1 overflow-y-auto bg-slate-50">
        <slot />
      </main>
    </div>
  </div>
</template>