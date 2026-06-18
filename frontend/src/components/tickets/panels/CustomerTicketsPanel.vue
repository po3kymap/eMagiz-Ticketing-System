<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import TicketTypeBadge from '@/components/tickets/ticket_components/TicketTypeBadge.vue';
import TicketPriorityBadge from '@/components/tickets/ticket_components/TicketPriorityBadge.vue';
import TicketStatusBadge from '@/components/tickets/ticket_components/TicketStatusBadge.vue';
import { formatTicketNumber } from '@js/domain/tickets/ticketCatalog';

const props = defineProps({
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
    limit: {
        type: Number,
        default: 0,
    },
    showViewAll: {
        type: Boolean,
        default: true,
    },
});

const router = useRouter();

const visibleTickets = computed(() => {
    if (!props.limit || props.limit <= 0) {
        return props.tickets;
    }
    return props.tickets.slice(0, props.limit);
});

function onViewAll() {
    router.push('/customer/tickets');
}
</script>

<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-semibold text-slate-900">My Tickets</h2>
            <button
                v-if="showViewAll"
                type="button"
                class="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
                @click="onViewAll"
            >
                View all &gt;
            </button>
        </div>

        <div class="mt-2">
            <div v-if="loading" class="py-6 text-sm text-slate-500">
                Loading tickets...
            </div>

            <p
                v-else-if="error"
                class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
                {{ error }}
            </p>

            <p v-else-if="visibleTickets.length === 0" class="py-6 text-sm text-slate-500">
                No tickets yet.
            </p>

            <div v-else class="divide-y divide-slate-100">
                <article
                    v-for="ticket in visibleTickets"
                    :key="ticket.id"
                    class="flex flex-col gap-3 py-4 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                >
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
            </div>
        </div>
    </section>
</template>
