export default {
    emits: ['click'],
    props: {
        unreadCount: {
            type: Number,
            default: 0
        }
    },
    template: `
        <button class="relative text-slate-400 hover:text-slate-600 transition-colors" type="button" aria-label="Notifications" @click="$emit('click')">
            <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center px-1">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
        </button>
    `
};
