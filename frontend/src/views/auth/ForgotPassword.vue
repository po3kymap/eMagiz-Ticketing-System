<script setup>
import { ref } from 'vue';
import { Mail, MailCheck } from 'lucide-vue-next';

const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

async function onSubmit() {
  error.value = '';

  if (!email.value.trim()) {
    error.value = 'Please enter your email address.';
    return;
  }

  loading.value = true;

  try {
    const response = await fetch('/api/users/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: email.value.trim() }),
    });

    if (!response.ok) {
      throw new Error(`Something went wrong (${response.status})`);
    }

    success.value = true;
  } catch (err) {
    error.value = err.message || 'Failed to send reset email.';
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
        <h1 class="text-2xl font-semibold text-slate-900">Forgot password</h1>
        <p class="mt-1 text-sm text-slate-500">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <!-- Success state -->
      <div v-if="success" class="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100">
          <MailCheck class="size-6 text-emerald-600" />
        </div>
        <p class="text-sm font-medium text-slate-800">Check your inbox!</p>
        <p class="text-sm text-slate-500">
          If an account exists with that email, you'll receive reset instructions shortly.
        </p>
        <RouterLink
            to="/login"
            class="block w-full rounded-lg bg-emerald-500 py-2.5 text-center font-medium text-white hover:bg-emerald-600"
        >
          Back to Sign in
        </RouterLink>
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
          <label for="email" class="mb-1 block text-sm font-medium text-slate-700">
            Email address
          </label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                class="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                :disabled="loading"
            />
          </div>
        </div>

        <button
            type="submit"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
            :disabled="loading"
        >
          <Mail v-if="!loading" class="size-4" />
          <span>{{ loading ? 'Sending...' : 'Send reset link' }}</span>
        </button>

        <p class="text-center text-sm text-slate-500">
          Remember your password?
          <RouterLink to="/login" class="font-medium text-emerald-600 hover:underline">Sign in</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>