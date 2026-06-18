<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import {
    BookOpen,
    ChevronDown,
    CircleHelp,
    Clock,
    LifeBuoy,
    MessageSquare,
    Ticket,
} from 'lucide-vue-next';

const router = useRouter();

const openItems = ref(new Set(['getting-started-0']));

const faqSections = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: BookOpen,
        items: [
            {
                question: 'What is the eMagiz Customer Portal?',
                answer:
                    'The Customer Portal is your central place to submit support requests, track ticket progress, and communicate with the eMagiz support team. Everything related to your open issues lives in one place.',
            },
            {
                question: 'Who handles my tickets?',
                answer:
                    'New requests are reviewed by the Support team. After triage, tickets may be accepted and assigned to a Consultant for technical investigation. You will see status updates as your ticket moves through the workflow.',
            },
        ],
    },
    {
        id: 'submitting-tickets',
        title: 'Submitting Tickets',
        icon: Ticket,
        items: [
            {
                question: 'How do I submit a new ticket?',
                answer:
                    'Go to Submit Ticket in the sidebar, fill in a clear title and description, choose the ticket type and priority, then submit. Include environment details and business impact when relevant — this helps us resolve issues faster.',
            },
            {
                question: 'What ticket types should I use?',
                answer:
                    'Use Incident for something broken or not working as expected (e.g. integration errors, timeouts, failed jobs). Use RFC (Request for Change) when you need a configuration change, enhancement, or planned update.',
            },
            {
                question: 'How do I choose the right priority?',
                answer:
                    'Low — minor issue, workaround available. Medium — affects work but not critical. High — significant business impact, multiple users affected. Critical — production down or severe data/integration failure. When in doubt, describe the business impact clearly and Support will adjust if needed.',
            },
            {
                question: 'What makes a good ticket description?',
                answer:
                    'Include: what you expected, what actually happened, when it started, error messages or codes, affected system/environment, and steps to reproduce. Log excerpts in the description are very helpful.',
            },
        ],
    },
    {
        id: 'status-priority',
        title: 'Ticket Status & Lifecycle',
        icon: Clock,
        items: [
            {
                question: 'What do ticket statuses mean?',
                answer:
                    'Open — submitted, awaiting review. In Review — Support is evaluating your request. Accepted — approved for handling. Assigned — a Consultant is working on it. Denied — request declined (reason in conversation). Closed — resolved or completed.',
            },
            {
                question: 'Can I change priority after submitting?',
                answer:
                    'You can update priority from the ticket detail page while the ticket is still open. If the situation escalates, add a comment explaining why so the team can respond accordingly.',
            },
            {
                question: 'How long will my ticket take?',
                answer:
                    'Response times depend on priority and current queue volume. Critical and High tickets are handled first. You can follow progress on the ticket detail page via the lifecycle timeline and conversation thread.',
            },
        ],
    },
    {
        id: 'communication',
        title: 'Communication',
        icon: MessageSquare,
        items: [
            {
                question: 'How do I communicate with support?',
                answer:
                    'Open your ticket and use the Conversation section at the bottom. All messages there are visible to you and the eMagiz team. Post updates when you have new information or when asked to verify a fix.',
            },
            {
                question: 'Will I get notified of updates?',
                answer:
                    'Check My Tickets and the Dashboard for recent activity. Email notifications may be added in a future release — for now, revisit the ticket page or watch for status changes in your ticket list.',
            },
            {
                question: 'Can I add information to a closed ticket?',
                answer:
                    'No — once a ticket is Closed or Denied, new comments are disabled. If the issue returns or you disagree with the outcome, submit a new ticket and reference the original ticket ID (e.g. TKT-26).',
            },
        ],
    },
    {
        id: 'account',
        title: 'Account & Access',
        icon: CircleHelp,
        items: [
            {
                question: 'I forgot my password. What should I do?',
                answer:
                    'Use the password reset option on the login page if available, or contact your company administrator or eMagiz Support to regain access to your account.',
            },
            {
                question: 'Can I see tickets from other users in my company?',
                answer:
                    'No — you only see tickets that you created. Each customer account has access to their own submissions only.',
            },
            {
                question: 'Who do I contact for urgent production issues?',
                answer:
                    'Submit a ticket with Critical priority and describe the production impact clearly. For immediate escalation paths agreed in your contract, also use your designated emergency contact channel.',
            },
        ],
    },
];

function itemKey(sectionId, index) {
    return `${sectionId}-${index}`;
}

function isOpen(sectionId, index) {
    return openItems.value.has(itemKey(sectionId, index));
}

function toggleItem(sectionId, index) {
    const key = itemKey(sectionId, index);
    const next = new Set(openItems.value);
    if (next.has(key)) {
        next.delete(key);
    } else {
        next.add(key);
    }
    openItems.value = next;
}

function goToTickets() {
    router.push('/customer/tickets');
}
</script>

<template>
    <CustomerLayout>
        <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-8">
                <div class="flex items-center gap-2 text-teal-600">
                    <LifeBuoy class="h-5 w-5" />
                    <span class="text-sm font-medium">Customer Support</span>
                </div>
                <h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    Knowledge &amp; Help
                </h1>
                <p class="mt-2 max-w-2xl text-sm text-slate-500">
                    Answers to common questions about submitting tickets, tracking progress,
                    and working with the eMagiz support team.
                </p>
            </div>

            <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div class="space-y-6">
                    <section
                        v-for="section in faqSections"
                        :key="section.id"
                        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                        <div class="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                            <component :is="section.icon" class="h-4 w-4 text-teal-600" />
                            <h2 class="text-sm font-semibold text-slate-800">{{ section.title }}</h2>
                            <span class="ml-auto text-xs text-slate-400">{{ section.items.length }} articles</span>
                        </div>

                        <div class="divide-y divide-slate-100">
                            <div
                                v-for="(item, index) in section.items"
                                :key="itemKey(section.id, index)"
                            >
                                <button
                                    type="button"
                                    class="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                                    @click="toggleItem(section.id, index)"
                                >
                                    <span class="text-sm font-medium text-slate-800">
                                        {{ item.question }}
                                    </span>
                                    <ChevronDown
                                        class="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform"
                                        :class="isOpen(section.id, index) ? 'rotate-180' : ''"
                                    />
                                </button>

                                <div
                                    v-show="isOpen(section.id, index)"
                                    class="border-t border-slate-50 bg-slate-50/60 px-5 py-4"
                                >
                                    <p class="text-sm leading-relaxed text-slate-600">
                                        {{ item.answer }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <aside class="space-y-4">
                    <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 class="text-sm font-semibold text-slate-800">Quick Actions</h3>
                        <div class="mt-4 space-y-2">
                            <button
                                type="button"
                                class="flex w-full items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm font-medium text-teal-700 transition hover:bg-teal-100"
                                @click="goToSubmit"
                            >
                                <Ticket class="h-4 w-4" />
                                Submit New Ticket
                            </button>
                            <button
                                type="button"
                                class="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                @click="goToTickets"
                            >
                                <MessageSquare class="h-4 w-4" />
                                View My Tickets
                            </button>
                        </div>
                    </section>
                    <section class="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
                        <h3 class="text-sm font-semibold text-amber-900">Tip</h3>
                        <p class="mt-2 text-xs leading-relaxed text-amber-800/80">
                            Before submitting, check My Tickets — your issue may already be
                            reported. Add a comment to an existing ticket instead of creating
                            a duplicate.
                        </p>
                    </section>
                </aside>
            </div>
        </div>
    </CustomerLayout>
</template>
