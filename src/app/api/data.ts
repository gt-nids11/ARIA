
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

export let schedule = [
    { id: '1', title: 'Morning Briefing', event_type: 'Meeting', priority: 'high', start_time: new Date(new Date().setHours(9,0,0,0)).toISOString(), end_time: new Date(new Date().setHours(10,0,0,0)).toISOString(), attendees: 'Staff', has_briefing: true },
    { id: '2', title: 'Site Inspection', event_type: 'Field', priority: 'high', start_time: new Date(new Date().setHours(11,0,0,0)).toISOString(), end_time: new Date(new Date().setHours(13,0,0,0)).toISOString(), attendees: 'Engineers', has_briefing: true },
    { id: '3', title: 'Press Conference', event_type: 'Media', priority: 'high', start_time: new Date(new Date().setHours(15,0,0,0)).toISOString(), end_time: new Date(new Date().setHours(16,0,0,0)).toISOString(), attendees: 'Media Reps', has_briefing: true },
    { id: '4', title: 'Policy Review', event_type: 'Meeting', priority: 'medium', start_time: new Date(new Date().setHours(16,30,0,0)).toISOString(), end_time: new Date(new Date().setHours(18,0,0,0)).toISOString(), attendees: 'Advisors', has_briefing: true }
];

export let auditLogs = [
    { id: '1', user_name: 'Minister Sharma', action: 'LOGIN', module: 'Auth', details: 'User signed in', ip_address: '192.168.1.1', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '2', user_name: 'Minister Sharma', action: 'VIEW', module: 'Dashboard', details: 'Dashboard loaded', ip_address: '192.168.1.1', created_at: new Date(Date.now() - 85000000).toISOString() }
];
for(let i=3; i<=15; i++) {
    auditLogs.push({ id: i.toString(), user_name: 'Minister Sharma', action: 'VIEW', module: 'System', details: 'System operation', ip_address: '192.168.1.1', created_at: new Date(Date.now() - 80000000 + i*1000).toISOString() });
}

export function addAuditLog(action, module, details) {
    auditLogs.unshift({
        id: Date.now().toString() + Math.random().toString(),
        user_name: 'Minister Sharma',
        action,
        module,
        details,
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString()
    });
}
