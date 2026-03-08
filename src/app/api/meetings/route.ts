import { NextResponse } from 'next/server';
import { addAuditLog } from '../data';

import { openai } from '../../../lib/openai';
import fs from 'fs';
import os from 'os';
import path from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) throw new Error('No file provided');

        addAuditLog('PROCESS_AUDIO', 'Meetings', `Processed audio file ${file.name}`);
        
        const buffer = Buffer.from(await file.arrayBuffer());
        const tmpPath = path.join(os.tmpdir(), file.name);
        fs.writeFileSync(tmpPath, buffer);

        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tmpPath),
            model: 'whisper-1'
        });

        fs.unlinkSync(tmpPath);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a government meeting analyst. From this transcript return a JSON object with keys: summary, key_decisions, action_items, unresolved_issues, next_steps. Each value is a string. Return pure JSON without markdown format." },
                { role: "user", content: transcription.text }
            ],
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content);
        return NextResponse.json({ transcript: transcription.text, analysis });
    } catch(e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
