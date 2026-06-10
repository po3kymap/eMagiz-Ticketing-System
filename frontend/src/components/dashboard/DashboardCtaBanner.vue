<script setup>
defineEmits(['submit-ticket']);
</script>

<template>
    <section class="flex flex-col gap-6 rounded-2xl bg-teal-700 px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
            <h2 class="text-xl font-semibold">Need to report an issue or request a change?</h2>
            <p class="mt-2 max-w-2xl text-sm text-teal-50">
                Submit a new ticket and our support team will review it within 4 business hours.
            </p>
        </div>
        <button
            type="button"
            class="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
            @click="$emit('submit-ticket')"
        >
            Submit New Ticket
        </button>
    </section>
</template>
