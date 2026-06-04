<script setup>
defineProps({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: '',
    },
    initials: {
        type: String,
        required: true,
    },
});

defineEmits(['logout']);
</script>

<template>
    <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                {{ initials }}
            </div>
            <div class="hidden text-left leading-tight sm:block">
                <p class="text-sm font-semibold text-slate-900">{{ name }}</p>
                <p v-if="email" class="text-xs text-slate-500">{{ email }}</p>
            </div>
        </div>

        <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Log out"
            @click="$emit('logout')"
        >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
        </button>
    </div>
</template>
