<script setup>
import TicketListItem from '@/components/tickets/TicketListItem.vue';

defineProps({
    tickets: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        default: '',
    },
    emptyMessage: {
        type: String,
        default: 'No tickets yet.',
    },
});
</script>

<template>
    <div>
        <div v-if="loading" class="py-6 text-sm text-slate-500">
            Loading tickets...
        </div>

        <p
            v-else-if="error"
            class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
            {{ error }}
        </p>

        <p
            v-else-if="tickets.length === 0"
            class="py-6 text-sm text-slate-500"
        >
            {{ emptyMessage }}
        </p>

        <div v-else>
            <TicketListItem
                v-for="ticket in tickets"
                :key="ticket.id"
                :ticket="ticket"
            />
        </div>
    </div>
</template>
