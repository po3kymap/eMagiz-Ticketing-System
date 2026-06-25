<script setup>
import { computed, ref, watch } from 'vue';
import PrioritySelector from '@/components/submit/PrioritySelector.vue';
import { createTicket } from '@api/tickets';
import { CUSTOMER_TICKET_TYPE_KEYS, TICKET_TYPES } from '@js/domain/tickets/ticketCatalog';
import { isCustomerRole } from '@js/domain/auth/roles';

const props = defineProps({
    customers: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['created', 'close']);

const mode = ref('customer');
const title = ref('');
const type = ref('');
const priority = ref('MEDIUM');
const description = ref('');
const customerId = ref('');
const loading = ref(false);
const error = ref('');

const customerOptions = computed(() =>
    props.customers.filter((user) => isCustomerRole(user.role)),
);

const customerTypeOptions = computed(() =>
    CUSTOMER_TICKET_TYPE_KEYS.map((key) => TICKET_TYPES[key]),
);

watch(mode, (nextMode) => {
    error.value = '';
    if (nextMode === 'internal') {
        type.value = 'INTERNAL';
        customerId.value = '';
    } else {
        type.value = '';
    }
});

function resetForm() {
    mode.value = 'customer';
    title.value = '';
    type.value = '';
    priority.value = 'MEDIUM';
    description.value = '';
    customerId.value = '';
    error.value = '';
    loading.value = false;
}

function onClose() {
    resetForm();
    emit('close');
}

async function onSubmit() {
    error.value = '';

    if (!title.value.trim()) {
        error.value = 'Title is required.';
        return;
    }

    if (mode.value === 'customer') {
        if (!customerId.value) {
            error.value = 'Select a customer.';
            return;
        }
        if (!type.value) {
            error.value = 'Ticket type is required.';
            return;
        }
    }

    if (!description.value.trim()) {
        error.value = 'Description is required.';
        return;
    }

    loading.value = true;

    try {
        const payload = {
            title: title.value.trim(),
            description: description.value.trim(),
            priority: priority.value,
            status: 'OPEN',
        };

        if (mode.value === 'internal') {
            payload.type = 'INTERNAL';
        } else {
            payload.type = type.value;
            payload.creatorId = Number(customerId.value);
        }

        const created = await createTicket(payload);
        emit('created', created);
        resetForm();
    } catch (err) {
        error.value = err.message || 'Failed to create ticket.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="onClose" />
        <div class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div class="border-b border-slate-100 px-6 py-5">
                <h3 class="text-lg font-semibold text-slate-900">Create Ticket</h3>
                <p class="mt-1 text-sm text-slate-500">
                    Log a customer request or an internal staff ticket.
                </p>
            </div>

            <form class="flex-1 overflow-y-auto px-6 py-5 space-y-5" @submit.prevent="onSubmit">
                <div class="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                    <button
                        type="button"
                        class="rounded-lg px-3 py-2 text-sm font-medium transition"
                        :class="mode === 'customer'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'"
                        @click="mode = 'customer'"
                    >
                        Customer ticket
                    </button>
                    <button
                        type="button"
                        class="rounded-lg px-3 py-2 text-sm font-medium transition"
                        :class="mode === 'internal'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'"
                        @click="mode = 'internal'"
                    >
                        Internal ticket
                    </button>
                </div>

                <p v-if="mode === 'internal'" class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    Internal tickets are visible to Support and Consultants only.
                </p>

                <div v-if="mode === 'customer'">
                    <label for="create-ticket-customer" class="mb-1 block text-sm font-medium text-slate-700">
                        Customer <span class="text-red-500">*</span>
                    </label>
                    <select
                        id="create-ticket-customer"
                        v-model="customerId"
                        class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        :disabled="loading"
                    >
                        <option value="" disabled>Select customer...</option>
                        <option
                            v-for="customer in customerOptions"
                            :key="customer.id"
                            :value="customer.id"
                        >
                            {{ customer.username }}{{ customer.company ? ` · ${customer.company}` : '' }}
                        </option>
                    </select>
                </div>

                <div>
                    <label for="create-ticket-title" class="mb-1 block text-sm font-medium text-slate-700">
                        Title <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="create-ticket-title"
                        v-model="title"
                        type="text"
                        class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        placeholder="Brief summary of the issue"
                        :disabled="loading"
                    />
                </div>

                <div v-if="mode === 'customer'">
                    <label for="create-ticket-type" class="mb-1 block text-sm font-medium text-slate-700">
                        Type <span class="text-red-500">*</span>
                    </label>
                    <select
                        id="create-ticket-type"
                        v-model="type"
                        class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        :disabled="loading"
                    >
                        <option value="" disabled>Select type...</option>
                        <option
                            v-for="option in customerTypeOptions"
                            :key="option.key"
                            :value="option.key"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-slate-700">Priority</p>
                    <PrioritySelector v-model="priority" />
                </div>

                <div>
                    <label for="create-ticket-description" class="mb-1 block text-sm font-medium text-slate-700">
                        Description <span class="text-red-500">*</span>
                    </label>
                    <textarea
                        id="create-ticket-description"
                        v-model="description"
                        rows="4"
                        class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        placeholder="Describe the issue or internal task..."
                        :disabled="loading"
                    />
                </div>

                <p
                    v-if="error"
                    class="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                    {{ error }}
                </p>
            </form>

            <div class="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                <button
                    type="button"
                    class="rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
                    :disabled="loading"
                    @click="onClose"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
                    :disabled="loading"
                    @click="onSubmit"
                >
                    {{ loading ? 'Creating...' : 'Create Ticket' }}
                </button>
            </div>
        </div>
    </div>
</template>
