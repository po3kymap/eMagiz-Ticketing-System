<script setup>
import { ref, computed, onMounted } from 'vue';
import SupportLayout from '@/layouts/SupportLayout.vue';
import { fetchUsers, createUser, deleteUser } from '@api/users';
import { getCurrentUser } from '@api/auth';

const users = ref([]);
const isLoading = ref(true);
const error = ref('');
const searchQuery = ref('');
const activeTab = ref('All Users');
const currentUser = ref(null);

const showAddUserModal = ref(false);
const isCreating = ref(false);
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const isDeleting = ref(false);
const deleteError = ref('');
const newUser = ref({
  username: '',
  email: '',
  company: '',
  role: 'CUSTOMER',
  password: ''
});

onMounted(async () => {
  currentUser.value = await getCurrentUser();
  try {
    users.value = await fetchUsers();
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
});

const stats = computed(() => {
  const total = users.value.length;
  const customers = users.value.filter(u => String(u.role).toUpperCase() === 'CUSTOMER').length;
  const consultants = users.value.filter(u => String(u.role).toUpperCase() === 'CONSULTANT').length;
  const support = users.value.filter(u => String(u.role).toUpperCase() === 'SUPPORT').length;
  return { total, customers, consultants, support };
});

const tabs = computed(() => [
  { name: 'All Users', count: stats.value.total },
  { name: 'Customers', count: stats.value.customers },
  { name: 'Consultants', count: stats.value.consultants },
  { name: 'Support', count: stats.value.support },
]);

const filteredUsers = computed(() => {
  let result = users.value;

  if (activeTab.value === 'Customers') {
    result = result.filter(u => String(u.role).toUpperCase() === 'CUSTOMER');
  } else if (activeTab.value === 'Consultants') {
    result = result.filter(u => String(u.role).toUpperCase() === 'CONSULTANT');
  } else if (activeTab.value === 'Support') {
    result = result.filter(u => String(u.role).toUpperCase() === 'SUPPORT');
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(u => 
      u.username?.toLowerCase().includes(q) || 
      u.email?.toLowerCase().includes(q) || 
      u.company?.toLowerCase().includes(q)
    );
  }

  return result;
});

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getRoleBadgeClass(role) {
  const r = String(role).toUpperCase();
  if (r === 'CUSTOMER') return 'bg-blue-50 text-blue-700 ring-blue-600/20';
  if (r === 'CONSULTANT') return 'bg-purple-50 text-purple-700 ring-purple-600/20';
  if (r === 'SUPPORT') return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
  return 'bg-slate-50 text-slate-600 ring-slate-500/10';
}

function openAddUserModal() {
  showAddUserModal.value = true;
}

function closeAddUserModal() {
  showAddUserModal.value = false;
  newUser.value = {
    username: '',
    email: '',
    company: '',
    role: 'CUSTOMER',
    password: ''
  };
}

async function handleCreateUser() {
  if (!newUser.value.username || !newUser.value.email || !newUser.value.password) {
    alert('Please fill out all required fields.');
    return;
  }
  
  isCreating.value = true;
  try {
    await createUser(newUser.value);
    users.value = await fetchUsers();
    closeAddUserModal();
  } catch (err) {
    console.error(err);
    alert('Failed to create user. Check console for details.');
  } finally {
    isCreating.value = false;
  }
}

function isCurrentUser(user) {
  return Number(currentUser.value?.userId) === Number(user.id);
}

function openDeleteModal(user) {
  userToDelete.value = user;
  deleteError.value = '';
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  userToDelete.value = null;
  deleteError.value = '';
}

async function handleDeleteUser() {
  if (!userToDelete.value) {
    return;
  }

  isDeleting.value = true;
  deleteError.value = '';
  try {
    await deleteUser(userToDelete.value.id);
    users.value = await fetchUsers();
    closeDeleteModal();
  } catch (err) {
    deleteError.value = err.message || 'Failed to delete user.';
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <SupportLayout>
    <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-teal-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <h1 class="text-2xl font-semibold text-slate-900">Users</h1>
          </div>
          <p class="mt-1 text-sm text-slate-500">Manage user accounts and roles</p>
        </div>
        
        <div class="flex items-center gap-3">
            <button 
            type="button"
            class="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition shadow-sm"
            @click="openAddUserModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>

            Add User
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="text-3xl font-semibold text-slate-900">{{ stats.total }}</div>
          <div class="mt-1 text-sm text-slate-500">Total Users</div>
        </div>
        <div class="rounded-xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm">
          <div class="text-3xl font-semibold text-blue-700">{{ stats.customers }}</div>
          <div class="mt-1 text-sm text-slate-500">Customers</div>
        </div>
        <div class="rounded-xl border border-purple-100 bg-purple-50/50 p-6 shadow-sm">
          <div class="text-3xl font-semibold text-purple-700">{{ stats.consultants }}</div>
          <div class="mt-1 text-sm text-slate-500">Consultants</div>
        </div>
        <div class="rounded-xl border border-emerald-100 bg-emerald-50/50 p-6 shadow-sm">
          <div class="text-3xl font-semibold text-emerald-700">{{ stats.support }}</div>
          <div class="mt-1 text-sm text-slate-500">Support Staff</div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        
        <div class="border-b border-slate-200 p-4">
          <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
            <svg class="h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search by name, email, or organization..."
              class="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        <div class="flex gap-6 px-6 border-b border-slate-200">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            class="flex items-center gap-2 py-4 text-sm font-medium transition border-b-2 -mb-px"
            :class="activeTab === tab.name ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
            @click="activeTab = tab.name"
          >
            {{ tab.name }}
            <span 
              class="rounded-full px-2 py-0.5 text-xs"
              :class="activeTab === tab.name ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4">User</th>
                <th class="px-6 py-4">Email</th>
                <th class="px-6 py-4">Organization</th>
                <th class="px-6 py-4">Role</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td colspan="5" class="px-6 py-12 text-center text-slate-400">Loading users...</td>
              </tr>
              <tr v-else-if="filteredUsers.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-slate-400">No users found.</td>
              </tr>
              <tr 
                v-else
                v-for="user in filteredUsers" 
                :key="user.id"
                class="hover:bg-slate-50 transition"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div 
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                      :class="String(user.role).toUpperCase() === 'CUSTOMER' ? 'bg-blue-600 text-white' : String(user.role).toUpperCase() === 'CONSULTANT' ? 'bg-purple-600 text-white' : 'bg-teal-600 text-white'"
                    >
                      {{ getInitials(user.username) }}
                    </div>
                    <div>
                      <div class="font-medium text-slate-900">{{ user.username }}</div>
                      <div class="text-xs text-slate-400">ID: u{{ user.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-500">{{ user.email }}</td>
                <td class="px-6 py-4 text-slate-500">{{ user.company || '—' }}</td>
                <td class="px-6 py-4">
                  <span 
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="getRoleBadgeClass(user.role)"
                  >
                    {{ String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1).toLowerCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition"
                    :class="isCurrentUser(user)
                      ? 'cursor-not-allowed text-slate-300'
                      : 'text-red-600 hover:bg-red-50'"
                    :disabled="isCurrentUser(user)"
                    :title="isCurrentUser(user) ? 'You cannot delete your own account' : 'Delete user'"
                    @click="openDeleteModal(user)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="showAddUserModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        
        <div 
            class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" 
            @click="closeAddUserModal"
        ></div>

        <div class="relative overflow-hidden rounded-xl bg-white shadow-2xl sm:w-full sm:max-w-md transform transition-all flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-5 border-b border-slate-100 shrink-0">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>

              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900">Add New User</h3>
                <p class="text-sm text-slate-500">Create a new account and assign roles.</p>
              </div>
            </div>
          </div>

          <div class="px-6 py-5 space-y-4 overflow-y-auto">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Username *</label>
              <input
                  v-model="newUser.username"
                  type="text"
                  placeholder="e.g. John Doe"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
              <input
                  v-model="newUser.email"
                  type="email"
                  placeholder="john@example.com"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Organization / Company</label>
              <input
                  v-model="newUser.company"
                  type="text"
                  placeholder="e.g. Acme Corp"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">System Role *</label>
              <select
                  v-model="newUser.role"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="CONSULTANT">Consultant</option>
                <option value="SUPPORT">Support Staff</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Temporary Password *</label>
              <input
                  v-model="newUser.password"
                  type="password"
                  placeholder="••••••••"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div class="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 shrink-0 border-t border-slate-100">
            <button
                type="button"
                class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
                :disabled="isCreating"
                @click="closeAddUserModal"
            >
              Cancel
            </button>
            <button
                type="button"
                class="flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition shadow-sm bg-teal-600 hover:bg-teal-700 disabled:opacity-75 disabled:cursor-not-allowed"
                :disabled="isCreating || !newUser.username || !newUser.email || !newUser.password"
                @click="handleCreateUser"
            >
              <svg 
                  v-if="isCreating" 
                  class="mr-2 h-4 w-4 animate-spin text-white" 
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isCreating ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div
          class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          @click="closeDeleteModal"
        />

        <div class="relative w-full max-w-md rounded-xl bg-white shadow-2xl">
          <div class="px-6 py-6">
            <h3 class="text-lg font-semibold text-slate-900">Delete User</h3>
            <p class="mt-2 text-sm text-slate-500">
              Are you sure you want to delete
              <span class="font-medium text-slate-700">{{ userToDelete?.username }}</span>
              (u{{ userToDelete?.id }})? This action cannot be undone.
            </p>
            <p v-if="deleteError" class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {{ deleteError }}
            </p>
          </div>

          <div class="flex justify-end gap-3 bg-slate-50 px-6 py-4">
            <button
              type="button"
              class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
              :disabled="isDeleting"
              @click="closeDeleteModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-75 disabled:cursor-not-allowed"
              :disabled="isDeleting"
              @click="handleDeleteUser"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete User' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </SupportLayout>
</template>