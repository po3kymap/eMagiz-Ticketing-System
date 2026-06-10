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
    loading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        default: '',
    },
    unassignedCount: {
        type: Number,
        default: 0,
    },
    limit: {
        type: Number,
        default: 5,
    },
});

const router = useRouter();

const visibleTickets = computed(() => {
    const sorted = [...props.tickets].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
        return timeB - timeA;
    });

    if (!props.limit || props.limit <= 0) {
        return sorted;
    }
    return sorted.slice(0, props.limit);
});

function onFullView() {
    router.push('/support/triage');
}
</script>

<template>
    <section class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div class="flex items-center gap-3">
                <h2 class="text-lg font-semibold text-slate-800">Central Triage Queue</h2>
                <span
                    v-if="unassignedCount > 0"
                    class="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600"
                >
                    {{ unassignedCount }} unassigned
                </span>
            </div>
            <button
                type="button"
                class="flex items-center gap-1 text-[13px] font-medium text-teal-600 transition hover:text-teal-700"
                @click="onFullView"
            >
                Full view
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
                    <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-600">
                <thead>
                    <tr class="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th class="px-5 py-3 font-semibold">ID</th>
                        <th class="px-5 py-3 font-semibold">Title</th>
                        <th class="px-5 py-3 font-semibold">Type</th>
                        <th class="px-5 py-3 font-semibold">Priority</th>
                        <th class="px-5 py-3 font-semibold">Status</th>
                        <th class="px-5 py-3 font-semibold">Assigned To</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-if="loading">
                        <td colspan="6" class="px-5 py-6 text-center text-sm text-slate-400">Loading triage queue...</td>
                    </tr>
                    <tr v-else-if="error">
                        <td colspan="6" class="px-5 py-6 text-center text-sm text-red-500">{{ error }}</td>
                    </tr>
                    <tr v-else-if="visibleTickets.length === 0">
                        <td colspan="6" class="px-5 py-6 text-center text-sm text-slate-400">No tickets in the queue.</td>
                    </tr>

                    <tr 
                        v-else 
                        v-for="ticket in visibleTickets" 
                        :key="ticket.id"
                        class="hover:bg-slate-50/50 transition cursor-pointer"
                    >
                        <td class="px-5 py-2.5 align-middle">
                            <div class="text-[11px] leading-tight text-slate-400 font-medium">
                                TKT&ndash;<br />
                                <span class="text-xs text-slate-600">{{ ticket.id }}</span>
                            </div>
                        </td>

                        <td class="px-5 py-2.5 align-middle">
                            <div class="max-w-[280px] truncate text-sm font-medium text-slate-800">
                                {{ ticket.title }}
                            </div>
                            <div class="mt-0.5 text-xs text-slate-400">
                                {{ ticket.companyName || ticket.creatorId || 'Unknown Customer' }}
                            </div>
                        </td>

                        <td class="px-5 py-2.5 align-middle">
                            <TicketTypeBadge :type="ticket.type" />
                        </td>
                        <td class="px-5 py-2.5 align-middle">
                            <TicketPriorityBadge :priority="ticket.priority" />
                        </td>
                        <td class="px-5 py-2.5 align-middle">
                            <TicketStatusBadge :status="ticket.status" />
                        </td>

                        <td class="px-5 py-2.5 align-middle text-[13px]">
                            <span v-if="ticket.assigneeId" class="text-slate-700">
                                {{ ticket.assigneeId }}
                            </span>
                            <span v-else class="font-medium text-red-500">
                                Unassigned
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>