<script setup>
import TicketTypeBadge from '@/components/tickets/ticket_components/TicketTypeBadge.vue';
import TicketPriorityBadge from '@/components/tickets/ticket_components/TicketPriorityBadge.vue';
import { formatTicketNumber } from '@js/domain/tickets/ticketCatalog';
import { Eye, CheckCircle, CircleX, UserPlus, Search } from 'lucide-vue-next';

defineProps({
    ticket: {
        type: Object,
        required: true,
    },
    companyLabel: {
        type: String,
        default: '—',
    },
    dateLabel: {
        type: String,
        default: '—',
    },
    showAccept: {
        type: Boolean,
        default: false,
    },
    showDeny: {
        type: Boolean,
        default: false,
    },
    showAssign: {
        type: Boolean,
        default: false,
    },
    showAddToReview: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['view', 'accept', 'deny', 'assign', 'add-to-review']);
</script>

<template>
    <article class="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <div class="flex items-start justify-between gap-2">
            <div class="flex min-w-0 flex-wrap items-center gap-1.5">
                <span class="text-[11px] font-medium text-slate-400">
                    {{ formatTicketNumber(ticket.id) }}
                </span>
                <TicketTypeBadge v-if="ticket.type" :type="ticket.type" />
            </div>
            <TicketPriorityBadge :priority="ticket.priority" />
        </div>

        <h3 class="mt-2.5 text-sm font-semibold leading-snug text-slate-900">
            {{ ticket.title }}
        </h3>

        <p class="mt-1 text-xs text-slate-400">
            {{ companyLabel }} · {{ dateLabel }}
        </p>

        <div class="mt-3.5 flex flex-wrap gap-1.5">
            <button
                type="button"
                class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
                @click="$emit('view', ticket)"
            >
                <Eye class="h-3.5 w-3.5" />
                View
            </button>

            <button
                v-if="showAddToReview"
                type="button"
                class="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-amber-700 transition hover:bg-amber-50"
                @click="$emit('add-to-review', ticket)"
            >
                <Search class="h-3.5 w-3.5" />
                Add to Review
            </button>

            <button
                v-if="showAccept"
                type="button"
                class="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-emerald-600 transition hover:bg-emerald-50"
                @click="$emit('accept', ticket)"
            >
                <CheckCircle class="h-3.5 w-3.5" />
                Accept
            </button>

            <button
                v-if="showDeny"
                type="button"
                class="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-red-600 transition hover:bg-red-50"
                @click="$emit('deny', ticket)"
            >
                <CircleX class="h-3.5 w-3.5" />
                Deny
            </button>

            <button
                v-if="showAssign"
                type="button"
                class="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-violet-600 transition hover:bg-violet-50"
                @click="$emit('assign', ticket)"
            >
                <UserPlus class="h-3.5 w-3.5" />
                Assign
            </button>
        </div>
    </article>
</template>
