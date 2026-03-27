import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { addAuditLog } from '../../data';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("aria_db");
    const collection = db.collection("schedule_events");

    await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    );

    addAuditLog('UPDATE_EVENT', 'Schedule', `Updated operation ${params.id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("aria_db");
    const collection = db.collection("schedule_events");

    await collection.deleteOne({ _id: new ObjectId(params.id) });

    addAuditLog('DELETE_EVENT', 'Schedule', `Deleted operation ${params.id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
