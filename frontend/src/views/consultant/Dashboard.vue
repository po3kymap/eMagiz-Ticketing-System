<script setup>
import { computed, onMounted, ref } from 'vue';
import ConsultantLayout from '@/layouts/ConsultantLayout.vue';
import ConsultantDashboardHeader from '@/components/dashboard/ConsultantDashboardHeader.vue';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard.vue';
import { getCurrentUser } from '@api/auth';
import {
    computeConsultantStats,
    fetchAssignedTicketsForCurrentUser,
} from '@api/tickets';

const user = ref(null);
const tickets = ref([]);
const loading = ref(true);
const loadError = ref('');

const stats = computed(() => computeConsultantStats(tickets.value));

const userName = computed(() => user.value?.username || 'Consultant');
const assignedCount = computed(() => stats.value.assignedToMe);

onMounted(async () => {
    user.value = await getCurrentUser();

    loading.value = true;
    loadError.value = '';

    try {
        tickets.value = await fetchAssignedTicketsForCurrentUser();
    } catch (err) {
        loadError.value = err.message || 'Failed to load assigned tickets';
        tickets.value = [];
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <ConsultantLayout :assigned-count="assignedCount">
        <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <ConsultantDashboardHeader :user-name="userName" />

            <p
                v-if="loadError"
                class="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
                {{ loadError }}
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardStatCard
                    label="Assigned to Me"
                    :value="loading ? '—' : stats.assignedToMe"
                    tone="violet"
                >
                    <template #icon>
                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9 12 2 2 4-4" />
                        </svg>
                    </template>
                </DashboardStatCard>

                <DashboardStatCard
                    label="Due Today"
                    :value="loading ? '—' : stats.dueToday"
                    tone="red"
                >
                    <template #icon>
                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" />
                            <path stroke-linecap="round" d="M12 7v5l3 2" />
                        </svg>
                    </template>
                </DashboardStatCard>

                <DashboardStatCard
                    label="High Priority"
                    :value="loading ? '—' : stats.highPriority"
                    tone="orange"
                >
                    <template #icon>
                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 2.82 17.14A1.5 1.5 0 0 0 4.17 19.5h15.66a1.5 1.5 0 0 0 1.35-2.36L13.71 3.86a1.5 1.5 0 0 0-2.72 0Z" />
                        </svg>
                    </template>
                </DashboardStatCard>

                <DashboardStatCard
                    label="Recently Updated"
                    :value="loading ? '—' : stats.recentlyUpdated"
                    tone="emerald"
                >
                    <template #icon>
                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </template>
                </DashboardStatCard>
            </div>
        </div>
    </ConsultantLayout>
</template>
