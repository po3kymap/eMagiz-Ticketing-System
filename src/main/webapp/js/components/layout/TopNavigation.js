import PageContext from '../ui/PageContext.js';
import RoleChip from '../ui/RoleChip.js';
import NotificationBell from '../ui/NotificationBell.js';
import UserProfileChip from '../ui/UserProfileChip.js';

export default {
    components: { PageContext, RoleChip, NotificationBell, UserProfileChip },
    props: {
        role: {
            type: String,
            default: 'Customer'
        },
        userName: {
            type: String,
            default: 'Sarah Mitchell'
        },
        userEmail: {
            type: String,
            default: 's.mitchell@acmecorp.com'
        },
        pageSection: {
            type: String,
            default: 'Customer Portal'
        },
        pageTitle: {
            type: String,
            default: 'Dashboard'
        }
    },
    data() {
        return {
            isNotificationsOpen: false,
            notifications: [
                { id: 1, title: 'Ticket TKT-2047 assigned to support', time: '2 min ago', read: false },
                { id: 2, title: 'Status changed to In Progress', time: '18 min ago', read: false },
                { id: 3, title: 'Knowledge article updated', time: '1 hour ago', read: true }
            ]
        };
    },
    computed: {
        unreadNotificationsCount() {
            return this.notifications.filter((notification) => !notification.read).length;
        }
    },
    mounted() {
        document.addEventListener('click', this.handleDocumentClick);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    },
    methods: {
        toggleNotifications() {
            this.isNotificationsOpen = !this.isNotificationsOpen;
        },
        markAllNotificationsAsRead() {
            this.notifications = this.notifications.map((notification) => ({ ...notification, read: true }));
        },
        markNotificationAsRead(id) {
            this.notifications = this.notifications.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            );
        },
        handleDocumentClick(event) {
            if (!this.$refs.notificationsContainer) {
                return;
            }
            if (!this.$refs.notificationsContainer.contains(event.target)) {
                this.isNotificationsOpen = false;
            }
        }
    },
    template: `
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <PageContext :section="pageSection" :title="pageTitle" />
            <div class="flex items-center gap-6">
                <RoleChip :role="role" />
                <div class="relative" ref="notificationsContainer">
                    <NotificationBell :unread-count="unreadNotificationsCount" @click="toggleNotifications" />
                    <div v-if="isNotificationsOpen" class="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
                        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                            <span class="text-sm font-semibold text-slate-900">Notifications</span>
                            <button
                                type="button"
                                class="text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:text-slate-300"
                                :disabled="unreadNotificationsCount === 0"
                                @click="markAllNotificationsAsRead"
                            >
                                Mark all as read
                            </button>
                        </div>
                        <div class="max-h-72 overflow-y-auto">
                            <button
                                v-for="notification in notifications"
                                :key="notification.id"
                                type="button"
                                class="w-full text-left px-4 py-3 border-b last:border-b-0 border-slate-100 hover:bg-slate-50 transition-colors"
                                @click="markNotificationAsRead(notification.id)"
                            >
                                <div class="flex items-start gap-3">
                                    <span :class="['mt-1 w-2 h-2 rounded-full shrink-0', notification.read ? 'bg-slate-300' : 'bg-emerald-500']"></span>
                                    <div>
                                        <p :class="['text-sm', notification.read ? 'text-slate-600' : 'text-slate-800 font-medium']">{{ notification.title }}</p>
                                        <p class="text-xs text-slate-400 mt-1">{{ notification.time }}</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <UserProfileChip :name="userName" :email="userEmail" />
            </div>
        </header>
    `
};