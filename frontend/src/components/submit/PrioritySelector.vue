<script setup>
import { TICKET_PRIORITIES } from '@js/domain/tickets/ticketCatalog';

defineProps({
    modelValue: {
        type: String,
        default: 'MEDIUM',
    },
});

defineEmits(['update:modelValue']);

const options = [
    { key: 'CRITICAL', subtitle: 'Production down' },
    { key: 'HIGH', subtitle: 'Major impact' },
    { key: 'MEDIUM', subtitle: 'Limited impact' },
    { key: 'LOW', subtitle: 'Minor / cosmetic' },
];

const priorityStyles = {
    LOW: {
        selected: 'border-slate-400 bg-slate-50 ring-1 ring-slate-400',
        title: 'text-slate-600',
    },
    MEDIUM: {
        selected: 'border-amber-500 bg-amber-50 ring-1 ring-amber-500',
        title: 'text-amber-700',
    },
    HIGH: {
        selected: 'border-orange-500 bg-orange-50 ring-1 ring-orange-500',
        title: 'text-orange-700',
    },
    CRITICAL: {
        selected: 'border-red-500 bg-red-50 ring-1 ring-red-500',
        title: 'text-red-700',
    },
};
</script>

<template>
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
            v-for="option in options"
            :key="option.key"
            type="button"
            class="rounded-xl border px-4 py-3 text-left transition"
            :class="modelValue === option.key
                ? priorityStyles[option.key].selected
                : 'border-slate-200 bg-white hover:border-slate-300'"
            @click="$emit('update:modelValue', option.key)"
        >
            <p
                class="text-sm font-semibold"
                :class="modelValue === option.key
                    ? priorityStyles[option.key].title
                    : 'text-slate-900'"
            >
                {{ TICKET_PRIORITIES[option.key].label }}
            </p>
            <p class="mt-1 text-xs text-slate-500">{{ option.subtitle }}</p>
        </button>
    </div>
</template>
