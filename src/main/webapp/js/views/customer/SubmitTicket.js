export default {
    data() {
        return {
            subject: '',
            ticketType: '',
            category: '',
            priority: 'Medium',
            description: '',
            environment: '',
            businessImpact: '',
            attachments: [],
            contactName: 'Sarah Mitchell',
            contactEmail: 's.mitchell@acmecorp.com',
            confirmAccurate: false
        };
    },
    computed: {
        priorityOptions() {
            return [
                {
                    value: 'Critical',
                    subtitle: 'Production down',
                    titleClass: 'text-red-700',
                    subtitleClass: 'text-red-500',
                    cardClass: 'bg-red-50 border-red-200'
                },
                {
                    value: 'High',
                    subtitle: 'Major impact',
                    titleClass: 'text-orange-700',
                    subtitleClass: 'text-orange-500',
                    cardClass: 'bg-orange-50 border-orange-200'
                },
                {
                    value: 'Medium',
                    subtitle: 'Limited impact',
                    titleClass: 'text-amber-700',
                    subtitleClass: 'text-amber-500',
                    cardClass: 'bg-amber-50 border-amber-200'
                },
                {
                    value: 'Low',
                    subtitle: 'Minor / cosmetic',
                    titleClass: 'text-slate-600',
                    subtitleClass: 'text-slate-500',
                    cardClass: 'bg-slate-100 border-slate-200'
                }
            ];
        },
        tips() {
            return [
                'Include exact error messages or codes',
                'Specify the environment (production/staging)',
                'Mention when the issue started',
                'Attach relevant log files or screenshots',
                'Describe the business impact clearly',
                'Include steps to reproduce if possible'
            ];
        },
        slaItems() {
            return [
                { priority: 'Critical', response: '1 hour', resolve: '4 hours', classes: 'text-red-600 bg-red-50 border-red-100' },
                { priority: 'High', response: '4 hours', resolve: '1 day', classes: 'text-orange-600 bg-orange-50 border-orange-100' },
                { priority: 'Medium', response: '8 hours', resolve: '3 days', classes: 'text-amber-600 bg-amber-50 border-amber-100' },
                { priority: 'Low', response: '1 day', resolve: '5 days', classes: 'text-slate-600 bg-slate-100 border-slate-200' }
            ];
        }
    },
    methods: {
        setPriority(value) {
            this.priority = value;
        },
        getPriorityCardClasses(option) {
            if (option.value === this.priority) {
                return `${option.cardClass} ring-2 ring-emerald-300 border-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.22)]`;
            }
            return 'bg-white border-slate-200 hover:border-slate-300';
        },
        getPriorityTitleClasses(option) {
            if (option.value === this.priority) {
                return option.titleClass;
            }
            return 'text-slate-700';
        },
        getPrioritySubtitleClasses(option) {
            if (option.value === this.priority) {
                return option.subtitleClass;
            }
            return 'text-slate-500';
        },
        openFilePicker() {
            this.$refs.fileInput.click();
        },
        handleFileSelect(event) {
            const files = Array.from(event.target.files || []);
            this.attachments = [...this.attachments, ...files];
            event.target.value = '';
        },
        removeAttachment(index) {
            this.attachments = this.attachments.filter((_, fileIndex) => fileIndex !== index);
        },
        handleSubmit() {
            this.subject = '';
            this.ticketType = '';
            this.category = '';
            this.priority = 'Medium';
            this.description = '';
            this.environment = '';
            this.businessImpact = '';
            this.attachments = [];
            this.confirmAccurate = false;
        }
    },
    template: `
        <div class="p-8 max-w-7xl mx-auto">
            <div class="mb-7">
                <h1 class="text-4xl font-bold text-slate-900 mb-2">Submit a Ticket</h1>
                <p class="text-slate-500">Report an incident or submit a request for change. Our support team typically responds within 4 business hours.</p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <form class="lg:col-span-2 space-y-6" @submit.prevent="handleSubmit">
                    <section class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <h2 class="text-2xl font-semibold text-slate-900 mb-5">Ticket Information</h2>
                        <div class="space-y-5">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Ticket Title <span class="text-red-500">*</span></label>
                                <input
                                    v-model="subject"
                                    type="text"
                                    placeholder="e.g. API integration failure in production environment"
                                    class="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500"
                                >
                                <p class="text-xs text-slate-400 mt-2">Be specific and descriptive, include the system and environment if known.</p>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Ticket Type <span class="text-red-500">*</span></label>
                                    <select v-model="ticketType" class="w-full h-11 bg-white border border-slate-200 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500">
                                        <option disabled value="">Select type...</option>
                                        <option>Incident</option>
                                        <option>RFC Request</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                    <select v-model="category" class="w-full h-11 bg-white border border-slate-200 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500">
                                        <option disabled value="">Select category...</option>
                                        <option>Connector / Integration</option>
                                        <option>Performance</option>
                                        <option>Authentication / Security</option>
                                        <option>Data Mapping / Transformation</option>
                                        <option>Scheduling / Automation</option>
                                        <option>Logging / Monitoring</option>
                                        <option>New Feature / Enhancement</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                                    <button
                                        v-for="option in priorityOptions"
                                        :key="option.value"
                                        type="button"
                                        :class="['rounded-2xl border px-4 py-3 text-left transition-all min-h-[74px]', getPriorityCardClasses(option)]"
                                        @click="setPriority(option.value)"
                                    >
                                        <p :class="['text-sm font-semibold leading-tight', getPriorityTitleClasses(option)]">{{ option.value }}</p>
                                        <p :class="['text-sm mt-1 leading-tight', getPrioritySubtitleClasses(option)]">{{ option.subtitle }}</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <h2 class="text-2xl font-semibold text-slate-900 mb-5">Description & Details</h2>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Description <span class="text-red-500">*</span></label>
                                <textarea
                                    v-model="description"
                                    rows="5"
                                    placeholder="Please describe the issue in detail. Include: what happened, when it started, what you expected to happen, and any error messages you've seen."
                                    required
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                ></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Related Environment / Integration</label>
                                <input
                                    v-model="environment"
                                    type="text"
                                    placeholder="e.g. Production - SAP S4/HANA Connector, Version 3.2"
                                    required
                                    class="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Business Impact (optional)</label>
                                <textarea
                                    v-model="businessImpact"
                                    rows="3"
                                    placeholder="Describe how this issue is impacting your business operations..."
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    <section class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <h2 class="text-2xl font-semibold text-slate-900 mb-4">Attachments</h2>
                        <input ref="fileInput" type="file" class="hidden" multiple @change="handleFileSelect">
                        <button
                            type="button"
                            class="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors p-10 text-center"
                            @click="openFilePicker"
                        >
                            <div class="flex flex-col items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-slate-400">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-5.319 5.319a3.75 3.75 0 1 1-5.303-5.303L14.25 6.25a2.25 2.25 0 1 1 3.182 3.182l-6.243 6.243a.75.75 0 1 1-1.061-1.06l5.47-5.47" />
                                </svg>
                                <p class="text-lg font-medium text-slate-700">Drag & drop files here or <span class="text-emerald-600">browse</span></p>
                                <p class="text-sm text-slate-400">Supports: PNG, JPG, PDF, TXT, LOG · Max 20MB per file</p>
                            </div>
                        </button>
                        <div v-if="attachments.length" class="mt-4 space-y-2">
                            <div v-for="(file, index) in attachments" :key="file.name + index" class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                                <span class="text-sm text-slate-600 truncate">{{ file.name }}</span>
                                <button type="button" class="text-xs text-red-600 hover:text-red-700 font-medium" @click="removeAttachment(index)">Remove</button>
                            </div>
                        </div>
                    </section>

                    <section class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <h2 class="text-2xl font-semibold text-slate-900 mb-4">Contact Details</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                                <input
                                    v-model="contactName"
                                    type="text"
                                    class="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                <input
                                    v-model="contactEmail"
                                    type="email"
                                    class="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500"
                                >
                            </div>
                        </div>
                    </section>

                    <section class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <label class="flex items-start gap-3">
                            <input v-model="confirmAccurate" type="checkbox" class="mt-1 h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                            <span class="text-sm text-slate-700 leading-6">
                                I confirm that the information provided above is accurate and complete to the best of my knowledge. I understand that incomplete tickets may delay the support process.
                            </span>
                        </label>
                    </section>

                    <div>
                        <button
                            type="submit"
                            :disabled="!confirmAccurate"
                            class="h-11 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.769 59.769 0 0 1 3.27 20.875L6 12Zm0 0h7.5" />
                            </svg>
                            Submit Ticket
                        </button>
                    </div>
                </form>

                <div class="space-y-4">
                    <section class="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm p-5">
                        <h3 class="text-sm font-semibold text-amber-900 mb-3">Tips for a great ticket</h3>
                        <ul class="space-y-2">
                            <li v-for="(tip, index) in tips" :key="tip" class="text-xs text-amber-900 flex items-start gap-2">
                                <span class="mt-0.5 inline-flex w-4 h-4 rounded-full bg-amber-200 text-amber-900 items-center justify-center text-[10px] font-semibold">{{ index + 1 }}</span>
                                <span>{{ tip }}</span>
                            </li>
                        </ul>
                    </section>

                    <section class="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                        <h3 class="text-sm font-semibold text-slate-900 mb-3">SLA Overview</h3>
                        <div class="space-y-3">
                            <div v-for="item in slaItems" :key="item.priority" class="flex items-center justify-between gap-3">
                                <span :class="['px-2 py-0.5 rounded-full border text-xs font-semibold', item.classes]">{{ item.priority }}</span>
                                <span class="text-xs text-slate-500">Response: {{ item.response }}</span>
                                <span class="text-xs text-slate-500">Resolve: {{ item.resolve }}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `
};
