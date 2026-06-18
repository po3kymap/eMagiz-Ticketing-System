<script setup>
import ConsultantLayout from '@/layouts/ConsultantLayout.vue';
import TicketDetailView from '@/components/tickets/detail/TicketDetailView.vue';
</script>

<template>
    <ConsultantLayout>
        <TicketDetailView role="consultant" back-path="/consultant/assigned" />
    </ConsultantLayout>
</template>
