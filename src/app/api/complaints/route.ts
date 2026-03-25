import { NextResponse } from 'next/server';
import { addAuditLog } from '../data';

import { complaints } from '../data';

export async function GET() {
    addAuditLog('GET_COMPLAINTS', 'Map', 'Listed complaints');
    return NextResponse.json(complaints);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newC = { ...body, id: Date.now().toString(), status: 'open', days_open: 0 };
        complaints.push(newC);
        addAuditLog('ADD_COMPLAINT', 'Map', `Added complaint ${newC.title}`);
        return NextResponse.json(complaints);
    } catch(e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
