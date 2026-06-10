<script setup>
import { computed } from 'vue';
import TicketBadge from '@/components/tickets/TicketBadge.vue';
import { getTicketPriorityMeta } from '@js/domain/tickets/ticketCatalog';

const props = defineProps({
    priority: {
        type: String,
        default: 'MEDIUM',
    },
});

const meta = computed(() => getTicketPriorityMeta(props.priority));
</script>

<template>
    <TicketBadge
        :label="meta.label"
        :badge-class="meta.badgeClass"
        show-dot
        :dot-class="meta.dotClass"
    />
</template>
