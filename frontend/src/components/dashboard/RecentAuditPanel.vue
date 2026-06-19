<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAuditLogs } from '@js/api/auditLogs';
import { fetchUsers } from '@api/users';
import { formatTicketNumber } from '@js/domain/tickets/ticketCatalog';
import {
    formatAuditTimestamp,
    getAuditActionClass,
    getAuditActionMeta,
} from '@js/domain/audit/auditCatalog';
import { Clock } from 'lucide-vue-next';

const router = useRouter();

const logs = ref([]);
const users = ref([]);
const loading = ref(true);

const userById = computed(() => new Map(users.value.map((user) => [user.id, user])));

const recentLogs = computed(() => logs.value.slice(0, 5).map((log) => {
    const user = log.userId ? userById.value.get(log.userId) : null;
    const actionMeta = getAuditActionMeta(log.action);

    return {
        ...log,
        username: user?.username ?? 'System',
        actionLabel: actionMeta.label,
    };
}));

onMounted(async () => {
    try {
        const [logsData, usersData] = await Promise.all([
            fetchAuditLogs(),
            fetchUsers(),
        ]);
        logs.value = logsData;
        users.value = usersData;
    } catch {
        logs.value = [];
    } finally {
        loading.value = false;
    }
});

function onFullLog() {
    router.push('/support/audit');
}
</script>

<template>
    <section class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-semibold text-slate-900">Recent Audit Actions</h2>
            <button
                type="button"
                class="text-sm font-medium text-teal-600 transition hover:text-teal-700"
                @click="onFullLog"
            >
                Full log &rarr;
            </button>
        </div>

        <div v-if="loading" class="mt-6 py-10 text-center text-sm text-slate-500">
            Loading audit actions...
        </div>

        <div
            v-else-if="recentLogs.length === 0"
            class="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center"
        >
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Clock class="h-5 w-5" />
            </div>
            <p class="mt-3 text-sm font-medium text-slate-600">No audit entries yet</p>
        </div>

        <ul v-else class="mt-4 divide-y divide-slate-100">
            <li
                v-for="log in recentLogs"
                :key="log.id"
                class="py-3"
            >
                <p class="text-sm font-medium" :class="getAuditActionClass(log.action)">
                    {{ log.actionLabel }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    {{ log.username }}
                    <template v-if="log.ticketId">
                        · {{ formatTicketNumber(log.ticketId) }}
                    </template>
                    · {{ formatAuditTimestamp(log.createdAt) }}
                </p>
            </li>
        </ul>
    </section>
</template>
