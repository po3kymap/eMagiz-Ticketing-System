import StatCard from '../../components/ui/StatCard.js';
import HeroBanner from '../../components/customer/HeroBanner.js';
import TicketList from '../../components/customer/TicketList.js';
import RecentActivity from '../../components/customer/RecentActivity.js';
import ActivityChart from '../../components/charts/TicketActivityChart.js';
import { getCurrentUser } from '../../api/auth.js';
import { getCustomerTickets, getRecentActivity, getTicketActivity } from '../../api/tickets.js';
import { getTicketMetrics } from '../../ticketMetrics.js';

export default {
    components: { StatCard, HeroBanner, TicketList, RecentActivity, ActivityChart },
    data() {
        return {
            user: {
                name: 'Sarah Mitchell',
                organization: 'Acme Corp'
            },
            tickets: [],
            activity: {
                labels: ['Apr 29', 'Apr 30', 'May 1', 'May 2', 'May 3'],
                values: [0, 1, 3, 2, 4]
            },
            recentActivity: []
        };
    },
    computed: {
        ticketMetrics() {
            return getTicketMetrics(this.tickets);
        }
    },
    async mounted() {
        const [user, tickets, activity, recentActivity] = await Promise.all([
            getCurrentUser(),
            getCustomerTickets(),
            getTicketActivity(),
            getRecentActivity()
        ]);
        this.user = {
            name: user.name,
            organization: user.organization
        };
        this.tickets = tickets;
        this.activity = activity;
        this.recentActivity = recentActivity;
    },
    template: `
        <div class="p-8 max-w-7xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-900 mb-1">Good morning, {{ user.name }}</h1>
                <p class="text-slate-500">{{ user.organization }} · Customer Portal</p>
            </div>
            
            <HeroBanner />
            
            <div class="grid grid-cols-4 gap-6 mb-8">
                <StatCard :count="ticketMetrics.openTicketsCount" title="Open Tickets" type="blue" iconPath="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                <StatCard :count="ticketMetrics.waitingForSupportCount" title="Waiting for Support" type="amber" iconPath="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <StatCard :count="ticketMetrics.resolvedTicketsCount" title="Resolved This Month" type="emerald" iconPath="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <StatCard :count="ticketMetrics.recentUpdatesCount" title="Recent Updates" type="indigo" iconPath="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TicketList :tickets="tickets" />
                <div class="flex flex-col gap-6">
                    <ActivityChart :labels="activity.labels" :values="activity.values" />
                    <RecentActivity :items="recentActivity" />
                </div>
            </div>
        </div>
    `
};