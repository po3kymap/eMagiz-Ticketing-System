<script setup>
import { computed } from 'vue';

const props = defineProps({
    userName: {
        type: String,
        default: 'Support',
    },
});

const greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
        return 'Good morning';
    }
    if (hour < 18) {
        return 'Good afternoon';
    }
    return 'Good evening';
});

const displayName = computed(() => {
    if (!props.userName) {
        return 'Support';
    }
    return props.userName.charAt(0).toUpperCase() + props.userName.slice(1);
});

const workspaceSubtitle = computed(() => {
    const formatted = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date());

    return `Support Command Center · ${formatted}`;
});
</script>

<template>
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
            <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
                {{ greeting }}, {{ displayName }}
            </h1>
            <p class="mt-1 text-sm text-slate-500">{{ workspaceSubtitle }}</p>
        </div>
    </div>
</template>
