<script setup>
import { reactive } from 'vue'
import {
  Settings,
  User,
  Lock,
  Save,
  ShieldAlert
} from 'lucide-vue-next'

const profileForm = reactive({
  fullName: 'Elena Kowalski',
  email: 'e.kowalski@emagiz.com',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const accountInfo = {
  userId: 'u3',
  role: 'Support',
  organization: 'eMagiz',
  createdAt: 'Jan 15, 2025',
}
</script>

<template>
  <div class="min-h-full bg-[#F6F8FB] px-6 py-7">
    <div class="mx-auto max-w-[840px]">
      <div>
        <h1 class="flex items-center gap-2.5 text-[22px] font-semibold tracking-[-0.02em] text-[#1F2937]">
          <Settings class="h-5 w-5 text-[#12A39A]" />
          <span>Settings</span>
        </h1>

        <p class="mt-1 text-[13px] font-medium text-[#8190A5]">
          Manage your account settings and preferences
        </p>
      </div>

      <div class="mt-6 rounded-[18px] border border-[#E3EAF2] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
        <div class="flex items-center gap-2.5 border-b border-[#EEF2F6] px-5 py-4">
          <User class="h-[17px] w-[17px] text-[#334155]" />
          <h2 class="text-[17px] font-semibold tracking-[-0.01em] text-[#273548]">
            Profile Information
          </h2>
        </div>

        <div class="px-5 py-5">
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-[13px] font-semibold text-[#475569]">
                Full Name
              </label>

              <input
                  v-model="profileForm.fullName"
                  type="text"
                  class="h-[42px] w-full rounded-[14px] border border-[#D7E0EA] bg-white px-4 text-[14px] font-medium text-[#334155] outline-none placeholder:text-[#A7B0C2] focus:border-[#C9D6E4]"
              />
            </div>

            <div>
              <label class="mb-2 block text-[13px] font-semibold text-[#475569]">
                Email Address
              </label>

              <input
                  v-model="profileForm.email"
                  type="email"
                  class="h-[42px] w-full rounded-[14px] border border-[#D7E0EA] bg-white px-4 text-[14px] font-medium text-[#334155] outline-none placeholder:text-[#A7B0C2] focus:border-[#C9D6E4]"
              />
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
                type="button"
                class="inline-flex h-10 items-center gap-2 rounded-[14px] bg-[#0FA99D] px-5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(15,169,157,0.16)] transition hover:bg-[#0C9A8F]"
            >
              <Save class="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 rounded-[18px] border border-[#E3EAF2] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
        <div class="flex items-center gap-2.5 border-b border-[#EEF2F6] px-5 py-4">
          <Lock class="h-[17px] w-[17px] text-[#334155]" />
          <h2 class="text-[17px] font-semibold tracking-[-0.01em] text-[#273548]">
            Change Password
          </h2>
        </div>

        <div class="px-5 py-5">
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-[13px] font-semibold text-[#475569]">
                Current Password
              </label>

              <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  class="h-[42px] w-full rounded-[14px] border border-[#D7E0EA] bg-white px-4 text-[14px] font-medium text-[#334155] outline-none placeholder:text-[#9CADC2] focus:border-[#C9D6E4]"
              />
            </div>

            <div>
              <label class="mb-2 block text-[13px] font-semibold text-[#475569]">
                New Password
              </label>

              <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="Enter new password (min. 8 characters)"
                  class="h-[42px] w-full rounded-[14px] border border-[#D7E0EA] bg-white px-4 text-[14px] font-medium text-[#334155] outline-none placeholder:text-[#9CADC2] focus:border-[#C9D6E4]"
              />
            </div>

            <div>
              <label class="mb-2 block text-[13px] font-semibold text-[#475569]">
                Confirm New Password
              </label>

              <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  class="h-[42px] w-full rounded-[14px] border border-[#D7E0EA] bg-white px-4 text-[14px] font-medium text-[#334155] outline-none placeholder:text-[#9CADC2] focus:border-[#C9D6E4]"
              />
            </div>
          </div>

          <div class="mt-4 rounded-[14px] border border-[#EFD98C] bg-[#FFF8E6] px-4 py-3.5">
            <div class="flex items-start gap-2.5">
              <ShieldAlert class="mt-0.5 h-4 w-4 shrink-0 text-[#D88A18]" />

              <div>
                <p class="text-[12px] font-semibold text-[#CC7A12]">
                  Password Requirements
                </p>
                <p class="mt-0.5 text-[12px] font-medium leading-5 text-[#D28A1F]">
                  Minimum 8 characters. Recommended: include uppercase, lowercase, numbers, and special characters.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-5 flex justify-end">
            <button
                type="button"
                class="inline-flex h-10 items-center gap-2 rounded-[14px] bg-[#0FA99D] px-5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(15,169,157,0.16)] transition hover:bg-[#0C9A8F]"
            >
              <Lock class="h-4 w-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 rounded-[18px] border border-[#E3EAF2] bg-white px-5 py-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
        <h2 class="text-[16px] font-semibold tracking-[-0.01em] text-[#334155]">
          Account Information
        </h2>

        <div class="mt-5 grid grid-cols-2 gap-x-16 gap-y-5">
          <div>
            <p class="text-[12px] font-semibold text-[#A0AEC0]">
              User ID
            </p>
            <p class="mt-1 text-[14px] font-semibold text-[#475569]">
              {{ accountInfo.userId }}
            </p>
          </div>

          <div>
            <p class="text-[12px] font-semibold text-[#A0AEC0]">
              Role
            </p>
            <p class="mt-1 text-[14px] font-semibold text-[#475569]">
              {{ accountInfo.role }}
            </p>
          </div>

          <div>
            <p class="text-[12px] font-semibold text-[#A0AEC0]">
              Organization
            </p>
            <p class="mt-1 text-[14px] font-semibold text-[#475569]">
              {{ accountInfo.organization }}
            </p>
          </div>

          <div>
            <p class="text-[12px] font-semibold text-[#A0AEC0]">
              Account Created
            </p>
            <p class="mt-1 text-[14px] font-semibold text-[#475569]">
              {{ accountInfo.createdAt }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>