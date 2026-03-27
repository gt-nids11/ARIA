import { NextResponse } from 'next/server';
import { addAuditLog } from '../../../data';
import { scheduleEvents } from '../../../data';
import { openai } from '../../../../../lib/openai';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const ev = scheduleEvents.find((x: any) => x.id === params.id);
        if (!ev) throw new Error('Not found');

        addAuditLog('GENERATE_EVENT_BRIEF', 'Schedule', 'Generated brief for event ' + ev.title);

        if (!openai) {
            const mockBrief = `Mock event briefing because OpenAI API key is not set. Event (${ev.title}) details have been stored successfully.`;
            return NextResponse.json({ briefing: mockBrief });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are preparing a brief for Minister Sharma. Given the event details, provide a concise 3-paragraph pre-meeting briefing covering context, key objectives, and potential talking points." },
                { role: "user", content: JSON.stringify(ev) }
            ]
        });

        return NextResponse.json({ briefing: completion.choices[0].message.content });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
