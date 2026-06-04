<script setup>
defineProps({
    role: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <div
        class="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700"
        :title="`Signed in as ${role}`"
    >
        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
            <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 9.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM4.75 16.25v-.5c0-2.9 2.35-5.25 5.25-5.25s5.25 2.35 5.25 5.25v.5a.75.75 0 0 1-.75.75h-9.5a.75.75 0 0 1-.75-.75Z" />
            </svg>
        </span>
        <span>Role: <span class="font-semibold text-slate-900">{{ role }}</span></span>
    </div>
</template>
