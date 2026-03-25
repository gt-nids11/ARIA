import { NextResponse } from 'next/server';
import { addAuditLog } from '../data';

import { openai } from '../../../lib/openai';

export async function GET(req: Request) {
    try {
        addAuditLog('GENERATE_BRIEF', 'Dashboard', 'Generated morning brief');
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are ARIA, AI assistant for Minister Sharma, a senior Indian government official. Generate a 4-sentence morning brief that is direct, urgent and professional. Cover: ward complaints, pending approvals, and today's priority action." }
            ]
        });
        return NextResponse.json({ brief: completion.choices[0].message.content });
    } catch (e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
