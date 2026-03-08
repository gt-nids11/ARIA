import { NextResponse } from 'next/server';
import { addAuditLog } from '../data';

import { openai } from '../../../lib/openai';
import fs from 'fs';
import pdfParse from 'pdf-parse';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) throw new Error('No file provided');

        addAuditLog('PROCESS_DOCUMENT', 'Documents', `Processed document ${file.name}`);

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = '';
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            const data = await pdfParse(buffer);
            text = data.text;
        } else {
            text = buffer.toString('utf-8');
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a government document analyst. Analyze this document and return a JSON object with these exact keys: summary, key_decisions, action_items, deadlines, stakeholders. Each value is a string with items separated by newlines. Return only valid JSON directly parseable without codeblocks." },
                { role: "user", content: text }
            ],
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content);
        return NextResponse.json(analysis);
    } catch(e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
