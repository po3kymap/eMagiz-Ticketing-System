<script setup>
import { Eye, Lock } from 'lucide-vue-next'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] p-4">

    <div class="w-full max-w-[440px]">

      <div class="mb-2.5 flex justify-center">
        <img
            src="/img/loginLogo.png"
            alt="Logo"
            class="h-12 object-contain"
        />
      </div>

      <div>
        <h2 class="mb-2 text-3xl font-bold text-slate-900">
          Sign in
        </h2>

        <p class="mb-8 text-base text-slate-500">
          Access your eMagiz Tickets workspace
        </p>

        <div class="mb-5">
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Email address
          </label>
          <input
              type="email"
              placeholder="admin@emagiz.com"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none transition focus:border-teal-500"
          />
        </div>

        <div class="mb-6">
          <div class="mb-2 flex items-center justify-between">
            <label class="text-sm font-semibold text-slate-700">
              Password
            </label>
            <a
                href="#"
                class="text-sm font-medium text-teal-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <div class="relative">
            <input
                type="password"
                placeholder="••••••••••"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 pr-12 text-base outline-none transition focus:border-teal-500"
            />
            <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <Eye class="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
            type="submit"
            class="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 py-3.5 text-base font-semibold text-white transition hover:bg-teal-700"
        >
          Sign in
          <span class="text-lg leading-none">›</span>
        </button>

        <div class="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Lock class="h-3 w-3" />
          <span>Secured with end-to-end encryption · Session expires after 8 hours</span>
        </div>
      </div>

    </div>
  </div>
</template>