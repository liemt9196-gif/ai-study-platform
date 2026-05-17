import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;

  const [documentResult, summaryResult, flashcardsResult, quizzesResult] = await Promise.all([
    supabaseServer
      .from("documents")
      .select("id,file_name,storage_path,created_at")
      .eq("id", documentId)
      .single(),
    supabaseServer
      .from("summaries")
      .select("id,summary,key_points,important_concepts,study_tips,created_at")
      .eq("document_id", documentId)
      .maybeSingle(),
    supabaseServer
      .from("flashcards")
      .select("id,question,answer,difficulty,topic,created_at")
      .eq("document_id", documentId)
      .order("created_at", { ascending: true }),
    supabaseServer
      .from("quizzes")
      .select("id,question,options,correct_answer,explanation,difficulty,topic,created_at")
      .eq("document_id", documentId)
      .order("created_at", { ascending: true }),
  ]);

  const error = documentResult.error || summaryResult.error || flashcardsResult.error || quizzesResult.error;
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    document: documentResult.data,
    summary: summaryResult.data
      ? {
          summary: summaryResult.data.summary,
          keyPoints: summaryResult.data.key_points,
          importantConcepts: summaryResult.data.important_concepts,
          studyTips: summaryResult.data.study_tips,
        }
      : null,
    flashcards: (flashcardsResult.data ?? []).map((card) => ({
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
      topic: card.topic,
    })),
    quizzes: (quizzesResult.data ?? []).map((question) => ({
      question: question.question,
      options: question.options,
      correctAnswer: question.correct_answer,
      explanation: question.explanation,
      difficulty: question.difficulty,
      topic: question.topic,
    })),
  });
}
