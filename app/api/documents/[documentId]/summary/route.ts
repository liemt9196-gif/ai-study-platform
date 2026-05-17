import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const { documentId } = await params;
    const body = await request.json();
    const { summary, keyPoints, importantConcepts, studyTips } = body as {
      summary?: string;
      keyPoints?: string[];
      importantConcepts?: string[];
      studyTips?: string[];
    };

    if (!summary) {
      return Response.json({ error: "summary is required" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("summaries")
      .upsert(
        {
          document_id: documentId,
          summary,
          key_points: keyPoints ?? [],
          important_concepts: importantConcepts ?? [],
          study_tips: studyTips ?? [],
        },
        { onConflict: "document_id" },
      )
      .select("id,summary,key_points,important_concepts,study_tips,created_at")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      summary: {
        summary: data.summary,
        keyPoints: data.key_points,
        importantConcepts: data.important_concepts,
        studyTips: data.study_tips,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save summary";
    return Response.json({ error: message }, { status: 500 });
  }
}
