import { NextResponse } from 'next/server';
import { addAuditLog } from '../data';

import { openai } from '../../../lib/openai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        addAuditLog('GENERATE_SPEECH', 'Speeches', `Generated speech for ${body.topic}`);

        const getFallback = (reason: string) => `Distinguished guests, citizens, and representatives of the ${body.audience || "various departments"},

I stand before you today to address a matter of vital importance: ${body.topic || "our shared progress and future development"}. As part of this ${body.event_type}, it is essential that we recognize the journey that has brought us to this moment.

The core of our efforts today rests on several tactical pillars: ${body.key_points || "infrastructure, community safety, and administrative excellence"}. First, we must look at the immediate impact our ${body.topic} will have on the daily lives of our constituents. We are not just building pipelines or roads; we are building the very foundations of a resilient society.

Secondly, I want to emphasize our commitment to transparency. Every action taken under this initiative is designed with the highest levels of oversight. We are ensuring that resources are utilized where they are needed most, without compromise.

As we move forward, let us remember that the strength of our nation lies in our collective resolve. The milestones we achieve here in this ${body.event_type} will serve as a beacon for future projects across the region.

In conclusion, I urge every one of you to remain steadfast in our mission. Let us continue to work together, with a ${body.tone || "Formal"} and determined spirit, to ensure that the vision we have for a prosperous and secure future becomes a reality for every citizen.

Thank you. Jai Hind.

(Note: AI Generation fallback active. ${reason})`;

        if (!openai) {
            return NextResponse.json({ draft: getFallback("OpenAI API key missing") });
        }

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: `You are an expert speechwriter for senior Indian government officials. Write a highly accurate and human-sounding speech. 
                    Length: Approximately 400 words (2-3 minutes speaking time).
                    Tone: ${body.tone}. 
                    Structure: 
                    - Strong opening hook referencing the event type.
                    - 3 distinct key points using the provided parameters.
                    - Emotional yet professional appeal to the specific audience.
                    - Powerful closing with a call to action.` },
                    { role: "user", content: `Audience: ${body.audience}. Topic: ${body.topic}. Key Points: ${body.key_points || 'General priorities'}. Event Type: ${body.event_type}. Ensure it flows naturally and hits exactly 350-450 words.` }
                ]
            });

            return NextResponse.json({ draft: completion.choices[0].message.content });
        } catch (openaiError: any) {
            console.error("OpenAI Error:", openaiError);
            return NextResponse.json({ draft: getFallback(`AI processing error: ${openaiError.message}`) });
        }
    } catch(e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
