<script setup>
import { ref, onMounted } from 'vue';
import SupportLayout from '@/layouts/SupportLayout.vue';
import { getAuthHeaders, getCurrentUser } from '@api/auth';
import { Mail, ShieldCheck, CheckCircle, XCircle, Loader2 } from 'lucide-vue-next';

const currentUser = ref(null);
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(async () => {
  currentUser.value = await getCurrentUser();
});

async function handleSendResetLink() {
  if (!currentUser.value?.email) return;

  isLoading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const response = await fetch('/api/users/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ email: currentUser.value.email }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.error || `Something went wrong (${response.status})`);
    }

    successMessage.value = `Reset link sent to ${currentUser.value.email}`;
  } catch (e) {
    errorMessage.value = e.message;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <SupportLayout>
    <div class="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

      <!-- Page header -->
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Settings</h1>
        <p class="mt-0.5 text-sm text-slate-500">Manage your account preferences</p>
      </div>

      <!-- Change Password card -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-2 flex items-center gap-2">
          <ShieldCheck class="size-5 text-slate-500" />
          <h2 class="text-base font-semibold text-slate-800">Change Password</h2>
        </div>
        <p class="mb-5 text-sm text-slate-500">
          We'll send a password reset link to your email address.
        </p>

        <!-- Success / Error feedback -->
        <div v-if="successMessage" class="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle class="size-4 shrink-0" />
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <XCircle class="size-4 shrink-0" />
          {{ errorMessage }}
        </div>

        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-400">
            {{ currentUser?.email ?? '—' }}
          </p>
          <button
              type="button"
              :disabled="isLoading || !currentUser?.email"
              class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              @click="handleSendResetLink"
          >
            <Loader2 v-if="isLoading" class="size-4 animate-spin" />
            <Mail v-else class="size-4" />
            {{ isLoading ? 'Sending…' : 'Send Reset Link' }}
          </button>
        </div>
      </div>

      <!-- Account Information card -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="mb-5 text-base font-semibold text-slate-800">Account Information</h2>
        <div class="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <div>
            <p class="text-xs text-slate-400">User ID</p>
            <p class="mt-0.5 text-sm font-medium text-slate-800">{{ currentUser?.userId ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Role</p>
            <p class="mt-0.5 text-sm font-medium text-slate-800">{{ currentUser?.role ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Organization</p>
            <p class="mt-0.5 text-sm font-medium text-slate-800">{{ currentUser?.company ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Email</p>
            <p class="mt-0.5 text-sm font-medium text-slate-800">{{ currentUser?.email ?? '—' }}</p>
          </div>
        </div>
      </div>

    </div>
  </SupportLayout>
</template>