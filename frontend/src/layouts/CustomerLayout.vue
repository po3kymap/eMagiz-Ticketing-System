<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CustomerSidebar from '@/components/sidebar/CustomerSidebar.vue';
import TopNavigation from '@/components/topbar/TopNavigation.vue';
import { getCurrentUser, logout } from '@api/auth';
import { searchMyTickets } from '@api/tickets';


const router = useRouter();
const user = ref(null);
const unreadNotifications = ref(1);

onMounted(async () => {
  user.value = await getCurrentUser();
});

const displayName = computed(() => {
  if (!user.value?.username) return 'User';
  const name = user.value.username;
  return name.charAt(0).toUpperCase() + name.slice(1);
});

const userEmail = computed(() => user.value?.email || '');
const userInitials = computed(() => {
  const source = user.value?.username || 'U';
  return source.slice(0, 2).toUpperCase();
});

function onLogout() {
  logout();
  router.replace('/login');
}

function customerSearch(query) {
  return searchMyTickets(query); 
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <CustomerSidebar
        :user-name="displayName"
        :user-email="userEmail"
        :user-initials="userInitials"
    />
    <div class="flex min-w-0 flex-1 flex-col">
      <TopNavigation
          :role="user?.role || 'Customer'"
          :user-name="displayName"
          :user-email="userEmail"
          :user-initials="userInitials"
          :unread-notifications="unreadNotifications"
          :search-fn="customerSearch"
          @logout="onLogout"
      />
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>