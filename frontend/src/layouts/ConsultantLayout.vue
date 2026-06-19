<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ConsultantSidebar from '@/components/sidebar/ConsultantSidebar.vue';
import TopNavigation from '@/components/topbar/TopNavigation.vue';
import { getCurrentUser, getTicketRouteForRole, logout } from '@api/auth';
import { searchTicketsForConsultant } from '@api/tickets';

defineProps({
    assignedCount: {
        type: Number,
        default: 0,
    },
});

const router = useRouter();
const user = ref(null);

onMounted(async () => {
    user.value = await getCurrentUser();
});

const displayName = computed(() => {
    if (!user.value?.username) {
        return 'Consultant';
    }
    const name = user.value.username;
    return name.charAt(0).toUpperCase() + name.slice(1);
});

const userEmail = computed(() => user.value?.email || '');

const userInitials = computed(() => {
    const source = user.value?.username || 'C';
    return source.slice(0, 2).toUpperCase();
});

function onLogout() {
    logout();
    router.replace('/login');
}

function consultantSearch(query) {
  return searchTicketsForConsultant(query);
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
        <ConsultantSidebar
            :user-name="displayName"
            :user-email="userEmail"
            :user-initials="userInitials"
            :assigned-count="assignedCount"
        />

        <div class="flex min-w-0 flex-1 flex-col">
            <TopNavigation
                :role="user?.role || 'Consultant'"
                :user-name="displayName"
                :user-email="userEmail"
                :user-initials="userInitials"
                :search-fn="consultantSearch"
                @logout="onLogout"
                @ticket-select="onTicketSelect"
            />

            <main class="flex-1 overflow-y-auto">
                <slot />
            </main>
        </div>
    </div>


</template>
