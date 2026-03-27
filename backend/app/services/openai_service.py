import json
from app.core.config import settings

# Initialize OpenAI client only if API key is available
client = None
if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "sk-your-openai-api-key":
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
    except ImportError:
        print("Warning: OpenAI package not available")

def summarize_document(text: str) -> dict:
    if not client:
        return {"summary": "OpenAI API key not configured", "key_decisions": "", "action_items": "", "deadlines": "", "stakeholders": ""}

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a senior government document analyst. Analyze the document and return ONLY a JSON object with these exact keys: summary, key_decisions, action_items, deadlines, stakeholders. Each value is a string with items separated by newlines. Be concise and precise."},
                {"role": "user", "content": text[:8000]} # Truncate if extreme
            ]
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {"summary": f"Error: {str(e)}", "key_decisions": "", "action_items": "", "deadlines": "", "stakeholders": ""}

def summarize_meeting(transcript: str) -> dict:
    if not client:
        return {"summary": "OpenAI API key not configured", "key_decisions": "", "action_items": "", "unresolved_issues": "", "next_steps": ""}

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are an expert government meeting analyst. Return ONLY a JSON object with keys: summary, key_decisions, action_items, unresolved_issues, next_steps. Each value is a string with items separated by newlines."},
                {"role": "user", "content": transcript[:8000]}
            ]
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {"summary": f"Error: {str(e)}", "key_decisions": "", "action_items": "", "unresolved_issues": "", "next_steps": ""}

def draft_speech(event_type, audience, topic, key_points, tone) -> str:
    if not client:
        return "OpenAI API key not configured. Please set a valid API key to use speech drafting."

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"You are a senior speechwriter for Indian government officials. Write speeches that sound human, authoritative and {tone}. Never sound like generic AI. Structure: powerful opening hook, 3 key points with real examples, strong closing call to action."},
                {"role": "user", "content": f"Event: {event_type}\nAudience: {audience}\nTopic: {topic}\nKey Points: {key_points}"}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating speech: {str(e)}"

def generate_morning_brief(alerts, meetings, complaints_count) -> str:
    if not client:
        return "OpenAI API key not configured. Cannot generate morning brief."

    try:
        alerts_text = "\n".join([f"- {a['severity']}: {a['title']}" for a in alerts])
        meetings_text = "\n".join([f"- {m['title']} at {m['start_time']}" for m in meetings])
        
        prompt = f"Alerts:\n{alerts_text}\n\nMeetings Today:\n{meetings_text}\n\nOpen Complaints: {complaints_count}"
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are ARIA, AI assistant for Minister Sharma. Generate a 4-sentence morning brief that is direct, urgent and professional. Prioritize the most critical items. End with one clear action recommendation."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return str(e)

def generate_meeting_briefing(event_title, event_type, attendees) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"You are ARIA. Generate a pre-meeting briefing for a senior government official attending: {event_title}. Include: context, key agenda points to cover, questions to ask, and expected outcomes. Keep it under 200 words."},
                {"role": "user", "content": f"Event: {event_title}\nType: {event_type}\nAttendees: {attendees}"}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return str(e)
