export default {
    props: {
        role: {
            type: String,
            default: 'Customer'
        }
    },
    template: `
        <div class="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-blue-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span class="text-xs font-medium text-slate-500">Role:</span>
            <span class="text-sm font-semibold text-slate-700">{{ role }}</span>
        </div>
    `
};
