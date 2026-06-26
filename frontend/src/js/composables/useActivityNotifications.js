import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { getCurrentUser } from '@api/auth';
import { fetchAuditLogsForRole } from '@js/api/auditLogs';
import {
    fetchAllTickets,
    fetchAssignedTicketsForCurrentUser,
    fetchMyTicketsForCurrentUser,
} from '@api/tickets';
import { fetchUsersForRole } from '@api/users';
import { normalizeRole } from '@js/domain/auth/roles';
import {
    buildActivityFeed,
    getLastSeenAt,
    setLastSeenAt,
} from '@js/domain/notifications/activityFeed';

const REFRESH_MS = 60_000;

async function fetchTicketsForRole(role) {
    const normalized = normalizeRole(role);

    if (normalized === 'support') {
        return fetchAllTickets();
    }
    if (normalized === 'consultant') {
        return fetchAssignedTicketsForCurrentUser();
    }
    return fetchMyTicketsForCurrentUser();
}

export function useActivityNotifications() {
    const user = ref(null);
    const items = ref([]);
    const unreadCount = ref(0);
    const isLoading = ref(false);
    const isOpen = ref(false);
    const error = ref('');

    let refreshTimer = null;

    async function refresh() {
        const currentUser = user.value ?? await getCurrentUser();
        if (!currentUser?.userId) {
            return;
        }

        user.value = currentUser;
        isLoading.value = true;
        error.value = '';

        try {
            const [tickets, auditLogs, users] = await Promise.all([
                fetchTicketsForRole(currentUser.role),
                fetchAuditLogsForRole(currentUser.role),
                fetchUsersForRole(currentUser.role),
            ]);

            const lastSeenAt = getLastSeenAt(currentUser.userId);
            const feed = buildActivityFeed({
                role: currentUser.role,
                userId: currentUser.userId,
                tickets,
                auditLogs,
                users,
                lastSeenAt,
            });

            items.value = feed.items;
            unreadCount.value = feed.unreadCount;
        } catch (e) {
            error.value = e.message || 'Failed to load activity';
            items.value = [];
            unreadCount.value = 0;
        } finally {
            isLoading.value = false;
        }
    }

    function openPanel() {
        isOpen.value = true;
        if (user.value?.userId) {
            setLastSeenAt(user.value.userId);
            items.value = items.value.map((item) => ({ ...item, isUnread: false }));
            unreadCount.value = 0;
        }
    }

    function closePanel() {
        isOpen.value = false;
    }

    function togglePanel() {
        if (isOpen.value) {
            closePanel();
        } else {
            openPanel();
        }
    }

    function markAllRead() {
        if (!user.value?.userId) {
            return;
        }
        setLastSeenAt(user.value.userId);
        items.value = items.value.map((item) => ({ ...item, isUnread: false }));
        unreadCount.value = 0;
    }

    onMounted(async () => {
        user.value = await getCurrentUser();
        await refresh();
        refreshTimer = window.setInterval(refresh, REFRESH_MS);
    });

    onUnmounted(() => {
        if (refreshTimer) {
            window.clearInterval(refreshTimer);
        }
    });

    watch(isOpen, (open) => {
        if (open) {
            refresh();
        }
    });

    const hasItems = computed(() => items.value.length > 0);

    return {
        items,
        unreadCount,
        isLoading,
        isOpen,
        error,
        hasItems,
        refresh,
        openPanel,
        closePanel,
        togglePanel,
        markAllRead,
    };
}
