<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Clock } from 'lucide-vue-next';
import { getResolutionSlaDisplay, getResponseSlaDisplay } from '@js/domain/tickets/ticketSla';

const props = defineProps({
    ticket: {
        type: Object,
        required: true,
    },
    auditLogs: {
        type: Array,
        default: () => [],
    },
});

const now = ref(Date.now());
let timer = null;

onMounted(() => {
    timer = window.setInterval(() => {
        now.value = Date.now();
    }, 60_000);
});

onUnmounted(() => {
    if (timer) {
        window.clearInterval(timer);
    }
});

const response = computed(() => getResponseSlaDisplay(props.ticket, props.auditLogs, now.value));
const resolution = computed(() => getResolutionSlaDisplay(props.ticket, props.auditLogs, now.value));

const responseClass = computed(() => {
    if (response.value.state === 'none') {
        return 'text-slate-400';
    }
    if (response.value.breached) {
        return 'text-red-600';
    }
    if (response.value.state === 'met') {
        return 'text-emerald-600';
    }
    return 'text-amber-600';
});

const resolutionClass = computed(() => {
    if (resolution.value.state === 'none' || resolution.value.state === 'pending') {
        return 'text-slate-400';
    }
    if (resolution.value.breached) {
        return 'text-red-600';
    }
    if (resolution.value.state === 'met') {
        return 'text-emerald-600';
    }
    return 'text-amber-600';
});

const progressBarClass = computed(() => {
    if (resolution.value.breached) {
        return 'bg-red-500';
    }
    return 'bg-amber-500';
});
</script>

<template>
    <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-2">
            <Clock class="h-4 w-4 text-slate-500" />
            <h2 class="text-sm font-semibold text-slate-700">SLA &amp; Due Date</h2>
        </div>

        <dl class="mt-4 space-y-3 text-sm">
            <div class="flex items-center justify-between gap-3">
                <dt class="text-slate-500">Response SLA</dt>
                <dd class="flex items-center gap-1 font-medium" :class="responseClass">
                    <span v-if="response.state === 'met' && !response.breached" aria-hidden="true">✓</span>
                    <span v-else-if="response.breached" aria-hidden="true">✗</span>
                    {{ response.label }}
                </dd>
            </div>

            <div class="flex items-center justify-between gap-3">
                <dt class="text-slate-500">Resolution SLA</dt>
                <dd class="flex items-center gap-1 font-medium" :class="resolutionClass">
                    <span v-if="resolution.state === 'met' && !resolution.breached" aria-hidden="true">✓</span>
                    <span v-else-if="resolution.breached && resolution.state !== 'pending'" aria-hidden="true">✗</span>
                    {{ resolution.label }}
                </dd>
            </div>
        </dl>

        <div v-if="resolution.state === 'active'" class="mt-4">
            <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="progressBarClass"
                    :style="{ width: `${resolution.percentUsed}%` }"
                />
            </div>
            <p class="mt-2 text-xs text-slate-500">
                {{ resolution.percentUsed }}% of resolution window used
            </p>
        </div>
    </section>
</template>
