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

    // Mock AI Analysis based on file content/name
    const generateIntel = (filename: string) => {
      const isFin = filename.toLowerCase().includes("fin") || filename.toLowerCase().includes("afs");
      return {
        summary: isFin
          ? `Financial intelligence report for ${filename} showing comprehensive multi-year budget estimates and revenue accounting (2023-2026).`
          : `Strategic intelligence analysis for ${filename} extracted and processed by ARIA Level-4 protocols.`,
        key_decisions: isFin
          ? [
            "Increased reliance on tax revenue (GST and income taxes) as primary income drivers.",
            "Significant allocation toward social services (education, health, welfare) and energy/power sector."
          ]
          : [
            "Deploy additional surveillance assets in high-risk sectors.",
            "Authorize level-2 security protocols for all regional hubs."
          ],
        action_items: isFin
          ? [
            "Strengthen tax collection efficiency to meet targets.",
            "Manage rising interest payments and debt servicing burden effectively.",
            "Accelerate capital investments in infrastructure (roads, power, irrigation)."
          ]
          : [
            "Conduct immediate risk assessment of core data centers.",
            "Update security clearances for ministerial personnel."
          ],
        stakeholders: isFin
          ? [
            "Minister of Finance",
            "Governor of Central Bank",
            "Regional Revenue Commissioner"
          ]
          : [
            "Director of Strategic Command",
            "National Security Advisor",
            "Chief Intelligence Officer"
          ],
        deadlines: isFin
          ? [
            { date: "2026-04-15", task: "Quarterly Revenue Audit" },
            { date: "2026-05-30", task: "Annual Budget Presentation" }
          ]
          : [
            { date: "2026-04-10", task: "Regional Hub Security Patch" },
            { date: "2026-04-25", task: "Full System Integrity Check" }
          ]
      };
    }

    const intel = generateIntel(file.name);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("aria_db");
    const collection = db.collection("documents");

    const result = await collection.insertOne({
      filename: file.name,
      file_size: file.size,
      mime_type: file.type,
      content: contentSnippet,
      uploaded_at: new Date(),
      status: "processed",
      intelligence: intel
    });

    return NextResponse.json({
      success: true,
      message: "File stored and analyzed",
      documentId: result.insertedId,
      intelligence: intel
    }, { status: 200 });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to upload" }, { status: 500 });
  }
}
