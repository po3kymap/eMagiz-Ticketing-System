import { computed, ref } from 'vue';

export function formatTicketDate(val) {
    if (!val) {
        return '—';
    }
    return new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export function formatFilterLabel(value) {
    if (!value) {
        return '';
    }
    return value.charAt(0) + value.slice(1).toLowerCase().replace('_', ' ');
}

export function useTicketTable(tickets, options = {}) {
    const {
        pageSize = 15,
        statusOptions = ['OPEN', 'IN_REVIEW', 'ACCEPTED', 'ASSIGNED', 'RESOLVED', 'DENIED', 'CLOSED'],
        priorityOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        typeOptions = ['INCIDENT', 'RFC'],
        matchSearch = null,
    } = options;

    const searchQuery = ref('');
    const sortKey = ref('createdAt');
    const sortDir = ref('desc');
    const currentPage = ref(1);
    const showFilters = ref(false);
    const filterStatus = ref('');
    const filterPriority = ref('');
    const filterType = ref('');

    const searched = computed(() => {
        const q = searchQuery.value.trim().toLowerCase();
        return tickets.value.filter((ticket) => {
            const matchesQuery = !q || (matchSearch
                ? matchSearch(ticket, q)
                : (
                    ticket.title?.toLowerCase().includes(q)
                    || ticket.id?.toString().includes(q)
                ));

            const matchesStatus = !filterStatus.value
                || String(ticket.status).toUpperCase() === filterStatus.value;
            const matchesPriority = !filterPriority.value
                || String(ticket.priority).toUpperCase() === filterPriority.value;
            const matchesType = !filterType.value
                || String(ticket.type).toUpperCase() === filterType.value;

            return matchesQuery && matchesStatus && matchesPriority && matchesType;
        });
    });

    const sorted = computed(() =>
        [...searched.value].sort((a, b) => {
            const valA = a[sortKey.value] ?? '';
            const valB = b[sortKey.value] ?? '';
            const cmp = String(valA).localeCompare(String(valB));
            return sortDir.value === 'asc' ? cmp : -cmp;
        }),
    );

    const totalPages = computed(() => Math.ceil(sorted.value.length / pageSize) || 1);

    const paginated = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        return sorted.value.slice(start, start + pageSize);
    });

    function toggleSort(key) {
        if (sortKey.value === key) {
            sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortKey.value = key;
            sortDir.value = 'asc';
        }
        currentPage.value = 1;
    }

    function resetFilters() {
        filterStatus.value = '';
        filterPriority.value = '';
        filterType.value = '';
        currentPage.value = 1;
    }

    function onSearchInput() {
        currentPage.value = 1;
    }

    const hasActiveFilters = computed(() =>
        Boolean(filterStatus.value || filterPriority.value || filterType.value),
    );

    return {
        searchQuery,
        sortKey,
        sortDir,
        currentPage,
        showFilters,
        filterStatus,
        filterPriority,
        filterType,
        statusOptions,
        priorityOptions,
        typeOptions,
        searched,
        sorted,
        paginated,
        totalPages,
        hasActiveFilters,
        toggleSort,
        resetFilters,
        onSearchInput,
        formatTicketDate,
        formatFilterLabel,
    };
}
