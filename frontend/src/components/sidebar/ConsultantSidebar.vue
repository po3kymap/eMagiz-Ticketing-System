<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    userName: {
        type: String,
        default: 'Consultant',
    },
    userEmail: {
        type: String,
        default: '',
    },
    userInitials: {
        type: String,
        default: 'C',
    },
    assignedCount: {
        type: Number,
        default: 0,
    },
});

const route = useRoute();
const collapsed = ref(false);

const navItems = computed(() => [
    {
        label: 'Dashboard',
        to: '/consultant',
        icon: 'dashboard',
    },
    {
        label: 'Assigned to Me',
        to: '/consultant/assigned',
        icon: 'assigned',
        badge: props.assignedCount > 0 ? props.assignedCount : null,
    },
    {
        label: 'Settings',
        to: '/consultant/settings',
        icon: 'settings',
    },
]);

const sidebarClass = computed(() =>
    collapsed.value ? 'w-[4.5rem]' : 'w-64',
);

function isActive(path) {
    if (path === '/consultant') {
        return route.path === '/consultant' || route.path === '/consultant/';
    }
    return route.path === path || route.path.startsWith(`${path}/`);
}
</script>

<template>
    <aside
        class="flex shrink-0 flex-col bg-[#0f172a] text-slate-300 transition-[width] duration-200"
        :class="sidebarClass"
    >
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
                class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-400"
            >
                Consultant View
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

                        <svg
                            v-else-if="item.icon === 'assigned'"
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            aria-hidden="true"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9 12 2 2 4-4" />
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
                            class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-500 px-1.5 text-[11px] font-semibold text-white"
                        >
                            {{ item.badge }}
                        </span>
                    </RouterLink>
                </li>
            </ul>
        </nav>

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
