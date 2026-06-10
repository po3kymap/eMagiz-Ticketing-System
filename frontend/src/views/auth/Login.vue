<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getHomeRouteForRole, login } from '@api/auth';

const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function onSubmit() {
    error.value = '';

    if (!username.value.trim() || !password.value) {
        error.value = 'Enter username and password.';
        return;
    }

    loading.value = true;

    try {
        const session = await login(username.value.trim(), password.value);
        await router.replace(getHomeRouteForRole(session.role));
    } catch (err) {
        error.value = err.message || 'Login failed.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <img src="/img/logo.png" alt="eMagiz" class="h-14 w-auto mx-auto mb-4" />
                <h1 class="text-2xl font-semibold text-slate-900">Sign in</h1>
                <p class="text-sm text-slate-500 mt-1">
                    Sign in to the eMagiz Ticketing System
                </p>
            </div>

            <form
                class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4"
                @submit.prevent="onSubmit"
            >
                <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {{ error }}
                </p>

                <div>
                    <label for="username" class="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input
                        id="username"
                        v-model="username"
                        type="text"
                        autocomplete="username"
                        class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        :disabled="loading"
                    />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        autocomplete="current-password"
                        class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        :disabled="loading"
                    />
                </div>

                <button
                    type="submit"
                    class="w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-medium py-2.5"
                    :disabled="loading"
                >
                    {{ loading ? 'Signing in...' : 'Sign in' }}
                </button>
            </form>
        </div>
    </div>
</template>
