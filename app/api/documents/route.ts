import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("documents")
    .select("id,file_name,storage_path,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ documents: data ?? [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, storagePath } = body as { fileName?: string; storagePath?: string };

    if (!fileName || !storagePath) {
      return Response.json({ error: "fileName and storagePath are required" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("documents")
      .upsert(
        { file_name: fileName, storage_path: storagePath },
        { onConflict: "storage_path" },
      )
      .select("id,file_name,storage_path,created_at")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ document: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save document";
    return Response.json({ error: message }, { status: 500 });
  }
}
