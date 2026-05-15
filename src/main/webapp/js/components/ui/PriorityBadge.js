export default {
    props: {
        value: {
            type: String,
            required: true
        }
    },
    computed: {
        normalizedValue() {
            return this.value.trim().toLowerCase();
        },
        badgeClasses() {
            const map = {
                critical: 'bg-red-50 text-red-700 border-red-100',
                high: 'bg-orange-50 text-orange-700 border-orange-100',
                medium: 'bg-amber-50 text-amber-700 border-amber-100',
                low: 'bg-slate-100 text-slate-600 border-slate-200'
            };
            return map[this.normalizedValue] || map.medium;
        },
        dotClasses() {
            const map = {
                critical: 'bg-red-500',
                high: 'bg-orange-500',
                medium: 'bg-amber-500',
                low: 'bg-slate-400'
            };
            return map[this.normalizedValue] || map.medium;
        }
    },
    template: `
        <span :class="['inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap', badgeClasses]">
            <span :class="['w-1.5 h-1.5 rounded-full', dotClasses]"></span>
            {{ value }}
        </span>
    `
};
