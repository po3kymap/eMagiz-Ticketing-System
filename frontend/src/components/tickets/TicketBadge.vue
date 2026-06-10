<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
    badgeClass: {
        type: String,
        default: 'bg-slate-100 text-slate-700 ring-slate-200',
    },
    showDot: {
        type: Boolean,
        default: false,
    },
    dotClass: {
        type: String,
        default: 'bg-slate-400',
    },
});
</script>

<template>
    <span
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
        :class="badgeClass"
    >
        <span
            v-if="showDot"
            class="h-1.5 w-1.5 shrink-0 rounded-full"
            :class="dotClass"
            aria-hidden="true"
        />
        {{ label }}
    </span>
</template>
