<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import TopNavigation from '@/components/topbar/TopNavigation.vue';
import CustomerQuickActions from '@/components/topbar/CustomerQuickActions.vue';
import { getCurrentUser, logout } from '@api/auth';

const router = useRouter();
const user = ref(null);
const unreadNotifications = ref(2);

onMounted(async () => {
    user.value = await getCurrentUser();
});

const displayName = computed(() => {
    if (!user.value) {
        return 'User';
    }
    return user.value.username
        ? user.value.username.charAt(0).toUpperCase() + user.value.username.slice(1)
        : 'User';
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

function onNewTicket() {
    router.push('/customer/submit');
}

function onMyTickets() {
    router.push('/customer/tickets');
}
</script>

<template>
    <div class="flex min-h-screen flex-col bg-slate-50">
        <TopNavigation
            :role="user?.role || 'Customer'"
            :user-name="displayName"
            :user-email="userEmail"
            :user-initials="userInitials"
            :unread-notifications="unreadNotifications"
            @logout="onLogout"
        >
            <template #leading>
                <CustomerQuickActions
                    @new-ticket="onNewTicket"
                    @my-tickets="onMyTickets"
                />
            </template>
        </TopNavigation>

        <main class="flex-1 overflow-y-auto">
            <slot />
        </main>
    </div>
</template>
