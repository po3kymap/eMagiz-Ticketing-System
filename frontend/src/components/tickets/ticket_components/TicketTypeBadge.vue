<script setup>
import { computed } from 'vue';
import TicketBadge from '@/components/tickets/ticket_components/TicketBadge.vue';
import { getTicketTypeMeta } from '@js/domain/tickets/ticketCatalog';

const props = defineProps({
    type: {
        type: String,
        default: 'INCIDENT',
    },
});

const meta = computed(() => getTicketTypeMeta(props.type));
</script>

<template>
    <TicketBadge :label="meta.label" :badge-class="meta.badgeClass" />
</template>
