const ticketSnapshot = [
    {
        id: 'TKT-2047',
        type: 'Incident',
        title: 'API integration failure in production',
        priority: 'Critical',
        status: 'Assigned',
        createdAt: '2026-05-01T09:15:00.000Z',
        updatedAt: '2026-05-02T14:40:00.000Z',
        isMine: true,
        assignee: 'James van der Berg'
    },
    {
        id: 'TKT-2042',
        type: 'Incident',
        title: 'Data mapping error in order sync flow',
        priority: 'High',
        status: 'In Progress',
        createdAt: '2026-04-25T11:20:00.000Z',
        updatedAt: '2026-04-28T10:15:00.000Z',
        isMine: true,
        assignee: 'Support Team'
    },
    {
        id: 'TKT-2036',
        type: 'Incident',
        title: 'Incorrect timestamp format in exported CSV',
        priority: 'Low',
        status: 'Unassigned',
        createdAt: '2026-04-20T08:50:00.000Z',
        updatedAt: '2026-04-21T09:35:00.000Z',
        isMine: true,
        assignee: null
    },
    {
        id: 'TKT-2031',
        type: 'RFC Request',
        title: 'Monthly access review completed and closed',
        priority: 'Medium',
        status: 'Resolved',
        createdAt: '2026-04-14T12:30:00.000Z',
        updatedAt: '2026-04-16T15:25:00.000Z',
        isMine: true,
        assignee: 'Support Team'
    }
];

const recentActivitySnapshot = [
    { id: 1, title: 'Assigned to consultant', details: 'TKT-2047 · 2h ago', dot: 'indigo' },
    { id: 2, title: 'Reviewed by support', details: 'TKT-2047 · 22h ago', dot: 'amber' },
    { id: 3, title: 'Ticket submitted — API integration failure', details: 'TKT-2047 · 1 day ago', dot: 'blue' },
    { id: 4, title: 'Resolved by consultant', details: 'TKT-2042 · 3 days ago', dot: 'emerald' },
    { id: 5, title: 'Status updated to Resolved', details: 'TKT-2036 · 12 days ago', dot: 'teal' }
];

export function getCustomerTickets() {
    return Promise.resolve([...ticketSnapshot]);
}

export function getTicketActivity() {
    return Promise.resolve({
        labels: ['Apr 29', 'Apr 30', 'May 1', 'May 2', 'May 3'],
        values: [0, 1, 3, 2, 4]
    });
}

export function getRecentActivity() {
    return Promise.resolve([...recentActivitySnapshot]);
}
