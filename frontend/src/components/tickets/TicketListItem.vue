<script setup>
import TicketTypeBadge from '@/components/tickets/TicketTypeBadge.vue';
import TicketPriorityBadge from '@/components/tickets/TicketPriorityBadge.vue';
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge.vue';
import { formatTicketNumber } from '@js/domain/tickets/ticketCatalog';

defineProps({
    ticket: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <article class="flex flex-col gap-3 border-b border-slate-100 py-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-medium text-slate-400">
                    {{ formatTicketNumber(ticket.id) }}
                </span>
                <TicketTypeBadge v-if="ticket.type" :type="ticket.type" />
            </div>
            <h3 class="mt-1 text-sm font-medium text-slate-900">
                {{ ticket.title }}
            </h3>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <TicketPriorityBadge :priority="ticket.priority" />
            <TicketStatusBadge :status="ticket.status" />
        </div>
    </article>
</template>
