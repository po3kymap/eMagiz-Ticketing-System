<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    userName: {
        type: String,
        default: 'User',
    },
    userEmail: {
        type: String,
        default: '',
    },
    userInitials: {
        type: String,
        default: 'U',
    },
});

const route = useRoute();
const collapsed = ref(false);

const navItems = [
    {
        label: 'Dashboard',
        to: '/customer',
        icon: 'dashboard',
    },
    {
        label: 'My Tickets',
        to: '/customer/tickets',
        icon: 'tickets',
    },
    {
        label: 'Submit Ticket',
        to: '/customer/submit',
        icon: 'submit',
    },
    {
        label: 'Knowledge / Help',
        to: '/customer/help',
        icon: 'help',
    },
    {
        label: 'Settings',
        to: '/customer/settings',
        icon: 'settings',
    },
];

const sidebarClass = computed(() =>
    collapsed.value ? 'w-[4.5rem]' : 'w-64',
);

function isActive(path) {
    if (path === '/customer') {
        return route.path === '/customer' || route.path === '/customer/';
    }
    return route.path === path || route.path.startsWith(`${path}/`);
}
</script>

<template>
    <aside
        class="flex shrink-0 flex-col bg-[#0f172a] text-slate-300 transition-[width] duration-200"
        :class="sidebarClass"
    >
        <!-- Brand -->
        <div class="flex h-16 items-center justify-between border-b border-slate-800 px-4">
            <div class="flex min-w-0 items-center gap-2.5">
                <img
                    src="/img/logo.png"
                    alt="eMagiz"
                    class="h-8 w-8 shrink-0 rounded-lg object-contain"
                />
                <div v-if="!collapsed" class="min-w-0 truncate leading-tight">
                    <span class="text-sm font-semibold text-white">eMagiz </span>
                    <span class="text-sm font-semibold text-emerald-400">Tickets</span>
                </div>
            </div>
            <button
                type="button"
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
                @click="collapsed = !collapsed"
            >
                <svg
                    class="h-4 w-4 transition-transform duration-200"
                    :class="collapsed ? 'rotate-180' : ''"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>

        <!-- Nav -->
        <nav class="flex-1 overflow-y-auto px-3 py-4">
            <p
                v-if="!collapsed"
                class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500"
            >
                Customer Portal
            </p>

            <ul class="space-y-1">
                <li v-for="item in navItems" :key="item.to">
                    <RouterLink
                        :to="item.to"
                        class="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
                        :class="[
                            isActive(item.to)
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
                            collapsed ? 'justify-center px-2' : '',
                        ]"
                        :title="collapsed ? item.label : undefined"
                    >
                        <span
                            v-if="isActive(item.to)"
                            class="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400"
                            aria-hidden="true"
                        />

                        <!-- Dashboard -->
                        <svg
                            v-if="item.icon === 'dashboard'"
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            aria-hidden="true"
                        >
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" />
                            <rect x="14" y="14" width="7" height="7" rx="1.5" />
                        </svg>

                        <!-- My Tickets -->
                        <svg xmlns="http://www.w3.org/2000/svg"
                        v-else-if="item.icon === 'tickets'" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5 shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                        </svg>


                        <!-- Submit Ticket -->
                        <svg
                            v-else-if="item.icon === 'submit'"
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path stroke-linecap="round" d="M12 8v8M8 12h8" />
                        </svg>

                        <!-- Knowledge / Help -->
                        <svg
                            v-else-if="item.icon === 'help'"
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            aria-hidden="true"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                            <path stroke-linecap="round" d="M9 7h6M9 11h4" />
                        </svg>

                        <!-- Settings -->
                        <svg
                            v-else-if="item.icon === 'settings'"
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            aria-hidden="true"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                        </svg>

                        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
                    </RouterLink>
                </li>
            </ul>
        </nav>

        <!-- User -->
        <div class="border-t border-slate-800 p-4">
            <div class="flex items-center gap-3" :class="collapsed ? 'justify-center' : ''">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                    {{ userInitials }}
                </div>
                <div v-if="!collapsed" class="min-w-0">
                    <p class="truncate text-sm font-medium text-white">{{ userName }}</p>
                    <p v-if="userEmail" class="truncate text-xs text-slate-500">{{ userEmail }}</p>
                </div>
            </div>
        </div>
    </aside>
</template>
