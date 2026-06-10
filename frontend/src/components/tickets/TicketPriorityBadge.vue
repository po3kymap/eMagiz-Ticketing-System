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
console.log('Priority Meta:', meta.value);
</script>

<template>
    <TicketBadge
        :label="meta.label"
        :badge-class="meta.badgeClass"
        :show-dot="true"
        :dot-class="meta.dotClass"
    />
</template>