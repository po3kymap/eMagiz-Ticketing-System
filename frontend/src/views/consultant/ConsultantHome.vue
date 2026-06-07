<script setup>
import ConsultantLayout from '@/layouts/ConsultantLayout.vue';

const assignedCount = 3;
</script>

<template>
    <ConsultantLayout :assigned-count="assignedCount">
        <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
                Consultant dashboard — content coming soon.
            </div>
        </div>
    </ConsultantLayout>
</template>
