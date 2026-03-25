import { NextResponse } from 'next/server';
import { addAuditLog } from '../data';

import { schedule } from '../data';

export async function GET() {
    addAuditLog('GET_SCHEDULE', 'Schedule', 'Listed events');
    return NextResponse.json(schedule);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const ev = { ...body, id: Date.now().toString(), has_briefing: true };
        schedule.push(ev);
        addAuditLog('ADD_EVENT', 'Schedule', `Added event ${ev.title}`);
        return NextResponse.json(schedule);
    } catch(e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
