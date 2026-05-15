export default {
    props: {
        section: {
            type: String,
            default: 'Customer Portal'
        },
        title: {
            type: String,
            default: 'Dashboard'
        }
    },
    template: `
        <div class="w-96">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">{{ section }}</p>
            <h2 class="text-lg font-semibold text-slate-900 leading-tight">{{ title }}</h2>
        </div>
    `
};
