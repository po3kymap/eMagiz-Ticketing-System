<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SupportSidebar from '@/components/sidebar/SupportSidebar.vue';
import TopNavigation from '@/components/topbar/TopNavigation.vue';
import { getCurrentUser, getTicketRouteForRole, logout } from '@api/auth';
import { searchTicketsForSupport } from '@api/tickets';


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

function supportSearch(query) {
  return searchTicketsForSupport(query);
}

function onTicketSelect(ticket) {
  if (!ticket?.id) {
    return;
  }
  router.push(getTicketRouteForRole(user.value?.role, ticket.id));
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <SupportSidebar
        :user-name="displayName"
        :user-email="userEmail"
        :user-initials="userInitials"
    />
    <div class="flex min-w-0 flex-1 flex-col">
      <TopNavigation
          :role="user?.role || 'Support'"
          :user-name="displayName"
          :user-email="userEmail"
          :user-initials="userInitials"
          :unread-notifications="unreadNotifications"
          :search-fn="supportSearch"
          @logout="onLogout"
          @ticket-select="onTicketSelect"
      />
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>