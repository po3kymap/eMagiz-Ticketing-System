<script setup>
defineProps({
    unreadCount: {
        type: Number,
        default: 0,
    },
});

defineEmits(['click']);
</script>

<template>
    <button
        type="button"
        class="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Notifications"
        @click="$emit('click')"
    >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        <span
            v-if="unreadCount > 0"
            class="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"
        />
    </button>
</template>
