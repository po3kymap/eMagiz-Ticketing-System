<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    LinearScale,
    Tooltip,
} from 'chart.js';
import { TICKET_PRIORITIES } from '@js/domain/tickets/ticketCatalog';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

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

const PRIORITY_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const PRIORITY_BAR_COLORS = {
    CRITICAL: '#ef4444',
    HIGH: '#f97316',
    MEDIUM: '#eab308',
    LOW: '#94a3b8',
};

const chartData = computed(() => {
    const counts = Object.fromEntries(PRIORITY_ORDER.map((key) => [key, 0]));

    for (const ticket of props.tickets) {
        const priority = String(ticket.priority || '').toUpperCase();
        if (counts[priority] !== undefined) {
            counts[priority] += 1;
        }
    }

    return {
        labels: PRIORITY_ORDER.map((key) => TICKET_PRIORITIES[key].label),
        values: PRIORITY_ORDER.map((key) => counts[key]),
        colors: PRIORITY_ORDER.map((key) => PRIORITY_BAR_COLORS[key]),
        legendItems: PRIORITY_ORDER.map((key) => ({
            key,
            label: TICKET_PRIORITIES[key].label,
            count: counts[key],
            color: PRIORITY_BAR_COLORS[key],
        })),
        max: Math.max(...PRIORITY_ORDER.map((key) => counts[key]), 1),
    };
});

async function renderChart() {
    if (props.loading) {
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
        type: 'bar',
        data: {
            labels: chartData.value.labels,
            datasets: [{
                data: chartData.value.values,
                backgroundColor: chartData.value.colors,
                borderRadius: 6,
                barThickness: 18,
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.parsed.x} tickets`,
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    suggestedMax: chartData.value.max + 1,
                    grid: { color: '#f1f5f9' },
                    ticks: { stepSize: 1, color: '#94a3b8', font: { size: 11 } },
                    border: { display: false },
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#64748b', font: { size: 12 } },
                    border: { display: false },
                },
            },
        },
    });
}

watch(
    () => [props.loading, props.tickets, chartData.value],
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
        <h2 class="text-lg font-semibold text-slate-900">Priority Breakdown</h2>

        <div v-if="loading" class="mt-8 flex flex-1 items-center justify-center text-sm text-slate-400">
            Loading chart…
        </div>

        <div v-else class="mt-4 flex flex-1 flex-col">
            <div class="relative h-44 w-full">
                <canvas ref="canvasRef" class="block h-full w-full" />
            </div>

            <ul class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                <li
                    v-for="item in chartData.legendItems"
                    :key="item.key"
                    class="flex items-center justify-between gap-2 text-sm"
                >
                    <span class="flex items-center gap-2 text-slate-600">
                        <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: item.color }" />
                        {{ item.label }}
                    </span>
                    <span class="font-semibold text-slate-900">{{ item.count }}</span>
                </li>
            </ul>
        </div>
    </section>
</template>
