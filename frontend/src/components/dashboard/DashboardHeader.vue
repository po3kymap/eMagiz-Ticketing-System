<script setup>
import { computed } from 'vue';

const props = defineProps({
    userName: {
        type: String,
        default: 'User',
    },
    company: {
        type: String,
        default: '',
    },
});

defineEmits(['submit-ticket']);

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
        return 'User';
    }
    return props.userName.charAt(0).toUpperCase() + props.userName.slice(1);
});

const subtitle = computed(() => {
    if (props.company) {
        return `${props.company} · Customer Portal`;
    }
    return 'Customer Portal';
});
</script>

<template>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
            <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
                {{ greeting }}, {{ displayName }}
            </h1>
            <p class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>
        </div>

        <button
            type="button"
            class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            @click="$emit('submit-ticket')"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            Submit New Ticket
        </button>
    </div>
</template>
