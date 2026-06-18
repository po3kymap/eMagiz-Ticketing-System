<script setup>
defineProps({
    searchQuery: { type: String, default: '' },
    showFilters: { type: Boolean, default: false },
    filterStatus: { type: String, default: '' },
    filterPriority: { type: String, default: '' },
    filterType: { type: String, default: '' },
    statusOptions: { type: Array, default: () => [] },
    priorityOptions: { type: Array, default: () => [] },
    typeOptions: { type: Array, default: () => [] },
    hasActiveFilters: { type: Boolean, default: false },
    searchPlaceholder: { type: String, default: 'Search by title or ID...' },
    formatFilterLabel: { type: Function, required: true },
});

defineEmits([
    'update:searchQuery',
    'update:showFilters',
    'update:filterStatus',
    'update:filterPriority',
    'update:filterType',
    'search-input',
    'reset-filters',
]);
</script>

<template>
    <div class="space-y-3">
        <div class="flex gap-3">
            <div class="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
                <svg class="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    :value="searchQuery"
                    type="search"
                    :placeholder="searchPlaceholder"
                    class="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                    @input="$emit('update:searchQuery', $event.target.value); $emit('search-input')"
                />
            </div>

            <button
                type="button"
                class="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition"
                :class="showFilters
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                @click="$emit('update:showFilters', !showFilters)"
            >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
                Filters
                <span v-if="hasActiveFilters" class="h-2 w-2 rounded-full bg-teal-500" />
            </button>
        </div>

        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
        >
            <div v-if="showFilters" class="flex flex-wrap gap-3">
                <select
                    :value="filterStatus"
                    class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-teal-500"
                    @change="$emit('update:filterStatus', $event.target.value); $emit('search-input')"
                >
                    <option value="">All Statuses</option>
                    <option v-for="status in statusOptions" :key="status" :value="status">
                        {{ formatFilterLabel(status) }}
                    </option>
                </select>

                <select
                    :value="filterPriority"
                    class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-teal-500"
                    @change="$emit('update:filterPriority', $event.target.value); $emit('search-input')"
                >
                    <option value="">All Priorities</option>
                    <option v-for="priority in priorityOptions" :key="priority" :value="priority">
                        {{ formatFilterLabel(priority) }}
                    </option>
                </select>

                <select
                    :value="filterType"
                    class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-teal-500"
                    @change="$emit('update:filterType', $event.target.value); $emit('search-input')"
                >
                    <option value="">All Types</option>
                    <option v-for="type in typeOptions" :key="type" :value="type">
                        {{ formatFilterLabel(type) }}
                    </option>
                </select>

                <button
                    v-if="hasActiveFilters"
                    type="button"
                    class="px-2 text-sm text-slate-400 transition hover:text-slate-600"
                    @click="$emit('reset-filters')"
                >
                    Clear all
                </button>
            </div>
        </Transition>
    </div>
</template>
