<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SupportLayout from '@/layouts/SupportLayout.vue';
import TicketTablePagination from '@/components/tickets/ticket_table/TicketTablePagination.vue';
import { fetchAuditLogs } from '@js/api/auditLogs';
import { fetchUsers } from '@api/users';
import { formatTicketNumber } from '@js/domain/tickets/ticketCatalog';
import {
    AUDIT_ACTION_OPTIONS,
    AUDIT_ROLE_OPTIONS,
    AUDIT_SORT_OPTIONS,
    formatAuditRoleLabel,
    formatAuditTimestamp,
    getAuditActionClass,
    getAuditActionMeta,
    getAuditRoleBadgeClass,
    getUserInitials,
    isHiddenAuditAction,
} from '@js/domain/audit/auditCatalog';
import { Shield, Search } from 'lucide-vue-next';

const router = useRouter();

const logs = ref([]);
const users = ref([]);
const loading = ref(true);
const error = ref('');

const searchQuery = ref('');
const roleFilter = ref('ALL');
const actionFilter = ref('ALL');
const sortOrder = ref('desc');
const currentPage = ref(1);
const pageSize = 15;

const userById = computed(() => new Map(users.value.map((user) => [user.id, user])));

const enrichedLogs = computed(() => logs.value
    .filter((log) => !isHiddenAuditAction(log.action))
    .map((log) => {
    const user = log.userId ? userById.value.get(log.userId) : null;
    const actionMeta = getAuditActionMeta(log.action);

    return {
        ...log,
        username: user?.username ?? 'System',
        role: user?.role ?? 'System',
        actionLabel: actionMeta.label,
        actionFilterKey: actionMeta.filterKey,
    };
}));

const filteredLogs = computed(() => {
    let result = [...enrichedLogs.value];
    const query = searchQuery.value.trim().toLowerCase();

    if (query) {
        result = result.filter((log) => {
            const ticketRef = log.ticketId ? formatTicketNumber(log.ticketId).toLowerCase() : '';
            return log.username.toLowerCase().includes(query)
                || log.actionLabel.toLowerCase().includes(query)
                || ticketRef.includes(query)
                || String(log.ticketId ?? '').includes(query);
        });
    }

    if (roleFilter.value !== 'ALL') {
        result = result.filter((log) => String(log.role).toUpperCase() === roleFilter.value);
    }

    if (actionFilter.value !== 'ALL') {
        result = result.filter((log) => log.actionFilterKey === actionFilter.value);
    }

    result.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder.value === 'asc' ? timeA - timeB : timeB - timeA;
    });

    return result;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredLogs.value.length / pageSize)));

const paginatedLogs = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredLogs.value.slice(start, start + pageSize);
});

onMounted(loadData);

async function loadData() {
    loading.value = true;
    error.value = '';

    try {
        const [logsData, usersData] = await Promise.all([
            fetchAuditLogs(),
            fetchUsers(),
        ]);
        logs.value = logsData;
        users.value = usersData;
    } catch (err) {
        error.value = err.message || 'Failed to load audit log';
    } finally {
        loading.value = false;
    }
}

function onSearchInput() {
    currentPage.value = 1;
}

function onFilterChange() {
    currentPage.value = 1;
}

function openTicket(ticketId) {
    if (!ticketId) {
        return;
    }
    router.push(`/support/queue/ticket/TKT-${ticketId}`);
}
</script>

<template>
    <SupportLayout>
        <div class="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
            <div class="border-b border-slate-200 pb-5">
                <div class="flex items-start gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Shield class="h-5 w-5" />
                    </div>
                    <div>
                        <h1 class="text-[1.65rem] font-semibold tracking-tight text-slate-900">Audit Log</h1>
                        <p class="mt-1 text-sm text-slate-500">
                            Complete traceability of all system and user actions
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center">
                <div class="relative flex-1">
                    <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        v-model="searchQuery"
                        type="search"
                        placeholder="Search by user, ticket ID, or action..."
                        class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        @input="onSearchInput"
                    />
                </div>

                <div class="flex flex-wrap gap-2">
                    <select
                        v-model="roleFilter"
                        class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        @change="onFilterChange"
                    >
                        <option
                            v-for="option in AUDIT_ROLE_OPTIONS"
                            :key="option.key"
                            :value="option.key"
                        >
                            {{ option.label }}
                        </option>
                    </select>

                    <select
                        v-model="actionFilter"
                        class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        @change="onFilterChange"
                    >
                        <option
                            v-for="option in AUDIT_ACTION_OPTIONS"
                            :key="option.key"
                            :value="option.key"
                        >
                            {{ option.label }}
                        </option>
                    </select>

                    <select
                        v-model="sortOrder"
                        class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        @change="onFilterChange"
                    >
                        <option
                            v-for="option in AUDIT_SORT_OPTIONS"
                            :key="option.key"
                            :value="option.key"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div v-if="loading" class="px-6 py-16 text-center text-sm text-slate-500">
                    Loading audit log...
                </div>

                <div v-else-if="error" class="px-6 py-16 text-center text-sm text-red-500">
                    {{ error }}
                </div>

                <div v-else-if="filteredLogs.length === 0" class="px-6 py-16 text-center text-sm text-slate-500">
                    No audit entries found.
                </div>

                <template v-else>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-left text-sm">
                            <thead class="border-b border-slate-100 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th class="px-5 py-3">Timestamp</th>
                                    <th class="px-5 py-3">User</th>
                                    <th class="px-5 py-3">Role</th>
                                    <th class="px-5 py-3">Action Performed</th>
                                    <th class="px-5 py-3">Ticket Ref</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr
                                    v-for="log in paginatedLogs"
                                    :key="log.id"
                                    class="hover:bg-slate-50/60"
                                >
                                    <td class="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-500">
                                        {{ formatAuditTimestamp(log.createdAt) }}
                                    </td>
                                    <td class="px-5 py-3.5">
                                        <div class="flex items-center gap-2.5">
                                            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                {{ getUserInitials(log.username) }}
                                            </span>
                                            <span class="font-medium text-slate-800">{{ log.username }}</span>
                                        </div>
                                    </td>
                                    <td class="px-5 py-3.5">
                                        <span
                                            class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                                            :class="getAuditRoleBadgeClass(log.role)"
                                        >
                                            {{ formatAuditRoleLabel(log.role) }}
                                        </span>
                                    </td>
                                    <td class="px-5 py-3.5">
                                        <span class="font-medium" :class="getAuditActionClass(log.action)">
                                            {{ log.actionLabel }}
                                        </span>
                                    </td>
                                    <td class="px-5 py-3.5">
                                        <button
                                            v-if="log.ticketId"
                                            type="button"
                                            class="font-mono text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
                                            @click="openTicket(log.ticketId)"
                                        >
                                            {{ formatTicketNumber(log.ticketId) }}
                                        </button>
                                        <span v-else class="text-slate-400">—</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="border-t border-slate-100 px-5 py-4">
                        <TicketTablePagination
                            :total="filteredLogs.length"
                            :current-page="currentPage"
                            :total-pages="totalPages"
                            @prev="currentPage--"
                            @next="currentPage++"
                        />
                    </div>
                </template>
            </div>
        </div>
    </SupportLayout>
</template>
