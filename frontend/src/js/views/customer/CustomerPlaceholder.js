import CustomerLayout from '@/layouts/CustomerLayout.vue';

export function createCustomerPlaceholder(title) {
    return {
        name: `Customer${title.replace(/\s+/g, '')}`,
        components: {
            CustomerLayout,
        },
        template: `
            <CustomerLayout>
                <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
                        ${title} — content coming soon.
                    </div>
                </div>
            </CustomerLayout>
        `,
    };
}
