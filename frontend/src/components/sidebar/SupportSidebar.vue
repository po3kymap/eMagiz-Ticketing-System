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
    queueCount: {
        type: Number,
        default: 0,
    },
});

const route = useRoute();
const collapsed = ref(false);

const navItems = computed(() => [
    {
        label: 'Dashboard',
        to: '/support',
        icon: 'dashboard',
    },
    {
        label: 'Ticket Queue',
        to: '/support/queue',
        icon: 'queue',
        badge: props.queueCount > 0 ? props.queueCount : null,
    },
    {
        label: 'Triage Board',
        to: '/support/triage',
        icon: 'triage',
    },
    {
        label: 'Users',
        to: '/support/users',
        icon: 'users',
    },
    {
        label: 'Audit Log',
        to: '/support/audit',
        icon: 'audit',
    },
    {
        label: 'Settings',
        to: '/support/settings',
        icon: 'settings',
    },
]);

const sidebarClass = computed(() =>
    collapsed.value ? 'w-[4.5rem]' : 'w-64',
);

function isActive(path) {
    if (path === '/support') {
        return route.path === '/support' || route.path === '/support/';
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
        
        <nav class="flex-1 overflow-y-auto px-3 py-4">
            <p
                v-if="!collapsed"
                class="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-500/90"
            >
                Support — Admin
            </p>

            <ul class="space-y-1">
                <li v-for="item in navItems" :key="item.to">
                    <RouterLink
                        :to="item.to"
                        class="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
                        :class="[
                            isActive(item.to)
                                ? 'bg-teal-900/40 text-emerald-400 ring-1 ring-inset ring-teal-500/20'
                                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white',
                            collapsed ? 'justify-center px-2' : '',
                        ]"
                        :title="collapsed ? item.label : undefined"
                    >
                        <svg
                            v-if="item.icon === 'dashboard'"
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>

                        <svg
                            v-else-if="item.icon === 'queue'"
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>

                        <svg
                            v-else-if="item.icon === 'triage'"
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                            <path d="M9 14h6" />
                            <path d="M9 10h6" />
                        </svg>

                        <svg
                            v-else-if="item.icon === 'users'"
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>

                        <svg
                            v-else-if="item.icon === 'audit'"
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>

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

                        <span v-if="!collapsed" class="min-w-0 flex-1 truncate">{{ item.label }}</span>

                        <span
                            v-if="!collapsed && item.badge"
                            class="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-emerald-400 px-1.5 text-[11px] font-bold text-slate-900"
                        >
                            {{ item.badge }}
                        </span>
                    </RouterLink>
                </li>
            </ul>
        </nav>

        <div class="border-t border-slate-800 p-4">
            <div class="flex items-center gap-3" :class="collapsed ? 'justify-center' : ''">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/80 text-sm font-semibold text-white">
                    {{ userInitials }}
                </div>
                <div v-if="!collapsed" class="min-w-0">
                    <p class="truncate text-sm font-semibold text-white">{{ userName }}</p>
                    <p v-if="userEmail" class="truncate text-sm text-slate-400">{{ userEmail }}</p>
                </div>
            </div>
        </div>
    </aside>
</template>