export default {
    props: {
        name: {
            type: String,
            default: 'Sarah Mitchell'
        },
        email: {
            type: String,
            default: 's.mitchell@acmecorp.com'
        }
    },
    computed: {
        initials() {
            const parts = this.name.trim().split(/\s+/).filter(Boolean);
            if (!parts.length) {
                return 'NA';
            }
            return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('');
        }
    },
    template: `
        <div class="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer">
            <div class="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">{{ initials }}</div>
            <div class="flex flex-col">
                <span class="text-sm font-semibold text-slate-800">{{ name }}</span>
                <span class="text-xs text-slate-500">{{ email }}</span>
            </div>
        </div>
    `
};
