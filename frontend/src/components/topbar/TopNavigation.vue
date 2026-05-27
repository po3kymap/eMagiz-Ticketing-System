<script setup>
import RoleChip from '@/components/topbar/RoleChip.vue';
import NotificationBell from '@/components/topbar/NotificationBell.vue';
import UserProfileChip from '@/components/topbar/UserProfileChip.vue';

defineProps({
    role: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        default: '',
    },
    userInitials: {
        type: String,
        required: true,
    },
    unreadNotifications: {
        type: Number,
        default: 0,
    },
});

defineEmits(['logout', 'notifications']);
</script>

<template>
    <header class="h-16 shrink-0 border-b border-slate-200 bg-white">
        <div class="flex h-full items-center justify-end gap-3 px-4 sm:gap-4 sm:px-6">
            <div class="flex shrink-0 items-center gap-3 sm:gap-4">
                <RoleChip :role="role" />
                <NotificationBell
                    :unread-count="unreadNotifications"
                    @click="$emit('notifications')"
                />
                <ChevronDown class="w-3 h-3 text-slate-400" />
                <UserProfileChip
                    :name="userName"
                    :email="userEmail"
                    :initials="userInitials"
                    @logout="$emit('logout')"
                />
            </div>
        </div>
    </header>
</template>
