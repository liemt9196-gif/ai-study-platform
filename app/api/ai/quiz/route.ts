import { NextRequest } from "next/server";
import OpenAI from "openai";

const MAX_INPUT_CHARS = 12_000;
const MAX_SUMMARY_CHARS = 2_000;

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  topic: string;
};

function normalizeQuestions(value: unknown): QuizQuestion[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const question = item as Partial<QuizQuestion>;
      const options = Array.isArray(question.options)
        ? question.options.filter((option): option is string => typeof option === "string").slice(0, 4)
        : [];

      if (options.length !== 4) return null;

      const correctAnswer = typeof question.correctAnswer === "string" ? question.correctAnswer : "";
      if (!correctAnswer || !options.includes(correctAnswer)) return null;

      return {
        question: typeof question.question === "string" ? question.question : "",
        options,
        correctAnswer,
        explanation: typeof question.explanation === "string" ? question.explanation : "",
        difficulty: typeof question.difficulty === "string" ? question.difficulty : "Medium",
        topic: typeof question.topic === "string" ? question.topic : "General",
      };
    })
    .filter((question): question is QuizQuestion => Boolean(question?.question && question.explanation))
    .slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY is not configured on the server" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { extractedText, summary } = body as {
      extractedText?: string;
      summary?: string;
    };

    if (!extractedText || typeof extractedText !== "string" || extractedText.trim().length === 0) {
      return Response.json(
        { error: "extractedText is required and must be non-empty" },
        { status: 400 },
      );
    }

    const trimmedText = extractedText.slice(0, MAX_INPUT_CHARS);
    const trimmedSummary = typeof summary === "string" ? summary.slice(0, MAX_SUMMARY_CHARS) : "";

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert study assistant. Generate 8-10 multiple choice quiz questions from the provided document text.

Return valid JSON only with exactly this shape:
{
  "questions": [
    {
      "question": "clear multiple choice question",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswer": "one exact option string from options",
      "explanation": "brief explanation of why the answer is correct",
      "difficulty": "Easy | Medium | Hard",
      "topic": "short topic label"
    }
  ]
}

Rules:
- Generate between 8 and 10 questions.
- Each question must have exactly 4 answer options.
- correctAnswer must exactly match one string in options.
- Mix recall, conceptual understanding, and application questions.
- Use difficulty values only: Easy, Medium, or Hard.
- Avoid duplicate questions.
- Do not include markdown or extra text.`,
        },
        {
          role: "user",
          content: `Optional study summary:\n${trimmedSummary || "No summary provided."}\n\nDocument text:\n${trimmedText}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return Response.json(
        { error: "No response from AI model" },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(raw) as { questions?: unknown };
    const questions = normalizeQuestions(parsed.questions);

    if (questions.length === 0) {
      return Response.json(
        { error: "AI response did not include usable quiz questions" },
        { status: 500 },
      );
    }

    return Response.json({ questions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI quiz generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
