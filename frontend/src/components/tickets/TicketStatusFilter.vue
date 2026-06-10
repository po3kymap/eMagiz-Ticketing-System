<script setup>
import { TICKET_STATUS_FILTER_OPTIONS } from '@js/domain/tickets/ticketCatalog';

defineProps({
    modelValue: {
        type: String,
        default: 'ALL',
    },
});

defineEmits(['update:modelValue']);
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <button
            v-for="option in TICKET_STATUS_FILTER_OPTIONS"
            :key="option.key"
            type="button"
            class="rounded-full px-3 py-1.5 text-sm font-medium transition"
            :class="modelValue === option.key
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'"
            @click="$emit('update:modelValue', option.key)"
        >
            {{ option.label }}
        </button>
    </div>
</template>
