export const scheduleEvents = [
    {
        id: '1', title: 'Budget Review Meeting', event_type: 'meeting',
        priority: 'high', start_time: '09:00', end_time: '10:00',
        attendees: ['Finance Dept', 'Chief Secretary'], has_briefing: false
    },
    {
        id: '2', title: 'Ward 7 Infrastructure Visit', event_type: 'site_visit',
        priority: 'medium', start_time: '11:30', end_time: '13:00',
        attendees: ['PWD Officer', 'Ward Councillor'], has_briefing: false
    },
    {
        id: '3', title: 'Press Conference - Water Supply', event_type: 'press',
        priority: 'high', start_time: '15:00', end_time: '15:45',
        attendees: ['Media', 'PRO'], has_briefing: false
    },
    {
        id: '4', title: 'Cabinet Sub-Committee', event_type: 'meeting',
        priority: 'high', start_time: '16:00', end_time: '17:30',
        attendees: ['Cabinet Members'], has_briefing: false
    },
    {
        id: '5', title: 'Constituent Meeting - Ward 3', event_type: 'meeting',
        priority: 'low', start_time: '17:45', end_time: '18:30',
        attendees: ['Ward 3 Representatives'], has_briefing: false
    },
    {
        id: '6', title: 'Security Briefing', event_type: 'briefing',
        priority: 'medium', start_time: '08:00', end_time: '08:45',
        attendees: ['Security Chief', 'Intelligence Officer'], has_briefing: false
    },
];

export const auditLogs = [
    {
        id: 1, user_name: 'Minister Sharma', action: 'LOGIN', module: 'AUTH',
        details: 'Successful login', ip_address: '192.168.1.1',
        created_at: '2026-03-10 08:00:01'
    },
    {
        id: 2, user_name: 'Minister Sharma', action: 'VIEW_BRIEF', module: 'DASHBOARD',
        details: 'Morning brief generated', ip_address: '192.168.1.1',
        created_at: '2026-03-10 08:00:15'
    },
    {
        id: 3, user_name: 'Aide Kapoor', action: 'UPLOAD_DOCUMENT', module: 'DOCUMENTS',
        details: 'Infrastructure_Bill_2026.pdf', ip_address: '192.168.1.4',
        created_at: '2026-03-10 08:15:42'
    },
    {
        id: 4, user_name: 'Minister Sharma', action: 'GENERATE_SPEECH', module: 'SPEECHES',
        details: 'Press conference speech drafted', ip_address: '192.168.1.1',
        created_at: '2026-03-10 09:10:05'
    },
    {
        id: 5, user_name: 'Officer Mehta', action: 'ADD_COMPLAINT', module: 'MAP',
        details: 'Ward 7 water supply complaint logged', ip_address: '192.168.1.7',
        created_at: '2026-03-10 09:32:18'
    },
    {
        id: 6, user_name: 'Aide Kapoor', action: 'UPLOAD_MEETING', module: 'MEETINGS',
        details: 'Urban planning meeting audio uploaded', ip_address: '192.168.1.4',
        created_at: '2026-03-10 10:05:33'
    },
    {
        id: 7, user_name: 'Minister Sharma', action: 'RESOLVE_ALERT', module: 'ALERTS',
        details: 'Alert #3 resolved', ip_address: '192.168.1.1',
        created_at: '2026-03-10 10:45:00'
    },
    {
        id: 8, user_name: 'Officer Mehta', action: 'ADD_EVENT', module: 'SCHEDULE',
        details: 'New meeting added: Ward 5 Review', ip_address: '192.168.1.7',
        created_at: '2026-03-10 11:00:22'
    },
    {
        id: 9, user_name: 'Minister Sharma', action: 'VIEW_AUDIT', module: 'AUDIT',
        details: 'Audit log accessed', ip_address: '192.168.1.1',
        created_at: '2026-03-10 11:30:45'
    },
    {
        id: 10, user_name: 'Aide Kapoor', action: 'GENERATE_BRIEFING', module: 'SCHEDULE',
        details: 'Pre-meeting briefing for Budget Review', ip_address: '192.168.1.4',
        created_at: '2026-03-10 11:55:10'
    },
    {
        id: 11, user_name: 'Officer Mehta', action: 'UPLOAD_DOCUMENT', module: 'DOCUMENTS',
        details: 'Ward_7_Report_March.pdf', ip_address: '192.168.1.7',
        created_at: '2026-03-10 13:10:05'
    },
    {
        id: 12, user_name: 'Minister Sharma', action: 'VIEW_MAP', module: 'MAP',
        details: 'Constituency heatmap viewed', ip_address: '192.168.1.1',
        created_at: '2026-03-10 14:00:00'
    },
    {
        id: 13, user_name: 'Aide Kapoor', action: 'GENERATE_SPEECH', module: 'SPEECHES',
        details: 'Infrastructure speech V2 drafted', ip_address: '192.168.1.4',
        created_at: '2026-03-10 14:30:18'
    },
    {
        id: 14, user_name: 'Officer Mehta', action: 'RESOLVE_ALERT', module: 'ALERTS',
        details: 'Alert #1 resolved', ip_address: '192.168.1.7',
        created_at: '2026-03-10 15:45:33'
    },
    {
        id: 15, user_name: 'Minister Sharma', action: 'LOGOUT', module: 'AUTH',
        details: 'Session ended', ip_address: '192.168.1.1',
        created_at: '2026-03-10 18:00:00'
    },
];

export let complaints = [
    { id: '1', title: 'Pothole on Main St', ward: 'Ward 1', category: 'Infrastructure', priority: 'high', status: 'open', latitude: 28.6139, longitude: 77.2090, days_open: 5 },
    { id: '2', title: 'Streetlight broken', ward: 'Ward 2', category: 'Electrical', priority: 'medium', status: 'open', latitude: 28.6145, longitude: 77.2085, days_open: 2 },
    { id: '3', title: 'Water leakage', ward: 'Ward 3', category: 'Plumbing', priority: 'high', status: 'open', latitude: 28.6130, longitude: 77.2100, days_open: 1 },
    { id: '4', title: 'Garbage dump', ward: 'Ward 1', category: 'Sanitation', priority: 'low', status: 'open', latitude: 28.6150, longitude: 77.2095, days_open: 7 },
    { id: '5', title: 'Road block', ward: 'Ward 4', category: 'Traffic', priority: 'medium', status: 'open', latitude: 28.6125, longitude: 77.2080, days_open: 3 },
    { id: '10', title: 'Signboard damaged', ward: 'Ward 4', category: 'Infrastructure', priority: 'low', status: 'open', latitude: 28.6148, longitude: 77.2070, days_open: 15 }
];

export let alerts = [
    { id: '1', title: 'Heavy Rainfall Warning', description: 'Expected heavy rainfall in next 24 hours.', severity: 'high', suggested_action: 'Alert response team', resolved: false, created_at: new Date().toISOString() },
    { id: '2', title: 'Power Outage Schedule', description: 'Planned maintenance in Ward 3.', severity: 'medium', suggested_action: 'Notify area residents', resolved: false, created_at: new Date().toISOString() },
    { id: '3', title: 'VIP Visit Route Checkout', description: 'Route optimization needed for tomorrow.', severity: 'low', suggested_action: 'Review map', resolved: false, created_at: new Date().toISOString() },
    { id: '4', title: 'Protest at Town Hall', description: 'Gathering of ~50 people reported.', severity: 'high', suggested_action: 'Deploy security', resolved: false, created_at: new Date().toISOString() },
    { id: '5', title: 'Water Supply Issue', description: 'Contamination reported in Ward 1.', severity: 'high', suggested_action: 'Sample testing', resolved: true, created_at: new Date().toISOString() }
];

// Fallback for API routes that reference "schedule"
export let schedule = scheduleEvents;

export function addAuditLog(action: string, module: string, details: string) {
    auditLogs.unshift({
        id: Date.now() + Math.random(),
        user_name: 'Minister Sharma',
        action,
        module,
        details,
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString()
    });
}
