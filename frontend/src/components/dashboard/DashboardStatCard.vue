<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
    value: {
        type: [Number, String],
        default: 0,
    },
    tone: {
        type: String,
        default: 'blue',
        validator: (value) => ['blue', 'amber', 'emerald', 'violet', 'red', 'orange'].includes(value),
    },
});

const toneClasses = {
    blue: {
        card: 'border-blue-100 bg-blue-50/40',
        icon: 'bg-blue-100 text-blue-600',
    },
    amber: {
        card: 'border-amber-100 bg-amber-50/40',
        icon: 'bg-amber-100 text-amber-600',
    },
    emerald: {
        card: 'border-emerald-100 bg-emerald-50/40',
        icon: 'bg-emerald-100 text-emerald-600',
    },
    violet: {
        card: 'border-violet-100 bg-violet-50/40',
        icon: 'bg-violet-100 text-violet-600',
    },
    red: {
        card: 'border-red-100 bg-red-50/40',
        icon: 'bg-red-100 text-red-600',
    },
    orange: {
        card: 'border-orange-100 bg-orange-50/40',
        icon: 'bg-orange-100 text-orange-600',
    },
};
</script>

<template>
    <div
        class="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm"
        :class="toneClasses[tone].card"
    >
        <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            :class="toneClasses[tone].icon"
        >
            <slot name="icon" />
        </div>

        <div>
            <p class="text-3xl font-semibold leading-none text-slate-900">{{ value }}</p>
            <p class="mt-2 text-sm text-slate-500">{{ label }}</p>
        </div>
    </div>
</template>
