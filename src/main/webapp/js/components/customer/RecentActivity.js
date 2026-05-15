const defaultItems = [
    { id: 1, title: 'Assigned to consultant', details: 'TKT-2047 · 2h ago', dot: 'indigo' },
    { id: 2, title: 'Reviewed by support', details: 'TKT-2047 · 22h ago', dot: 'amber' },
    { id: 3, title: 'Ticket submitted — API integration failure', details: 'TKT-2047 · 1 day ago', dot: 'blue' },
    { id: 4, title: 'Resolved by consultant', details: 'TKT-2042 · 3 days ago', dot: 'emerald' },
    { id: 5, title: 'Status updated to Resolved', details: 'TKT-2036 · 12 days ago', dot: 'teal' }
];

export default {
    props: {
        items: {
            type: Array,
            default() {
                return defaultItems;
            }
        }
    },
    methods: {
        dotClass(dot) {
            const map = {
                indigo: 'bg-indigo-500',
                emerald: 'bg-emerald-500',
                teal: 'bg-teal-500',
                blue: 'bg-blue-500',
                amber: 'bg-amber-500'
            };
            return map[dot] || map.blue;
        }
    },
    template: `
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 class="text-2xl font-semibold text-slate-900 mb-5">Recent Activity</h2>
            <div class="space-y-4">
                <div v-for="item in items" :key="item.id" class="flex items-start gap-4">
                    <span :class="['mt-2 w-3 h-3 rounded-full shrink-0', dotClass(item.dot)]"></span>
                    <div>
                        <p class="text-base font-medium text-slate-800 leading-5">{{ item.title }}</p>
                        <p class="text-sm text-slate-400 mt-1">{{ item.details }}</p>
                    </div>
                </div>
            </div>
        </div>
    `
};
