<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import TicketList from '@/components/tickets/TicketList.vue';

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
            <TicketList
                :tickets="visibleTickets"
                :loading="loading"
                :error="error"
            />
        </div>
    </section>
</template>
