<script setup>
import SupportLayout from '@/layouts/SupportLayout.vue';
import TicketDetailView from '@/components/tickets/detail/TicketDetailView.vue';
</script>

<template>
    <SupportLayout>
        <TicketDetailView role="support" back-path="/support/queue" />
    </SupportLayout>
</template>
