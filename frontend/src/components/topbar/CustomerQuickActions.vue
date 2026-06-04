<script setup>
// Кнопки — заглушки до страниц My Tickets / Submit Ticket
</script>

<template>
    <div class="flex w-full max-w-2xl items-center justify-between gap-4 rounded-xl bg-slate-100 px-4 py-2.5">
        <div class="min-w-0">
            <p class="text-sm font-medium text-slate-900">Need help?</p>
            <p class="text-xs text-slate-500">
                Submit a new request or check the status of your open tickets.
            </p>
        </div>
        <div class="flex shrink-0 items-center gap-2">
            <button
                type="button"
                class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
                My tickets
            </button>
            <button
                type="button"
                class="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
                New ticket
            </button>
        </div>
    </div>
</template>
