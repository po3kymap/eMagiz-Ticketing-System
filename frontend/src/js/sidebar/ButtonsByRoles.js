import {
    LayoutDashboard,
    Settings,
    Ticket,
    Plus,
    BookOpen
} from 'lucide-vue-next'

export const ButtonsByRoles = {
    Customer: [
        {id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard'},
        {id: 'my-tickets', label: 'My Tickets', icon: Ticket, route: '/tickets'},
        {id: 'submit-ticket', label: 'Submit Ticket', icon: Plus, route: '/submit'},
        {id: 'help', label: 'Knowledge / Help', icon: BookOpen, route: '/help'},
        {id: 'settings', label: 'Settings', icon: Settings, route: '/settings'}
    ]
}