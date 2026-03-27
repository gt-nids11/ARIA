import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("aria_db");
    const collection = db.collection("documents");

    // Fetch documents sorted by newest first
    const documents = await collection.find({}).sort({ uploaded_at: -1 }).toArray();

    // Remove the actual content payload to keep the response light, assuming we just list them
    const safeDocuments = documents.map((doc) => ({
      _id: doc._id.toString(),
      filename: doc.filename,
      file_size: doc.file_size,
      mime_type: doc.mime_type,
      uploaded_at: doc.uploaded_at,
      status: doc.status,
      intelligence: doc.intelligence || null,
    }));

    return NextResponse.json({ success: true, documents: safeDocuments }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Documents Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to fetch documents" }, { status: 500 });
  }
}
