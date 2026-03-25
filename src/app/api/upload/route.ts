import pdfParse from 'pdf-parse';
import { NextResponse } from 'next/server';
import { openai } from '../../../lib/openai';
import { addAuditLog } from '../data';

export const runtime = 'nodejs'; // VERY IMPORTANT

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    addAuditLog('PROCESS_DOCUMENT', 'Documents', `Processed document ${file.name}`);

    const buffer = Buffer.from(await file.arrayBuffer());

    let text = '';
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const data = await pdfParse(buffer);
        text = data.text;
    } else {
        text = buffer.toString('utf-8');
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
        return NextResponse.json({
            summary: `[MOCK SUMMARY] The uploaded document (${file.name}) contains ${text.length} characters of text. This is a mock response because OPENAI_API_KEY is not configured in the environment. ` + text.substring(0, 100).replace(/\n/g, ' ') + "...",
            key_decisions: "- Mock decision: Proceed with local testing\n- Mock decision: Configure API key for real intelligence",
            action_items: "1. Add OPENAI_API_KEY to .env.local file\n2. Restart the development server",
            deadlines: "ASAP - Provide API Key",
            stakeholders: "Local End User"
        });
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a government document analyst. Analyze this document and return a JSON object with these exact keys: summary, key_decisions, action_items, deadlines, stakeholders. Each value is a string with items separated by newlines. Return only valid JSON directly parseable without codeblocks." },
            { role: "user", content: text }
        ],
        response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error("API ERROR:", error);

    return Response.json({
      error: error.message || "Something went wrong"
    }, { status: 500 });
  }
}
