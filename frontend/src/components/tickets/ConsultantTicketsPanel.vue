<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import TicketTypeBadge from '@/components/tickets/TicketTypeBadge.vue';
import TicketPriorityBadge from '@/components/tickets/TicketPriorityBadge.vue';
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge.vue';

const props = defineProps({
    tickets: {
        type: Array,
        default: () => [],
    },
});

const router = useRouter();
const visibleTickets = computed(() => {
    return props.tickets.slice(0, 4);
});

function formatDate(val) {
    if (!val) return '';
    const d = new Date(val);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function onViewAll() {
    router.push('/consultant/assigned');
}

function onTicketClick(id) {
    router.push(`/consultant/assigned/ticket/TKT-${id}`);
}
</script>

<template>
    <div class="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
            <div class="flex items-center gap-2">
                <h2 class="text-base font-semibold text-slate-800">Assigned to Me</h2>
                <span class="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-600">
                    {{ visibleTickets.length }}
                </span>
            </div>
            <button
                type="button"
                class="text-xs font-medium text-teal-600 hover:text-teal-700 transition flex items-center gap-1"
                @click="onViewAll"
            >
                View all
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>

        <div v-if="loading" class="p-6 text-center text-sm text-slate-500">Loading tickets...</div>
        <div v-else-if="error" class="p-6 text-center text-sm text-red-500">{{ error }}</div>
        <div v-else class="flex-1 overflow-y-auto">
            <div v-if="visibleTickets.length === 0" class="p-6 text-center text-sm text-slate-500">
                No tickets assigned to you.
            </div>
            <div v-else class="divide-y divide-slate-100">
                <article
                    v-for="ticket in visibleTickets"
                    :key="ticket.id"
                    class="px-4 py-3 hover:bg-slate-50 transition cursor-pointer flex flex-col gap-1.5"
                    @click="onTicketClick(ticket.id)"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-medium text-slate-400">TKT-{{ ticket.id }}</span>
                            <TicketTypeBadge :type="ticket.type" />
                            <TicketPriorityBadge :priority="ticket.priority" />
                        </div>
                        <TicketStatusBadge :status="ticket.status" />
                    </div>

                    <h3 class="text-sm font-semibold text-slate-800 truncate">
                        {{ ticket.title }}
                    </h3>

                    <div class="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <span class="truncate">{{ ticket.company || 'Unknown Company' }}</span>
                        <span class="text-slate-300">&middot;</span>
                        <span>Updated {{ formatDate(ticket.updatedAt) }}</span>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>