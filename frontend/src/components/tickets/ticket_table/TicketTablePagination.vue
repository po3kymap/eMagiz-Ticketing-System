<script setup>
defineProps({
    total: { type: Number, required: true },
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
});

defineEmits(['prev', 'next']);
</script>

<template>
    <div class="flex items-center justify-between text-sm text-slate-500">
        <span>Showing {{ total }} tickets</span>
        <div class="flex items-center gap-3">
            <button
                type="button"
                class="rounded border border-slate-200 px-3 py-1 transition hover:bg-slate-50 disabled:opacity-40"
                :disabled="currentPage === 1"
                @click="$emit('prev')"
            >
                Previous
            </button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button
                type="button"
                class="rounded border border-slate-200 px-3 py-1 transition hover:bg-slate-50 disabled:opacity-40"
                :disabled="currentPage === totalPages"
                @click="$emit('next')"
            >
                Next
            </button>
        </div>
    </div>
</template>
