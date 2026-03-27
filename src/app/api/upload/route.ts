import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    
    if (!file) {
      return NextResponse.json({ success: false, message: "No file explicitly provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try to extract pure text if it's a txt file, otherwise store base64 representation
    let contentSnippet = "";
    if (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".csv")) {
        contentSnippet = buffer.toString('utf-8');
    } else {
        contentSnippet = `[Binary Data Blob: ${file.type}]`;
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("aria_db"); // Default ARIA database name
    const collection = db.collection("documents");

    const result = await collection.insertOne({
      filename: file.name,
      file_size: file.size,
      mime_type: file.type,
      content: contentSnippet,
      uploaded_at: new Date(),
      status: "processed_frontend"
    });

    return NextResponse.json({ 
        success: true, 
        message: "File stored in database", 
        documentId: result.insertedId 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to upload" }, { status: 500 });
  }
}
