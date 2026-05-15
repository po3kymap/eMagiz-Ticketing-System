export default {
    template: `
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            
            <div class="w-96">
                <div class="relative">
                    <input type="text" placeholder="Search tickets, users..." class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors">
                
                    <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 absolute left-3 top-2.5 text-slate-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
            </div>
            
            <div class="flex items-center gap-6">
                
                <div class="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-blue-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span class="text-xs font-medium text-slate-500">Role:</span>
                    <span class="text-sm font-semibold text-slate-700">Customer</span>
                </div>
                    
                <button class="relative text-slate-400 hover:text-slate-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    <span class="absolute top-0 right-0.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                
                <div class="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer">
                    <div class="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">SM</div>
                    <div class="flex flex-col">
                        <span class="text-sm font-semibold text-slate-800">Sarah Mitchell</span>
                        <span class="text-xs text-slate-500">s.mitchell@acmecorp.com</span>
                    </div>
                </div>

            </div> </header>
    `
}