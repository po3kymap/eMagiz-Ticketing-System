<script setup>
import { useRouter } from 'vue-router';
import { Clock } from 'lucide-vue-next';

const router = useRouter();

function onFullLog() {
    router.push('/support/audit');
}
</script>

<template>
    <section class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-semibold text-slate-900">Recent Audit Actions</h2>
            <button
                type="button"
                class="text-sm font-medium text-teal-600 transition hover:text-teal-700"
                @click="onFullLog"
            >
                Full log &rarr;
            </button>
        </div>

        <div class="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Clock class="h-5 w-5" />
            </div>
            <p class="mt-3 text-sm font-medium text-slate-600">No audit entries yet</p>
            <p class="mt-1 max-w-xs text-xs text-slate-400">
                Audit logging will appear here once the backend API is available.
            </p>
        </div>
    </section>
</template>
