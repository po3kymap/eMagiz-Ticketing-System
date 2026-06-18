<script setup>
import TicketTypeBadge from '@/components/tickets/ticket_components/TicketTypeBadge.vue';
import TicketPriorityBadge from '@/components/tickets/ticket_components/TicketPriorityBadge.vue';
import TicketStatusBadge from '@/components/tickets/ticket_components/TicketStatusBadge.vue';
import { formatTicketDate } from '@js/composables/useTicketTable';

const props = defineProps({
    columns: { type: Array, required: true },
    tickets: { type: Array, required: true },
    sortKey: { type: String, required: true },
    sortDir: { type: String, required: true },
    resolveUser: { type: Function, default: null },
    rowClickable: { type: Boolean, default: false },
    showActions: { type: Boolean, default: false },
});

defineEmits(['sort', 'row-click']);

function cellText(ticket, key) {
    switch (key) {
        case 'id':
            return `TKT-${ticket.id}`;
        case 'creatorId':
            return props.resolveUser
                ? props.resolveUser(ticket.creatorId)
                : (ticket.creatorId ?? '—');
        case 'assigneeId':
            return props.resolveUser
                ? props.resolveUser(ticket.assigneeId)
                : (ticket.assigneeId ?? '—');
        case 'createdAt':
        case 'updatedAt':
            return formatTicketDate(ticket[key]);
        default:
            return ticket[key] ?? '—';
    }
}
</script>

<template>
    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-slate-200">
                    <th
                        v-for="col in columns"
                        :key="col.key"
                        class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 cursor-pointer select-none whitespace-nowrap hover:text-slate-600"
                        @click="$emit('sort', col.key)"
                    >
                        {{ col.label }}
                        <span v-if="sortKey === col.key" class="ml-0.5">
                            {{ sortDir === 'asc' ? '↑' : '↓' }}
                        </span>
                    </th>
                    <th
                        v-if="showActions"
                        class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap"
                    >
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="ticket in tickets"
                    :key="ticket.id"
                    class="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                    :class="rowClickable ? 'cursor-pointer' : ''"
                    @click="rowClickable && $emit('row-click', ticket)"
                >
                    <td
                        v-for="col in columns"
                        :key="col.key"
                        class="px-4 py-3"
                        :class="{
                            'font-mono text-xs text-teal-600 whitespace-nowrap': col.key === 'id',
                            'max-w-[200px] truncate text-slate-800': col.key === 'title',
                            'whitespace-nowrap text-slate-500': col.key === 'creatorId' || col.key === 'assigneeId',
                            'whitespace-nowrap text-slate-400': col.key === 'createdAt' || col.key === 'updatedAt',
                        }"
                    >
                        <TicketTypeBadge v-if="col.key === 'type'" :type="ticket.type" />
                        <TicketPriorityBadge v-else-if="col.key === 'priority'" :priority="ticket.priority" />
                        <TicketStatusBadge v-else-if="col.key === 'status'" :status="ticket.status" />
                        <template v-else>{{ cellText(ticket, col.key) }}</template>
                    </td>

                    <td
                        v-if="showActions"
                        class="px-4 py-3 text-right whitespace-nowrap"
                        @click.stop
                    >
                        <slot name="actions" :ticket="ticket" />
                    </td>
                </tr>

                <tr v-if="tickets.length === 0">
                    <td
                        :colspan="columns.length + (showActions ? 1 : 0)"
                        class="px-4 py-12 text-center text-sm text-slate-400"
                    >
                        No tickets found.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
