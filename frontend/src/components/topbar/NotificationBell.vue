<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Bell, Loader2 } from 'lucide-vue-next';

const props = defineProps({
    unreadCount: {
        type: Number,
        default: 0,
    },
    items: {
        type: Array,
        default: () => [],
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['toggle', 'select', 'mark-all-read']);

const rootRef = ref(null);

function onClickOutside(event) {
    if (props.isOpen && rootRef.value && !rootRef.value.contains(event.target)) {
        emit('toggle', false);
    }
}

onMounted(() => {
    document.addEventListener('mousedown', onClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', onClickOutside);
});
</script>

<template>
    <div ref="rootRef" class="relative">
        <button
            type="button"
            class="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            :class="isOpen ? 'bg-slate-100 text-slate-700' : ''"
            aria-label="Notifications"
            @click="emit('toggle')"
        >
            <Bell class="h-5 w-5" />
            <span
                v-if="unreadCount > 0"
                class="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white"
            >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
        </button>

        <div
            v-if="isOpen"
            class="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        >
            <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 class="text-sm font-semibold text-slate-900">Activity</h3>
                <button
                    v-if="items.length"
                    type="button"
                    class="text-xs font-medium text-teal-600 transition hover:text-teal-700"
                    @click="emit('mark-all-read')"
                >
                    Mark all read
                </button>
            </div>

            <div v-if="isLoading" class="flex items-center justify-center gap-2 px-4 py-10 text-sm text-slate-400">
                <Loader2 class="h-4 w-4 animate-spin" />
                Loading…
            </div>

            <div v-else-if="error" class="px-4 py-8 text-center text-sm text-red-500">
                {{ error }}
            </div>

            <div v-else-if="!items.length" class="px-4 py-10 text-center text-sm text-slate-400">
                No recent activity
            </div>

            <ul v-else class="max-h-96 overflow-y-auto divide-y divide-slate-100">
                <li v-for="item in items" :key="item.id">
                    <button
                        type="button"
                        class="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        @click="emit('select', item)"
                    >
                        <span
                            class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                            :class="item.isUnread ? 'bg-teal-500' : 'bg-transparent'"
                        />
                        <span class="min-w-0 flex-1">
                            <span class="block text-sm font-medium text-slate-800">
                                {{ item.title }}
                            </span>
                            <span class="mt-0.5 block truncate text-xs text-slate-500">
                                {{ item.ticketLabel }}
                                <template v-if="item.ticketTitle"> · {{ item.ticketTitle }}</template>
                            </span>
                            <span class="mt-1 block text-[11px] text-slate-400">
                                {{ item.subtitle }} · {{ item.timeLabel }}
                            </span>
                        </span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>
