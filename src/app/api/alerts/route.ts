import { NextResponse } from 'next/server';
import { addAuditLog } from '../data';

import { alerts } from '../data';

export async function GET() {
    addAuditLog('GET_ALERTS', 'Alerts', 'Listed alerts');
    return NextResponse.json(alerts);
}

export async function PATCH(req: Request) {
    try {
        const { id } = await req.json();
        const idx = alerts.findIndex(a => a.id === id);
        if (idx !== -1) {
            alerts[idx].resolved = true;
            addAuditLog('RESOLVE_ALERT', 'Alerts', `Resolved alert ${id}`);
        }
        return NextResponse.json(alerts);
    } catch(e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
