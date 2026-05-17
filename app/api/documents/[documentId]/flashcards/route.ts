import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type Flashcard = {
  question: string;
  answer: string;
  difficulty: string;
  topic: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const { documentId } = await params;
    const body = await request.json();
    const { flashcards } = body as { flashcards?: Flashcard[] };

    if (!Array.isArray(flashcards)) {
      return Response.json({ error: "flashcards must be an array" }, { status: 400 });
    }

    await supabaseServer.from("flashcards").delete().eq("document_id", documentId);

    if (flashcards.length === 0) {
      return Response.json({ flashcards: [] });
    }

    const { data, error } = await supabaseServer
      .from("flashcards")
      .insert(
        flashcards.map((card) => ({
          document_id: documentId,
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty,
          topic: card.topic,
        })),
      )
      .select("question,answer,difficulty,topic");

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ flashcards: data ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save flashcards";
    return Response.json({ error: message }, { status: 500 });
  }
}
