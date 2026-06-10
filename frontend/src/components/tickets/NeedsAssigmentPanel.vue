<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TicketPriorityBadge from '@/components/tickets/TicketPriorityBadge.vue';

const props = defineProps({
    tickets: {
        type: Array,
        default: () => [],
    },
    users: {
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
});

const router = useRouter();

const unassignedTickets = computed(() => {
    return props.tickets.filter(t => String(t.status).toUpperCase() === 'IN_REVIEW');
});

function getUserCompanyDisplay(id) {
  if (!id) return '—';
  const user = props.users.find(u => u.id === id);
  return user?.company ? user.company : '—';
}

const visibleTickets = computed(() => {
    return unassignedTickets.value.slice(0, 5);
});

function onTriage() {
    router.push('/support/triage');
}
</script>

<template>
    <section class="flex flex-col rounded-2xl border border-red-100 bg-white overflow-hidden shadow-sm">
        <div class="flex items-center justify-between bg-red-50/50 px-5 py-4 border-b border-red-100">
            <div class="flex items-center gap-2 text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
                <h3 class="text-sm font-semibold">Needs Assignment ({{ unassignedTickets.length }})</h3>
            </div>
            <button
                type="button"
                class="text-xs font-medium text-red-700 hover:text-red-800 transition flex items-center gap-1"
                @click="onTriage"
            >
                Triage &rarr;
            </button>
        </div>

        <div class="flex-1 overflow-y-auto">
            <div v-if="loading" class="p-6 text-center text-sm text-slate-500">
                Loading tickets...
            </div>
            <p v-else-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {{ error }}
            </p>
            <div v-else-if="unassignedTickets.length === 0" class="p-6 text-center text-sm text-slate-500">
                No tickets need assignment.
            </div>
            <div v-else class="divide-y divide-slate-100">
                <article
                    v-for="ticket in visibleTickets"
                    :key="ticket.id"
                    class="p-4 hover:bg-slate-50 transition cursor-pointer flex items-start justify-between gap-3"
                >
                    <div class="min-w-0 flex-1">
                        <div class="text-[11px] font-medium text-slate-400">TKT-{{ ticket.id }}</div>
                        <h4 class="mt-0.5 truncate text-sm font-medium text-slate-800">{{ ticket.title }}</h4>
                        <div class="mt-0.5 text-xs text-slate-400">{{ getUserCompanyDisplay(ticket.creatorId) }}</div>
                    </div>
                    <div class="shrink-0 mt-0.5">
                        <TicketPriorityBadge :priority="ticket.priority" />
                    </div>
                </article>
            </div>  
        </div>
    </section>
</template>