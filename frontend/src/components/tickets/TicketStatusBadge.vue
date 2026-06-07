<script setup>
import { computed } from 'vue';
import TicketBadge from '@/components/tickets/TicketBadge.vue';
import { getTicketStatusMeta } from '@js/domain/tickets/ticketCatalog';

const props = defineProps({
    status: {
        type: String,
        default: 'OPEN',
    },
});

const meta = computed(() => getTicketStatusMeta(props.status));
</script>

<template>
    <TicketBadge :label="meta.label" :badge-class="meta.badgeClass" />
</template>
