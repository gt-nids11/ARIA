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
            const mockBrief = `Tactical Briefing for Operation: ${ev.title}. 
            
Operation oversight confirms all security clearances are active. Intelligence indicates that the scheduled meeting with ${ev.attendees || 'key stakeholders'} at ${ev.location || 'designated tactical HQ'} will cover critical infrastructure and regional security protocols. 

Minister Sharma is advised to prioritize the discussion on resource allocation and upcoming deadlines. Level-4 security protocols remain in effect throughout the duration of the engagement. Contingency plans are prepared for any technical or logistical deviations.`;
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
