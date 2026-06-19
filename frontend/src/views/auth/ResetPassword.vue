<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);
const token = ref(null);

onMounted(() => {
  console.log('hash:', window.location.hash);
  console.log('route.query:', route.query);
  const hash = window.location.hash;
  const parts = hash.split('?');
  console.log('parts:', parts);
  token.value = route.query.token ?? new URLSearchParams(parts[1]).get('token');
  console.log('token:', token.value);

  if (!token.value) {
    error.value = 'Invalid or missing reset token.';
  }
});

async function onSubmit() {
  error.value = '';

  if (!newPassword.value || !confirmPassword.value) {
    error.value = 'Please fill in both fields.';
    return;
  }

  if (newPassword.value.length < 8) {
    error.value = 'Password must be at least 8 characters.';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.';
    return;
  }

  loading.value = true;

  try {
    const response = await fetch('/api/users/reset-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        token: token.value,
        newPassword: newPassword.value,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.error || `Something went wrong (${response.status})`);
    }

    success.value = true;
  } catch (err) {
    error.value = err.message || 'Failed to reset password.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <img src="/img/logo.png" alt="eMagiz" class="mx-auto mb-4 h-14 w-auto" />
        <h1 class="text-2xl font-semibold text-slate-900">Set new password</h1>
        <p class="mt-1 text-sm text-slate-500">
          Enter your new password below.
        </p>
      </div>

      <!-- Success state -->
      <div v-if="success" class="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-emerald-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <p class="text-sm font-medium text-slate-800">Password changed successfully!</p>
        <p class="text-sm text-slate-500">You can now sign in with your new password.</p>
        <button
            type="button"
            class="w-full rounded-lg bg-emerald-500 py-2.5 font-medium text-white hover:bg-emerald-600"
            @click="router.push('/login')"
        >
          Go to Sign in
        </button>
      </div>

      <!-- Form -->
      <form
          v-else
          class="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          @submit.prevent="onSubmit"
      >
        <p v-if="error" class="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {{ error }}
        </p>

        <div>
          <label for="newPassword" class="mb-1 block text-sm font-medium text-slate-700">
            New Password
          </label>
          <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              placeholder="Min. 8 characters"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              :disabled="loading || !token"
          />
        </div>

        <div>
          <label for="confirmPassword" class="mb-1 block text-sm font-medium text-slate-700">
            Confirm New Password
          </label>
          <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              :disabled="loading || !token"
          />
        </div>

        <button
            type="submit"
            class="w-full rounded-lg bg-emerald-500 py-2.5 font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
            :disabled="loading || !token"
        >
          {{ loading ? 'Saving...' : 'Set new password' }}
        </button>
      </form>
    </div>
  </div>
</template>