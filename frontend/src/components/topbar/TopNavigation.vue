<script setup>
import { useRouter } from 'vue-router';
import NotificationBell from '@/components/topbar/NotificationBell.vue';
import UserProfileChip from '@/components/topbar/UserProfileChip.vue';
import TopbarSearch from '@/components/topbar/TopbarSearch.vue';
import { getTicketRouteForRole } from '@api/auth';
import { useActivityNotifications } from '@js/composables/useActivityNotifications';

const props = defineProps({
  role: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, default: '' },
  userInitials: { type: String, required: true },
  searchFn: { type: Function, default: null },
});

defineEmits(['logout', 'ticket-select']);

const router = useRouter();

const {
  items,
  unreadCount,
  isLoading,
  isOpen,
  error,
  openPanel,
  closePanel,
  markAllRead,
} = useActivityNotifications();

function onToggleNotifications(forceState) {
  if (forceState === false) {
    closePanel();
    return;
  }
  if (isOpen.value) {
    closePanel();
  } else {
    openPanel();
  }
}

function onNotificationSelect(item) {
  if (!item?.ticketId) {
    return;
  }
  closePanel();
  router.push(getTicketRouteForRole(props.role, item.ticketId));
}
</script>

<template>
  <header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 backdrop-blur-sm px-4 sm:px-6">

    <div v-if="searchFn" class="flex min-w-0 flex-1">
      <TopbarSearch :search-fn="searchFn" @select="$emit('ticket-select', $event)" />
    </div>

    <div class="flex shrink-0 items-center gap-2">
      <NotificationBell
          :unread-count="unreadCount"
          :items="items"
          :is-open="isOpen"
          :is-loading="isLoading"
          :error="error"
          @toggle="onToggleNotifications"
          @select="onNotificationSelect"
          @mark-all-read="markAllRead"
      />
      <UserProfileChip
      :name="userName"
      :email="userEmail"
      :initials="userInitials"
      @logout="$emit('logout')"
      />
    </div>
  </header>
</template>
