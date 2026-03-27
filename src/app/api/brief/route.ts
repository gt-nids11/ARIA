import { NextResponse } from 'next/server';
import { addAuditLog } from '../data';

import { openai } from '../../../lib/openai';

export async function GET(req: Request) {
    try {
        addAuditLog('GENERATE_BRIEF', 'Dashboard', 'Generated morning brief');
        let briefText = '';

        if (openai) {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are ARIA, AI assistant for Minister Sharma, a senior Indian government official. Generate a 4-sentence morning brief that is direct, urgent and professional. Cover: ward complaints, pending approvals, and today's priority action." }
                ]
            });
            briefText = completion.choices[0]?.message?.content || '';
        } else {
            briefText = 'Mock morning brief because OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment to use live AI features.';
        }

        return NextResponse.json({ brief: briefText });
    } catch (e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
