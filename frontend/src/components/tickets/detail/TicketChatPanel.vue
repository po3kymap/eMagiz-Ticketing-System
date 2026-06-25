<script setup>
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import { normalizeRole } from '@js/domain/auth/roles';

const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    comments: { type: Array, default: () => [] },
    currentUser: { type: Object, default: null },
    canPost: { type: Boolean, default: true },
    isPosting: { type: Boolean, default: false },
    postError: { type: String, default: '' },
    placeholder: { type: String, default: 'Add a comment…' },
    submitLabel: { type: String, default: 'Post Comment' },
    variant: {
        type: String,
        default: 'public',
        validator: (v) => ['public', 'internal'].includes(v),
    },
    pinForm: { type: Boolean, default: false },
    matchedHeight: { type: Boolean, default: false },
});

const draft = defineModel('draft', { type: String, default: '' });

const emit = defineEmits(['post']);

const isInternal = computed(() => props.variant === 'internal');

const shellClass = computed(() => {
    if (isInternal.value) {
        return 'border-amber-200 bg-amber-50/30';
    }
    return 'border-slate-200 bg-white';
});

const bubbleClass = computed(() => {
    if (isInternal.value) {
        return 'bg-amber-50 border border-amber-100';
    }
    return 'bg-slate-50';
});

const buttonClass = computed(() => {
    if (isInternal.value) {
        return 'bg-amber-600 hover:bg-amber-700';
    }
    return 'bg-teal-600 hover:bg-teal-700';
});

const sectionClass = computed(() => {
    if (props.matchedHeight || props.pinForm) {
        return 'flex h-[24rem] flex-col';
    }
    return 'flex flex-col';
});

const messagesClass = computed(() => {
    if (props.matchedHeight || props.pinForm) {
        return 'mt-3 min-h-0 flex-1 overflow-y-auto overscroll-y-contain';
    }
    return 'mt-3 max-h-56 overflow-y-auto overscroll-y-contain';
});

const footerClass = computed(() => (
    (props.matchedHeight || props.pinForm) ? 'mt-auto' : ''
));

const currentUserInitials = computed(() => getInitials(props.currentUser?.username));

function getInitials(username) {
    if (!username) {
        return '?';
    }
    const parts = username.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
}

function getRoleMeta(role) {
    const key = normalizeRole(role);
    if (key === 'customer') {
        return { label: 'Customer', avatar: 'bg-blue-100 text-blue-700' };
    }
    if (key === 'support') {
        return { label: 'Support', avatar: 'bg-emerald-100 text-emerald-700' };
    }
    if (key === 'consultant') {
        return { label: 'Consultant', avatar: 'bg-violet-100 text-violet-700' };
    }
    return { label: role || 'User', avatar: 'bg-slate-100 text-slate-600' };
}

function formatCommentDate(val) {
    if (!val) {
        return '';
    }
    const d = new Date(val);
    const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `${date} · ${time}`;
}

function submit() {
    const content = draft.value.trim();
    if (!content || !props.canPost || props.isPosting) {
        return;
    }
    emit('post', content);
}
</script>

<template>
    <section
        class="rounded-xl border p-4 shadow-sm sm:p-5"
        :class="[shellClass, sectionClass]"
    >
        <header class="shrink-0">
            <h2 class="text-sm font-semibold text-slate-700">
                {{ title }}
            </h2>
            <p v-if="subtitle" class="mt-0.5 text-xs text-slate-400">
                {{ subtitle }}
            </p>
        </header>

        <div class="space-y-3 pr-1" :class="messagesClass">
            <p
                v-if="comments.length === 0"
                class="py-6 text-center text-xs text-slate-400"
            >
                {{ isInternal ? 'No team notes yet.' : 'No messages yet.' }}
            </p>

            <article
                v-for="comment in comments"
                :key="comment.id"
                class="flex gap-2.5"
            >
                <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                    :class="getRoleMeta(comment.role).avatar"
                >
                    {{ getInitials(comment.username) }}
                </div>

                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                        <span class="text-sm font-semibold text-slate-800">
                            {{ comment.username }}
                        </span>
                        <span class="text-[10px] text-slate-400">
                            {{ getRoleMeta(comment.role).label }}
                        </span>
                        <span class="text-[10px] text-slate-400">
                            {{ formatCommentDate(comment.createdAt) }}
                        </span>
                    </div>

                    <div
                        class="mt-1 rounded-lg px-3 py-2 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap"
                        :class="bubbleClass"
                    >
                        {{ comment.content }}
                    </div>
                </div>
            </article>
        </div>

        <footer
            v-if="canPost"
            class="mt-3 shrink-0 border-t border-slate-100/80 pt-3"
            :class="footerClass"
        >
            <form class="flex gap-2" @submit.prevent="submit">
                <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                    :class="getRoleMeta(currentUser?.role).avatar"
                >
                    {{ currentUserInitials }}
                </div>

                <div class="min-w-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <textarea
                        v-model="draft"
                        rows="2"
                        class="w-full resize-none border-0 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        :placeholder="placeholder"
                        :disabled="isPosting"
                        @keydown.ctrl.enter="submit"
                        @keydown.meta.enter="submit"
                    />

                    <div class="flex justify-end border-t border-slate-100 px-2.5 py-1.5">
                        <button
                            type="submit"
                            class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                            :class="buttonClass"
                            :disabled="!draft.trim() || isPosting"
                        >
                            <Loader2 v-if="isPosting" class="h-3.5 w-3.5 animate-spin" />
                            {{ isPosting ? 'Posting…' : submitLabel }}
                        </button>
                    </div>
                </div>
            </form>

            <p v-if="postError" class="mt-2 text-xs text-red-500">{{ postError }}</p>
        </footer>

        <p
            v-else
            class="mt-3 shrink-0 border-t border-slate-100/80 pt-3 text-xs text-slate-400"
            :class="footerClass"
        >
            Ticket closed — new messages disabled.
        </p>
    </section>
</template>
