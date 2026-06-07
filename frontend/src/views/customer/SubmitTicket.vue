<script>
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import PrioritySelector from '@/components/submit/PrioritySelector.vue';
import SubmitTicketSidebar from '@/components/submit/SubmitTicketSidebar.vue';
import { TICKET_TYPES } from '@js/domain/tickets/ticketCatalog';
import { createTicket } from '@api/tickets';

const TICKET_TYPE_OPTIONS = Object.values(TICKET_TYPES);

function buildDescription({ description, environment, businessImpact }) {
    const sections = [description.trim()];

    if (environment.trim()) {
        sections.push(`Related Environment / Integration:\n${environment.trim()}`);
    }

    if (businessImpact.trim()) {
        sections.push(`Business Impact:\n${businessImpact.trim()}`);
    }

    return sections.join('\n\n');
}

export default {
    name: 'CustomerSubmitTicket',
    components: {
        CustomerLayout,
        PrioritySelector,
        SubmitTicketSidebar,
    },
    data() {
        return {
            title: '',
            type: '',
            priority: 'MEDIUM',
            description: '',
            environment: '',
            businessImpact: '',
            loading: false,
            error: '',
            ticketTypes: TICKET_TYPE_OPTIONS,
        };
    },
    methods: {
        async onSubmit() {
            this.error = '';

            if (!this.title.trim()) {
                this.error = 'Ticket title is required.';
                return;
            }

            if (!this.type) {
                this.error = 'Ticket type is required.';
                return;
            }

            if (!this.description.trim()) {
                this.error = 'Description is required.';
                return;
            }

            this.loading = true;

            try {
                await createTicket({
                    title: this.title.trim(),
                    type: this.type,
                    description: buildDescription({
                        description: this.description,
                        environment: this.environment,
                        businessImpact: this.businessImpact,
                    }),
                    priority: this.priority,
                    status: 'OPEN',
                });

                await this.$router.push('/customer/tickets');
            } catch (err) {
                this.error = err.message || 'Failed to submit ticket.';
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<template>
    <CustomerLayout>
        <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Submit a Ticket</h1>
                <p class="mt-1 text-sm text-slate-500">Tell us what went wrong and we'll route it to the right team.</p>
            </div>

            <div class="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                <form class="space-y-8" @submit.prevent="onSubmit">
                    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-900">Ticket Information</h2>

                        <div class="mt-6 space-y-6">
                            <div>
                                <label for="ticket-title" class="mb-1 block text-sm font-medium text-slate-700">
                                    Ticket Title <span class="text-red-500">*</span>
                                </label>
                                <input
                                    id="ticket-title"
                                    v-model="title"
                                    type="text"
                                    placeholder="e.g. API integration failure in production environment"
                                    class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                    :disabled="loading"
                                />
                                <p class="mt-2 text-xs text-slate-500">
                                    Be specific and descriptive. Include the system and environment if known.
                                </p>
                            </div>

                            <div>
                                <label for="ticket-type" class="mb-1 block text-sm font-medium text-slate-700">
                                    Ticket Type <span class="text-red-500">*</span>
                                </label>
                                <select
                                    id="ticket-type"
                                    v-model="type"
                                    class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                    :disabled="loading"
                                >
                                    <option disabled value="">Select type...</option>
                                    <option
                                        v-for="option in ticketTypes"
                                        :key="option.key"
                                        :value="option.key"
                                    >
                                        {{ option.label }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <p class="mb-3 text-sm font-medium text-slate-700">Priority</p>
                                <PrioritySelector v-model="priority" />
                            </div>
                        </div>
                    </section>

                    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-900">Description &amp; Details</h2>

                        <div class="mt-6 space-y-6">
                            <div>
                                <label for="ticket-description" class="mb-1 block text-sm font-medium text-slate-700">
                                    Description <span class="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="ticket-description"
                                    v-model="description"
                                    rows="6"
                                    placeholder="Describe what happened, when it started, what you expected, and any error messages..."
                                    class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                    :disabled="loading"
                                />
                            </div>

                            <div>
                                <label for="ticket-environment" class="mb-1 block text-sm font-medium text-slate-700">
                                    Related Environment / Integration
                                </label>
                                <input
                                    id="ticket-environment"
                                    v-model="environment"
                                    type="text"
                                    placeholder="e.g. Production – SAP S4/HANA Connector, Version 3.2"
                                    class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                    :disabled="loading"
                                />
                            </div>

                            <div>
                                <label for="ticket-impact" class="mb-1 block text-sm font-medium text-slate-700">
                                    Business Impact (optional)
                                </label>
                                <textarea
                                    id="ticket-impact"
                                    v-model="businessImpact"
                                    rows="4"
                                    placeholder="Describe how this issue is impacting your business operations..."
                                    class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                    :disabled="loading"
                                />
                            </div>
                        </div>
                    </section>

                    <p
                        v-if="error"
                        class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                        {{ error }}
                    </p>

                    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            class="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            :disabled="loading"
                            @click="$router.push('/customer/tickets')"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                            :disabled="loading"
                        >
                            {{ loading ? 'Submitting...' : 'Submit Ticket' }}
                        </button>
                    </div>
                </form>

                <SubmitTicketSidebar />
            </div>
        </div>
    </CustomerLayout>
</template>
