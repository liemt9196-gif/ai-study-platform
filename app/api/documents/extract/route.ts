import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { PDFParse } from "pdf-parse";

const BUCKET = "study-documents";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filePath } = body as { filePath?: string };

    if (!filePath || typeof filePath !== "string") {
      return Response.json(
        { error: "filePath is required" },
        { status: 400 },
      );
    }

    // Only support PDF extraction for now
    if (!filePath.toLowerCase().endsWith(".pdf")) {
      return Response.json(
        { error: "Only PDF extraction is supported at this time" },
        { status: 400 },
      );
    }

    // Download the file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabaseServer.storage
      .from(BUCKET)
      .download(filePath);

    if (downloadError || !fileData) {
      return Response.json(
        { error: downloadError?.message ?? "Failed to download file from storage" },
        { status: 500 },
      );
    }

    // Convert Blob to Uint8Array for pdf-parse v2
    const arrayBuffer = await fileData.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    // Extract text using PDFParse v2 class API
    const parser = new PDFParse({ data });
    const textResult = await parser.getText();
    const infoResult = await parser.getInfo();
    await parser.destroy();

    return Response.json({
      fileName: filePath,
      extractedText: textResult.text,
      pageCount: infoResult.total ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Extraction failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
