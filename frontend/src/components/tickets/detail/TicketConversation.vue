<script setup>
import { computed, ref, watch } from 'vue';
import { addTicketComment, fetchTicketComments } from '@api/tickets';
import TicketChatPanel from '@/components/tickets/detail/TicketChatPanel.vue';

const props = defineProps({
    ticketId: {
        type: [Number, String],
        required: true,
    },
    ticketStatus: {
        type: String,
        default: '',
    },
    currentUser: {
        type: Object,
        default: null,
    },
    role: {
        type: String,
        default: 'customer',
        validator: (v) => ['support', 'consultant', 'customer'].includes(v),
    },
});

const comments = ref([]);
const isLoading = ref(true);
const error = ref('');
const publicDraft = ref('');
const internalDraft = ref('');
const isPostingPublic = ref(false);
const isPostingInternal = ref(false);
const publicPostError = ref('');
const internalPostError = ref('');

const isStaff = computed(() => ['support', 'consultant'].includes(props.role));

const canPost = computed(() =>
    !['CLOSED', 'DENIED'].includes(String(props.ticketStatus || '').toUpperCase()),
);

const publicComments = computed(() =>
    comments.value.filter((c) => !c.isInternal),
);

const internalComments = computed(() =>
    comments.value.filter((c) => c.isInternal),
);

async function loadComments() {
    if (!props.ticketId) {
        return;
    }

    isLoading.value = true;
    error.value = '';
    try {
        comments.value = await fetchTicketComments(props.ticketId);
    } catch (e) {
        error.value = e.message || 'Failed to load conversation';
    } finally {
        isLoading.value = false;
    }
}

async function postComment(content, isInternal) {
    const created = await addTicketComment(props.ticketId, content, isInternal);
    comments.value = [...comments.value, created];
}

async function handlePublicPost(content) {
    isPostingPublic.value = true;
    publicPostError.value = '';
    try {
        await postComment(content, false);
        publicDraft.value = '';
    } catch (e) {
        publicPostError.value = e.message || 'Failed to post comment';
    } finally {
        isPostingPublic.value = false;
    }
}

async function handleInternalPost(content) {
    isPostingInternal.value = true;
    internalPostError.value = '';
    try {
        await postComment(content, true);
        internalDraft.value = '';
    } catch (e) {
        internalPostError.value = e.message || 'Failed to post team note';
    } finally {
        isPostingInternal.value = false;
    }
}

watch(() => props.ticketId, () => {
    loadComments();
}, { immediate: true });
</script>

<template>
    <div v-if="isLoading" class="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-400 shadow-sm">
        Loading conversation…
    </div>

    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-500 shadow-sm">
        {{ error }}
    </div>

    <div
        v-else
        class="grid gap-4"
        :class="isStaff ? 'lg:grid-cols-[minmax(0,1fr)_300px]' : ''"
    >
        <TicketChatPanel
            v-model:draft="publicDraft"
            title="Conversation"
            subtitle="Visible to customer and support team"
            :comments="publicComments"
            :current-user="currentUser"
            :can-post="canPost"
            :is-posting="isPostingPublic"
            :post-error="publicPostError"
            placeholder="Add a comment or update…"
            variant="public"
            @post="handlePublicPost"
        />

        <TicketChatPanel
            v-if="isStaff"
            v-model:draft="internalDraft"
            title="Team Notes"
            subtitle="Internal — Support & Consultant only"
            :comments="internalComments"
            :current-user="currentUser"
            :can-post="canPost"
            :is-posting="isPostingInternal"
            :post-error="internalPostError"
            placeholder="Note for the team…"
            submit-label="Post Note"
            variant="internal"
            compact
            @post="handleInternalPost"
        />
    </div>
</template>
