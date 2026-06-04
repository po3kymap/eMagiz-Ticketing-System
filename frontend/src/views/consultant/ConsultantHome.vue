<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import TopNavigation from '@/components/topbar/TopNavigation.vue';
import { getCurrentUser, logout } from '@api/auth';

const router = useRouter();
const user = ref(null);

onMounted(async () => {
    user.value = await getCurrentUser();
});

const displayName = computed(() => user.value?.username ?? 'Consultant');
const userEmail = computed(() => user.value?.email ?? '');
const userInitials = computed(() => (user.value?.username ?? 'C').slice(0, 2).toUpperCase());

function onLogout() {
    logout();
    router.replace('/login');
}
</script>

<template>
    <div class="flex min-h-screen flex-col bg-slate-50">
        <TopNavigation
            :role="user?.role || 'Consultant'"
            :user-name="displayName"
            :user-email="userEmail"
            :user-initials="userInitials"
            @logout="onLogout"
        >
            <template #leading>
                <p class="text-sm text-slate-600">Consultant queue — coming soon.</p>
            </template>
        </TopNavigation>
        <main class="p-8 text-sm text-slate-500">Consultant portal</main>
    </div>
</template>
