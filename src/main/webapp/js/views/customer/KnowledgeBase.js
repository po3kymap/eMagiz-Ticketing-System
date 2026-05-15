const articles = [
    { id: 1, title: 'How to report an integration incident', category: 'Incident Management', updatedAt: 'Updated 2 days ago' },
    { id: 2, title: 'Ticket priority matrix and SLA targets', category: 'Best Practices', updatedAt: 'Updated 1 week ago' },
    { id: 3, title: 'Escalation path for production outages', category: 'Escalation', updatedAt: 'Updated 2 weeks ago' }
];

export default {
    data() {
        return {
            query: '',
            articles
        };
    },
    computed: {
        filteredArticles() {
            const normalizedQuery = this.query.trim().toLowerCase();
            if (!normalizedQuery) {
                return this.articles;
            }
            return this.articles.filter((article) =>
                article.title.toLowerCase().includes(normalizedQuery) ||
                article.category.toLowerCase().includes(normalizedQuery)
            );
        }
    },
    template: `
        <div class="p-8 max-w-7xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-slate-900 mb-1">Knowledge Base</h1>
                <p class="text-slate-500">Find guides and troubleshooting playbooks.</p>
            </div>
            <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <div class="mb-5">
                    <input
                        v-model="query"
                        type="text"
                        placeholder="Search help articles..."
                        class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                    >
                </div>
                <div class="space-y-3">
                    <div
                        v-for="article in filteredArticles"
                        :key="article.id"
                        class="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <h2 class="text-base font-semibold text-slate-900">{{ article.title }}</h2>
                                <p class="text-sm text-slate-500 mt-1">{{ article.category }}</p>
                            </div>
                            <span class="text-xs text-slate-400 whitespace-nowrap">{{ article.updatedAt }}</span>
                        </div>
                    </div>
                    <div v-if="!filteredArticles.length" class="text-sm text-slate-500 py-2">
                        No matching articles found.
                    </div>
                </div>
            </div>
        </div>
    `
};
