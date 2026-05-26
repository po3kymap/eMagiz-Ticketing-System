```vue
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronDown,
  Info,
  Paperclip,
  Save,
  Send,
  Lightbulb
} from 'lucide-vue-next'

const router = useRouter()

const form = ref({
  title: '',
  type: '',
  category: '',
  priority: 'Medium',
  description: '',
  environment: '',
  impact: '',
  confirmation: false,
  userName: 'Sarah Mitchell',
  userEmail: 's.mitchell@acmecorp.com'
})

const priorities = [
  { id: 'Critical', label: 'Critical', desc: 'Production down' },
  { id: 'High', label: 'High', desc: 'Major impact' },
  { id: 'Medium', label: 'Medium', desc: 'Limited impact' },
  { id: 'Low', label: 'Low', desc: 'Minor / cosmetic' }
]

const slaRules = [
  { id: 'Critical', bg: 'bg-[#FEE2E2] text-[#EF4444]', resp: '1 hour', res: '4 hours' },
  { id: 'High', bg: 'bg-[#FFEDD5] text-[#F97316]', resp: '4 hours', res: '1 day' },
  { id: 'Medium', bg: 'bg-[#FEF9C3] text-[#CA8A04]', resp: '8 hours', res: '3 days' },
  { id: 'Low', bg: 'bg-[#F1F5F9] text-[#64748B]', resp: '1 day', res: '5 days' }
]

const tips = [
  'Include exact error messages or codes',
  'Specify the environment (production/staging)',
  'Mention when the issue started',
  'Attach relevant log files or screenshots',
  'Describe the business impact clearly',
  'Include steps to reproduce if possible'
]

const fileInputRef = ref(null)
const isDragging = ref(false)

const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const handleFileDrop = (e) => {
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files.length) {
    alert(`Selected: ${files[0].name}`)
  }
}

const navigateToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-[#F6F8FB] px-8 py-6 text-[#1E293B] font-sans">

    <div class="flex items-center gap-2 text-[13px] font-medium text-[#64748B] mb-3">
      <button
          type="button"
          @click="navigateToDashboard"
          class="hover:text-[#0FA99D] transition-colors cursor-pointer outline-none"
      >
        Dashboard
      </button>
      <span class="text-[#CBD5E1] text-[11px] font-bold">&gt;</span>
      <span class="text-[#334155]">Submit Ticket</span>
    </div>

    <div class="mb-6">
      <h1 class="text-[26px] font-bold tracking-[-0.02em] text-[#0F172A]">
        Submit a Ticket
      </h1>
      <p class="mt-1 text-[14px] font-medium text-[#64748B]">
        Report an incident or submit a request for change. Our support team typically responds within 4 business hours.
      </p>
    </div>

    <div class="grid grid-cols-[1fr_340px] items-start gap-6">

      <div class="space-y-5">

        <div class="bg-white border border-[#E2E8F0] rounded-[18px] p-6 shadow-sm">
          <h2 class="text-[16px] font-bold text-[#0F172A] mb-5">Ticket Information</h2>

          <div class="space-y-5">
            <div>
              <label class="block text-[13px] font-bold text-[#334155] mb-2">
                Ticket Title <span class="text-[#EF4444]">*</span>
              </label>
              <input
                  v-model="form.title"
                  type="text"
                  placeholder="e.g. API integration failure in production environment"
                  class="w-full h-11 px-4 rounded-[12px] border border-[#CBD5E1] bg-[#F8FAFC] text-[14px] font-medium text-[#334155] placeholder:text-[#94A3B8] outline-none focus:border-[#0FA99D] focus:bg-white transition"
              />
              <p class="mt-1.5 text-[12px] font-semibold text-[#94A3B8]">
                Be specific and descriptive. Include the system and environment if known.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[13px] font-bold text-[#334155] mb-2">
                  Ticket Type <span class="text-[#EF4444]">*</span>
                </label>
                <div class="relative">
                  <select
                      v-model="form.type"
                      class="w-full h-11 pl-4 pr-10 rounded-[12px] border border-[#CBD5E1] bg-[#F8FAFC] text-[14px] font-medium text-[#334155] appearance-none outline-none focus:border-[#0FA99D] focus:bg-white transition"
                  >
                    <option value="" disabled selected>Select type...</option>
                    <option value="Incident">Incident — Something is broken</option>
                    <option value="RFC">Request for Change (RFC) — I need something added or changed</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-[#64748B]" />
                </div>
              </div>

              <div>
                <label class="block text-[13px] font-bold text-[#334155] mb-2">
                  Category
                </label>
                <div class="relative">
                  <select
                      v-model="form.category"
                      class="w-full h-11 pl-4 pr-10 rounded-[12px] border border-[#CBD5E1] bg-[#F8FAFC] text-[14px] font-medium text-[#334155] appearance-none outline-none focus:border-[#0FA99D] focus:bg-white transition"
                  >
                    <option value="" disabled selected>Select category...</option>
                    <option value="Connector">Connector / Integration</option>
                    <option value="Performance">Performance</option>
                    <option value="Security">Authentication / Security</option>
                    <option value="Data">Data Mapping / Transformation</option>
                    <option value="Automation">Scheduling / Automation</option>
                    <option value="Monitoring">Logging / Monitoring</option>
                    <option value="Feature">New Feature / Enhancement</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-[#64748B]" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-[13px] font-bold text-[#334155] mb-2">Priority</label>
              <div class="grid grid-cols-4 gap-3">
                <button
                    v-for="p in priorities"
                    :key="p.id"
                    type="button"
                    @click="form.priority = p.id"
                    class="flex flex-col text-left p-3.5 rounded-[12px] border transition"
                    :class="form.priority === p.id
                    ? 'border-[#0FA99D] bg-[#FFFDF5] ring-2 ring-[#0FA99D]/20'
                    : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'"
                >
                  <span class="text-[13px] font-bold" :class="form.priority === p.id ? 'text-[#B45309]' : 'text-[#334155]'">
                    {{ p.label }}
                  </span>
                  <span class="text-[11px] font-semibold mt-0.5 text-[#94A3B8]">
                    {{ p.desc }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border border-[#E2E8F0] rounded-[18px] p-6 shadow-sm">
          <h2 class="text-[16px] font-bold text-[#0F172A] mb-5">Description & Details</h2>

          <div class="space-y-5">
            <div>
              <label class="block text-[13px] font-bold text-[#334155] mb-2">
                Description <span class="text-[#EF4444]">*</span>
              </label>
              <textarea
                  v-model="form.description"
                  rows="5"
                  placeholder="Please describe the issue in detail. Include: what happened, when it started, what you expected to happen, and any error messages you've seen."
                  class="w-full p-4 rounded-[12px] border border-[#CBD5E1] bg-white text-[14px] font-medium text-[#334155] placeholder:text-[#94A3B8] outline-none focus:border-[#0FA99D] resize-none transition"
              ></textarea>
            </div>

            <div>
              <label class="block text-[13px] font-bold text-[#334155] mb-2">Related Environment / Integration</label>
              <input
                  v-model="form.environment"
                  type="text"
                  placeholder="e.g. Production – SAP S/4HANA Connector, Version 3.2"
                  class="w-full h-11 px-4 rounded-[12px] border border-[#CBD5E1] bg-[#F8FAFC] text-[14px] font-medium text-[#334155] placeholder:text-[#94A3B8] outline-none focus:border-[#0FA99D] focus:bg-white transition"
              />
            </div>

            <div>
              <label class="block text-[13px] font-bold text-[#334155] mb-2">Business Impact (optional)</label>
              <input
                  v-model="form.impact"
                  type="text"
                  placeholder="Describe how this issue is impacting your business operations..."
                  class="w-full h-11 px-4 rounded-[12px] border border-[#CBD5E1] bg-[#F8FAFC] text-[14px] font-medium text-[#334155] placeholder:text-[#94A3B8] outline-none focus:border-[#0FA99D] focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        <div class="bg-white border border-[#E2E8F0] rounded-[18px] p-6 shadow-sm">
          <h2 class="text-[16px] font-bold text-[#0F172A] mb-4">Attachments</h2>
          <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              @click="triggerFileSelect"
              class="border-2 border-dashed rounded-[14px] p-8 flex flex-col items-center justify-center cursor-pointer transition"
              :class="isDragging ? 'border-[#0FA99D] bg-[#EFFBFB]' : 'border-[#CBD5E1] hover:border-[#0FA99D] bg-white'"
          >
            <input
                type="file"
                ref="fileInputRef"
                class="hidden"
                @change="(e) => e.target.files.length && alert(`Selected: ${e.target.files[0].name}`)"
            />
            <Paperclip class="h-8 w-8 text-[#94A3B8] mb-2.5" />
            <p class="text-[14px] font-semibold text-[#64748B] text-center">
              Drag & drop files here or <span class="text-[#0FA99D] hover:underline font-bold">browse</span>
            </p>
            <p class="text-[11px] font-medium text-[#94A3B8] mt-1">
              Supports: PNG, JPG, PDF, TXT, LOG · Max 20MB per file
            </p>
          </div>
        </div>

        <div class="bg-white border border-[#E2E8F0] rounded-[18px] p-6 shadow-sm">
          <h2 class="text-[16px] font-bold text-[#0F172A] mb-4">Contact Details</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[13px] font-bold text-[#334155] mb-2">Your Name</label>
              <input
                  v-model="form.userName"
                  type="text"
                  disabled
                  class="w-full h-11 px-4 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] text-[14px] font-semibold text-[#64748B] cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-[13px] font-bold text-[#334155] mb-2">Email Address</label>
              <input
                  v-model="form.userEmail"
                  type="text"
                  disabled
                  class="w-full h-11 px-4 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] text-[14px] font-semibold text-[#64748B] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div class="bg-white border border-[#E2E8F0] rounded-[14px] p-4 shadow-sm flex items-start gap-3">
          <input
              id="confirmation"
              v-model="form.confirmation"
              type="checkbox"
              class="mt-1 h-4 w-4 shrink-0 rounded border-[#CBD5E1] text-[#0FA99D] focus:ring-[#0FA99D]"
          />
          <label for="confirmation" class="text-[13px] font-semibold text-[#475569] leading-relaxed cursor-pointer select-none">
            I confirm that the information provided above is accurate and complete to the best of my knowledge. I understand that incomplete tickets may delay the support process.
          </label>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
              type="button"
              class="inline-flex h-[42px] items-center gap-2 rounded-[12px] border border-[#DDE5EF] bg-white px-4 text-[13px] font-bold text-[#475569] shadow-sm transition hover:bg-[#F8FAFD]"
          >
            <Save class="h-4 w-4" />
            <span>Save Draft</span>
          </button>

          <button
              type="button"
              :disabled="!form.confirmation"
              class="inline-flex h-[42px] items-center gap-2 rounded-[12px] bg-[#0FA99D] px-5 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(15,169,157,0.15)] transition hover:bg-[#0C9A8F] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0FA99D]"
          >
            <Send class="h-4 w-4" />
            <span>Submit Ticket</span>
          </button>
        </div>

      </div>

      <div class="space-y-4">

        <div class="bg-[#FFFDF5] border border-[#FEF3C7] rounded-[18px] p-5">
          <div class="flex items-center gap-2 text-[#B45309] font-bold text-[14px] mb-4">
            <Lightbulb class="h-4 w-4 shrink-0 text-[#F59E0B]" />
            <span>Tips for a great ticket</span>
          </div>
          <ul class="space-y-3">
            <li
                v-for="(tip, idx) in tips"
                :key="idx"
                class="flex items-start gap-2.5 text-[12px] font-semibold text-[#78350F] leading-tight"
            >
              <span class="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[10px] font-extrabold text-[#B45309]">
                {{ idx + 1 }}
              </span>
              <span>{{ tip }}</span>
            </li>
          </ul>
        </div>

        <div class="bg-white border border-[#E2E8F0] rounded-[18px] p-5 shadow-sm">
          <div class="flex items-center gap-2 text-[#0F172A] font-bold text-[14px] mb-4">
            <Info class="h-4 w-4 text-[#64748B]" />
            <span>SLA Overview</span>
          </div>

          <div class="space-y-4">
            <div
                v-for="rule in slaRules"
                :key="rule.id"
                class="grid grid-cols-[70px_1fr_1fr] items-center text-[12px] gap-2"
            >
              <div>
                <span :class="['inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-bold w-full text-center', rule.bg]">
                  {{ rule.id }}
                </span>
              </div>
              <div class="pl-2">
                <p class="text-[10px] font-medium text-[#94A3B8] leading-none uppercase">Response</p>
                <p class="text-[#334155] font-bold mt-0.5">{{ rule.resp }}</p>
              </div>
              <div>
                <p class="text-[10px] font-medium text-[#94A3B8] leading-none uppercase">Resolve</p>
                <p class="text-[#334155] font-bold mt-0.5">{{ rule.res }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

```