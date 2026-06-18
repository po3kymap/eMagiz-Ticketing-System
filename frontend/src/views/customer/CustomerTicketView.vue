<script setup>
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import TicketDetailView from '@/components/tickets/detail/TicketDetailView.vue';
</script>

<template>
    <CustomerLayout>
        <TicketDetailView role="customer" back-path="/customer/tickets" />
    </CustomerLayout>
</template>
