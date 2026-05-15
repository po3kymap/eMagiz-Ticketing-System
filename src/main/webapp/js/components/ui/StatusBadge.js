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
                assigned: 'bg-blue-50 text-blue-700 border-blue-100',
                'in progress': 'bg-indigo-50 text-indigo-700 border-indigo-100',
                unassigned: 'bg-amber-50 text-amber-700 border-amber-100',
                resolved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                closed: 'bg-slate-100 text-slate-700 border-slate-200'
            };
            return map[this.normalizedValue] || map.assigned;
        }
    },
    template: `
        <span :class="['px-2.5 py-1 rounded-full text-xs font-medium border', badgeClasses]">
            {{ value }}
        </span>
    `
};
