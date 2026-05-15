export default {
    props: ['count', 'title', 'type', 'iconPath'],
    computed: {
        colorClasses() {
            const types = {
                blue: 'border-blue-200 bg-blue-50 text-blue-600 hover:border-blue-300',
                amber: 'border-amber-200 bg-amber-50 text-amber-500 hover:border-amber-300',
                emerald: 'border-emerald-200 bg-emerald-50 text-emerald-500 hover:border-emerald-300',
                indigo: 'border-indigo-200 bg-indigo-50 text-indigo-500 hover:border-indigo-300'
            };
            return types[this.type] || types.blue;
        }
    },
    template: `
        <div :class="['bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md', colorClasses]">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shrink-0', colorClasses.split(' ')[1]]">
                <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
                </svg>
            </div>
            <div class="flex flex-col">
                <span class="text-2xl font-bold text-slate-900">{{ count }}</span>
                <span class="text-sm font-medium text-slate-500">{{ title }}</span>
            </div>
        </div>
    `
}