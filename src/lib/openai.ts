import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
    console.warn('OPENAI_API_KEY is not configured. API calls will use mock data.');
}

export { openaiClient as openai };
