import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { addAuditLog } from '../data';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("aria_db");
    const collection = db.collection("schedule_events");

    const events = await collection.find({}).toArray();
    
    const safeEvents = events.map(e => ({
      ...e,
      id: e._id.toString(),
      _id: undefined
    }));

    addAuditLog('GET_SCHEDULE', 'Schedule', 'Listed persistent events');
    return NextResponse.json(safeEvents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("aria_db");
    const collection = db.collection("schedule_events");

    const ev = { 
      ...body, 
      status: body.status || "pending",
      created_at: new Date() 
    };

    const result = await collection.insertOne(ev);
    
    const newEvent = {
        ...ev,
        id: result.insertedId.toString(),
        _id: result.insertedId
    };

    addAuditLog('ADD_EVENT', 'Schedule', `Added operation ${ev.title}`);
    return NextResponse.json(newEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
