<script setup>
import { SLA_OVERVIEW_ROWS } from '@js/domain/tickets/ticketSla';

const tips = [
    'Include exact error messages or codes',
    'Specify the environment (production/staging)',
    'Mention when the issue started',
    'Describe the business impact clearly',
    'Include steps to reproduce if possible',
];

const slaRows = SLA_OVERVIEW_ROWS;
</script>

<template>
    <aside class="space-y-6">
        <section class="rounded-2xl bg-amber-50 p-6">
            <div class="flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 text-amber-900">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>

                <h2 class="text-base font-semibold text-amber-900">Tips for a great ticket</h2>
            </div>

            <ol class="mt-5 space-y-4">
                <li
                    v-for="(tip, index) in tips"
                    :key="index"
                    class="flex items-start gap-3"
                >
                    <span
                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-semibold text-amber-900"
                    >
                        {{ index + 1 }}
                    </span>
                    <span class="pt-0.5 text-sm leading-5 text-amber-900">{{ tip }}</span>
                </li>
            </ol>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex items-center gap-2.5">
                <svg
                    class="h-5 w-5 shrink-0 text-slate-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                </svg>
                <h2 class="text-base font-semibold text-slate-700">SLA Overview</h2>
            </div>

            <ul class="mt-5 space-y-3.5">
                <li
                    v-for="row in slaRows"
                    :key="row.label"
                    class="flex items-center gap-3"
                >
                    <span
                        class="inline-flex min-w-[3rem] shrink-0 items-center justify-center rounded-full px-1.5 py-1 text-xs font-semibold"
                        :class="row.badgeClass"
                    >
                        {{ row.label }}
                    </span>
                    <span class="text-sm text-slate-500">
                        Response: {{ row.response }} · Resolve: {{ row.resolve }}
                    </span>
                </li>
            </ul>
        </section>
    </aside>
</template>
