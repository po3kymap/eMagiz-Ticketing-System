<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
    ArcElement,
    Chart,
    DoughnutController,
    Legend,
    Tooltip,
} from 'chart.js';
import { getTicketTypeMeta } from '@js/domain/tickets/ticketCatalog';

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

const props = defineProps({
    tickets: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const canvasRef = ref(null);
let chartInstance = null;

const chartData = computed(() => {
    const counts = {};

    for (const ticket of props.tickets) {
        const type = String(ticket.type || 'UNKNOWN').toUpperCase();
        counts[type] = (counts[type] || 0) + 1;
    }

    const labels = Object.keys(counts);
    return {
        labels: labels.map((key) => getTicketTypeMeta(key).label),
        datasets: [{
            data: labels.map((key) => counts[key]),
            backgroundColor: labels.map((key) => getTicketTypeMeta(key).chartColor || '#94a3b8'),
            borderWidth: 0,
            hoverOffset: 4,
        }],
        legendItems: labels.map((key) => ({
            key,
            label: getTicketTypeMeta(key).label,
            count: counts[key],
            color: getTicketTypeMeta(key).chartColor || '#94a3b8',
        })),
    };
});

const hasData = computed(() => chartData.value.labels.length > 0);

async function renderChart() {
    if (props.loading || !hasData.value) {
        chartInstance?.destroy();
        chartInstance = null;
        return;
    }

    await nextTick();

    if (!canvasRef.value) {
        return;
    }

    chartInstance?.destroy();

    chartInstance = new Chart(canvasRef.value, {
        type: 'doughnut',
        data: {
            labels: chartData.value.labels,
            datasets: chartData.value.datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`,
                    },
                },
            },
        },
    });
}

watch(
    () => [props.loading, props.tickets, hasData.value],
    renderChart,
    { deep: true, flush: 'post' },
);

onBeforeUnmount(() => {
    chartInstance?.destroy();
    chartInstance = null;
});
</script>

<template>
    <section class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Tickets by Type</h2>

        <div v-if="loading" class="mt-8 flex flex-1 items-center justify-center text-sm text-slate-400">
            Loading chart…
        </div>

        <div v-else-if="!hasData" class="mt-8 flex flex-1 items-center justify-center text-sm text-slate-400">
            No ticket data yet.
        </div>

        <div v-else class="mt-4 flex flex-1 items-center gap-4">
            <div class="relative h-44 w-44 shrink-0">
                <canvas ref="canvasRef" class="block h-full w-full" />
            </div>

            <ul class="min-w-0 flex-1 space-y-2.5">
                <li
                    v-for="item in chartData.legendItems"
                    :key="item.key"
                    class="flex items-center justify-between gap-3 text-sm"
                >
                    <span class="flex min-w-0 items-center gap-2 text-slate-600">
                        <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: item.color }" />
                        {{ item.label }}
                    </span>
                    <span class="font-semibold text-slate-900">{{ item.count }}</span>
                </li>
            </ul>
        </div>
    </section>
</template>
