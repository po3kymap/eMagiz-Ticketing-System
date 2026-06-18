<script setup>
import SupportLayout from '@/layouts/SupportLayout.vue';
</script>

<template>
    <SupportLayout>
        <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div>
                <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Audit Log</h1>
                <p class="mt-1 text-sm text-slate-500">Track system and ticket activity</p>
            </div>

            <div class="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <p class="text-sm font-medium text-slate-600">Audit log is not available yet</p>
                <p class="mt-2 text-sm text-slate-400">
                    This section will be connected to the backend audit API in a future update.
                </p>
            </div>
        </div>
    </SupportLayout>
</template>
