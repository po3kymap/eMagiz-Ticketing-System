<script setup>
import { ref, watch, computed } from 'vue';
import { formatTicketNumber, getTicketPriorityMeta } from '@js/domain/tickets/ticketCatalog';

const props = defineProps({
  searchFn: { type: Function, required: true },
});

const emit = defineEmits(['select']);

const query = ref('');
const results = ref([]);
const isLoading = ref(false);
const isFocused = ref(false);
const error = ref('');
const inputRef = ref(null);

let debounceTimer = null;

watch(query, (val) => {
  clearTimeout(debounceTimer);
  results.value = [];
  error.value = '';

  if (!val.trim()) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  debounceTimer = setTimeout(async () => {
    try {
      results.value = await props.searchFn(val.trim());
    } catch (err) {
      error.value = err.message || 'Search failed';
      results.value = [];
    } finally {
      isLoading.value = false;
    }
  }, 300);
});

const showDropdown = computed(() => isFocused.value && query.value.trim().length > 0);

function selectTicket(ticket) {
  emit('select', ticket);
  query.value = '';
  results.value = [];
  inputRef.value?.blur();
}

function clear() {
  query.value = '';
  results.value = [];
  error.value = '';
  inputRef.value?.focus();
}

function priorityDotClass(priority) {
  return getTicketPriorityMeta(priority).dotClass;
}
</script>

<template>
  <div class="relative w-full max-w-xl mx-auto">
    <div
      class="flex items-center gap-2 h-10 rounded-full border bg-white px-3 transition"
      :class="isFocused
        ? 'border-blue-400 ring-2 ring-blue-100 shadow-sm'
        : 'border-slate-200 hover:border-slate-300'"
    >
      <svg
        v-if="!isLoading"
        class="h-4 w-4 shrink-0 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35" />
      </svg>
      <svg
        v-else
        class="h-4 w-4 shrink-0 animate-spin text-blue-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
      </svg>

      <input
        ref="inputRef"
        v-model="query"
        type="search"
        placeholder="Search tickets by title or ID…"
        autocomplete="off"
        class="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none min-w-0"
        aria-label="Search tickets"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <button
        v-if="query"
        type="button"
        class="shrink-0 flex items-center justify-center h-5 w-5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        aria-label="Clear search"
        @mousedown.prevent="clear"
      >
        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="showDropdown"
        class="absolute top-12 left-0 z-50 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
      >
        <ul role="listbox">
          <li
            v-for="ticket in results"
            :key="ticket.id"
            class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 transition"
            role="option"
            @mousedown.prevent="selectTicket(ticket)"
          >
            <span class="text-xs font-mono text-slate-400 shrink-0">
              {{ formatTicketNumber(ticket.id) }}
            </span>
            <span class="text-sm text-slate-700 truncate">{{ ticket.title }}</span>
            <span
              class="ml-auto shrink-0 h-2 w-2 rounded-full"
              :class="priorityDotClass(ticket.priority)"
            />
          </li>
          <li
            v-if="error"
            class="px-4 py-3 text-sm text-red-500 text-center"
          >
            {{ error }}
          </li>
          <li
            v-else-if="!isLoading && results.length === 0"
            class="px-4 py-3 text-sm text-slate-400 text-center"
          >
            No tickets found for "<span class="font-medium text-slate-500">{{ query }}</span>"
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
