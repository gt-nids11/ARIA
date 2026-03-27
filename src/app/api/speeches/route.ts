import { NextResponse } from 'next/server';
import { addAuditLog } from '../data';

import { openai } from '../../../lib/openai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        addAuditLog('GENERATE_SPEECH', 'Speeches', `Generated speech for ${body.topic}`);

        if (!openai) {
            const mockDraft = `Mock speech draft for ${body.topic}. (OpenAI key missing; install OPENAI_API_KEY for live output.)`;
            return NextResponse.json({ draft: mockDraft });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: `You are an expert speechwriter for senior Indian government officials. Write a speech that sounds human, not AI-generated. Tone: ${body.tone}. Include a strong opening hook, 3 key points with examples, and a powerful closing call to action.` },
                { role: "user", content: `Audience: ${body.audience}. Topic: ${body.topic}. Key Points: ${body.key_points || 'General'}. Event Type: ${body.event_type}` }
            ]
        });

        return NextResponse.json({ draft: completion.choices[0].message.content });
    } catch(e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
