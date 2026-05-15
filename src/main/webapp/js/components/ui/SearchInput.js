export default {
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Search tickets, users...'
        }
    },
    emits: ['update:modelValue'],
    methods: {
        onInput(event) {
            this.$emit('update:modelValue', event.target.value);
        }
    },
    template: `
        <div class="w-96">
            <div class="relative">
                <input
                    :value="modelValue"
                    @input="onInput"
                    type="text"
                    :placeholder="placeholder"
                    class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                >
                <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 absolute left-3 top-2.5 text-slate-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>
        </div>
    `
};
