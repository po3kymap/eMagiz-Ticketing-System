<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAuditActionClass } from '@js/domain/audit/auditCatalog';
import { buildActivityFeed } from '@js/domain/notifications/activityFeed';
import { Clock } from 'lucide-vue-next';

const props = defineProps({
    tickets: {
        type: Array,
        default: () => [],
    },
    auditLogs: {
        type: Array,
        default: () => [],
    },
    users: {
        type: Array,
        default: () => [],
    },
    userId: {
        type: Number,
        default: null,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    limit: {
        type: Number,
        default: 5,
    },
});

const router = useRouter();

const activityItems = computed(() => {
    if (!props.userId || !props.tickets.length) {
        return [];
    }

    const feed = buildActivityFeed({
        role: 'customer',
        userId: props.userId,
        tickets: props.tickets,
        auditLogs: props.auditLogs,
        users: props.users,
        limit: props.limit,
    });

    return feed.items;
});

function onViewTicket(item) {
    if (!item?.ticketId) {
        return;
    }
    router.push(`/customer/tickets/ticket/TKT-${item.ticketId}`);
}
</script>

<template>
    <section class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Recent Activity</h2>
        <p class="mt-1 text-xs text-slate-400">Updates from the support team on your tickets</p>

        <div v-if="loading" class="mt-6 py-10 text-center text-sm text-slate-500">
            Loading activity…
        </div>

        <div
            v-else-if="activityItems.length === 0"
            class="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center"
        >
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Clock class="h-5 w-5" />
            </div>
            <p class="mt-3 text-sm font-medium text-slate-600">No recent activity yet</p>
            <p class="mt-1 text-xs text-slate-400">
                Status changes and comments will appear here.
            </p>
        </div>

        <ul v-else class="mt-4 divide-y divide-slate-100">
            <li v-for="item in activityItems" :key="item.id">
                <button
                    type="button"
                    class="flex w-full flex-col gap-1 py-3 text-left transition hover:bg-slate-50"
                    @click="onViewTicket(item)"
                >
                    <p class="text-sm font-medium" :class="getAuditActionClass(item.action)">
                        {{ item.title }}
                    </p>
                    <p class="text-xs text-slate-500">
                        {{ item.ticketLabel }}
                        <template v-if="item.ticketTitle"> · {{ item.ticketTitle }}</template>
                    </p>
                    <p class="text-[11px] text-slate-400">
                        {{ item.subtitle }} · {{ item.timeLabel }}
                    </p>
                </button>
            </li>
        </ul>
    </section>
</template>
