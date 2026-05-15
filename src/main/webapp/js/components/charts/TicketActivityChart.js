export default {
    props: {
        labels: {
            type: Array,
            default() {
                return ['Apr 29', 'Apr 30', 'May 1', 'May 2', 'May 3'];
            }
        },
        values: {
            type: Array,
            default() {
                return [0, 1, 3, 2, 4];
            }
        }
    },
    data() {
        return {
            chart: null
        };
    },
    template: `
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 class="text-2xl font-semibold text-slate-900 mb-5">Ticket Activity (5 days)</h2>
            <div class="h-28 w-full relative">
                <canvas ref="activityChart"></canvas>
            </div>
            <div class="flex justify-between text-xs text-slate-400 mt-2">
                <span v-for="label in labels" :key="label">{{ label }}</span>
            </div>
        </div>
    `,
    mounted() {
        const verticalLinePlugin = {
            id: 'verticalLine',
            afterDraw: (chart) => {
                if (chart.tooltip?._active?.length) {
                    const activePoint = chart.tooltip._active[0];
                    const ctx = chart.ctx;
                    const x = activePoint.element.x;
                    const topY = chart.scales.y.top;
                    const bottomY = chart.scales.y.bottom;

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x, topY);
                    ctx.lineTo(x, bottomY);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#cbd5e1';
                    ctx.stroke();
                    ctx.restore();
                }
            }
        };

        const ctx = this.$refs.activityChart;
        if (ctx) {
            this.chart = new Chart(ctx, {
                type: 'line',
                plugins: [verticalLinePlugin],
                data: {
                    labels: this.labels,
                    datasets: [{
                        data: this.values,
                        borderColor: '#43978D',
                        backgroundColor: 'rgba(67, 151, 141, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#43978D',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: '#ffffff',
                            titleColor: '#0f172a',
                            bodyColor: '#43978D',
                            borderColor: '#e2e8f0',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return 'tickets : ' + context.parsed.y;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false,
                            min: 0,
                            max: Math.max(...this.values, 1)
                        }
                    },
                    layout: {
                        padding: {
                            top: 10,
                            bottom: 10
                        }
                    }
                }
            });
        }
    },
    beforeUnmount() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
};