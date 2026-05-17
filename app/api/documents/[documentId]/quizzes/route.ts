import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
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
    const { questions } = body as { questions?: QuizQuestion[] };

    if (!Array.isArray(questions)) {
      return Response.json({ error: "questions must be an array" }, { status: 400 });
    }

    await supabaseServer.from("quizzes").delete().eq("document_id", documentId);

    if (questions.length === 0) {
      return Response.json({ questions: [] });
    }

    const { data, error } = await supabaseServer
      .from("quizzes")
      .insert(
        questions.map((question) => ({
          document_id: documentId,
          question: question.question,
          options: question.options,
          correct_answer: question.correctAnswer,
          explanation: question.explanation,
          difficulty: question.difficulty,
          topic: question.topic,
        })),
      )
      .select("question,options,correct_answer,explanation,difficulty,topic");

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      questions: (data ?? []).map((question) => ({
        question: question.question,
        options: question.options,
        correctAnswer: question.correct_answer,
        explanation: question.explanation,
        difficulty: question.difficulty,
        topic: question.topic,
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save quiz";
    return Response.json({ error: message }, { status: 500 });
  }
}
