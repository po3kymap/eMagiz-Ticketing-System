<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser, getHomeRouteForRole, logout } from '@api/auth';

const router = useRouter();
const user = ref(null);

onMounted(async () => {
    user.value = await getCurrentUser();
});

const homeRoute = computed(() => getHomeRouteForRole(user.value?.role));

function goHome() {
    router.replace(homeRoute.value);
}

function onLogout() {
    logout();
    router.replace({ name: 'login' });
}
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
                </svg>
            </div>

            <h1 class="mt-5 text-2xl font-semibold text-slate-900">403 — Unauthorized</h1>
            <p class="mt-2 text-sm text-slate-500">
                You do not have permission to access this page.
            </p>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                    type="button"
                    class="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                    @click="goHome"
                >
                    Go to my dashboard
                </button>
                <button
                    type="button"
                    class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    @click="onLogout"
                >
                    Sign out
                </button>
            </div>
        </div>
    </div>
</template>
