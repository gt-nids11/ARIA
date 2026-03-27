export const scheduleEvents: any[] = [];

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
    { id: '10', title: 'Signboard damaged', ward: 'Ward 4', category: 'Infrastructure', priority: 'low', status: 'open', latitude: 28.6148, longitude: 77.2070, days_open: 15 },
    { id: '6', title: 'Tree collapse', ward: 'Ward 5', category: 'Infrastructure', priority: 'high', status: 'open', latitude: 28.6170, longitude: 77.2060, days_open: 6 },
    { id: '7', title: 'Illegal dumping', ward: 'Ward 6', category: 'Sanitation', priority: 'high', status: 'open', latitude: 28.6100, longitude: 77.2110, days_open: 12 },
    { id: '8', title: 'Water main break', ward: 'Ward 7', category: 'Plumbing', priority: 'high', status: 'open', latitude: 28.6160, longitude: 77.2130, days_open: 4 },
    { id: '9', title: 'Smoke complaint', ward: 'Ward 8', category: 'Health', priority: 'medium', status: 'open', latitude: 28.6110, longitude: 77.2140, days_open: 2 },
    { id: '11', title: 'Traffic signal outage', ward: 'Ward 9', category: 'Traffic', priority: 'medium', status: 'open', latitude: 28.6180, longitude: 77.2120, days_open: 5 },
    { id: '12', title: 'Flooded underpass', ward: 'Ward 10', category: 'Infrastructure', priority: 'high', status: 'open', latitude: 28.6090, longitude: 77.2105, days_open: 8 },
    { id: '13', title: 'Noise pollution', ward: 'Ward 3', category: 'Environment', priority: 'low', status: 'open', latitude: 28.6132, longitude: 77.2115, days_open: 5 },
    { id: '14', title: 'Drone report', ward: 'Ward 6', category: 'Security', priority: 'high', status: 'open', latitude: 28.6108, longitude: 77.2103, days_open: 3 },
    { id: '15', title: 'Water contamination', ward: 'Ward 2', category: 'Health', priority: 'high', status: 'open', latitude: 28.6142, longitude: 77.2077, days_open: 10 },
    { id: '16', title: 'Illegal dumping', ward: 'Ward 11', category: 'Sanitation', priority: 'high', status: 'open', latitude: 28.6075, longitude: 77.2114, days_open: 4 },
    { id: '17', title: 'Street vendors blocking', ward: 'Ward 12', category: 'Commerce', priority: 'medium', status: 'open', latitude: 28.6022, longitude: 77.2088, days_open: 5 },
    { id: '18', title: 'Broken bus shelter', ward: 'Ward 13', category: 'Infrastructure', priority: 'low', status: 'open', latitude: 28.6011, longitude: 77.2136, days_open: 8 },
    { id: '19', title: 'Uncollected waste', ward: 'Ward 14', category: 'Sanitation', priority: 'high', status: 'open', latitude: 28.6080, longitude: 77.2050, days_open: 6 },
    { id: '20', title: 'Traffic signal outage', ward: 'Ward 15', category: 'Traffic', priority: 'medium', status: 'open', latitude: 28.6161, longitude: 77.2173, days_open: 3 },
    { id: '21', title: 'Noise pollution festival', ward: 'Ward 16', category: 'Environment', priority: 'low', status: 'open', latitude: 28.6098, longitude: 77.2194, days_open: 7 },
    { id: '22', title: 'Power outage complaint', ward: 'Ward 17', category: 'Electrical', priority: 'high', status: 'open', latitude: 28.6037, longitude: 77.2128, days_open: 5 },
    { id: '23', title: 'Water tank leak', ward: 'Ward 18', category: 'Infrastructure', priority: 'high', status: 'open', latitude: 28.6055, longitude: 77.2059, days_open: 2 },
    { id: '24', title: 'Parks lighting issue', ward: 'Ward 19', category: 'Infrastructure', priority: 'medium', status: 'open', latitude: 28.6112, longitude: 77.2164, days_open: 9 },
    { id: '25', title: 'Air quality alert', ward: 'Ward 20', category: 'Environment', priority: 'high', status: 'open', latitude: 28.6152, longitude: 77.2145, days_open: 12 }
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
