import { NextRequest } from "next/server";
import OpenAI from "openai";

const MAX_INPUT_CHARS = 12_000;
const MAX_SUMMARY_CHARS = 2_000;

type Flashcard = {
  question: string;
  answer: string;
  difficulty: string;
  topic: string;
};

function normalizeFlashcards(value: unknown): Flashcard[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const card = item as Partial<Flashcard>;

      return {
        question: typeof card.question === "string" ? card.question : "",
        answer: typeof card.answer === "string" ? card.answer : "",
        difficulty: typeof card.difficulty === "string" ? card.difficulty : "Medium",
        topic: typeof card.topic === "string" ? card.topic : "General",
      };
    })
    .filter((card): card is Flashcard => Boolean(card?.question && card.answer))
    .slice(0, 12);
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
          content: `You are an expert study assistant. Generate 8-12 high-quality study flashcards from the provided document text.

Return valid JSON only with exactly this shape:
{
  "flashcards": [
    {
      "question": "clear question testing one concept",
      "answer": "concise but complete answer",
      "difficulty": "Easy | Medium | Hard",
      "topic": "short topic label"
    }
  ]
}

Rules:
- Generate between 8 and 12 flashcards.
- Mix factual recall, conceptual understanding, and application questions.
- Keep each answer concise and study-friendly.
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

    const parsed = JSON.parse(raw) as { flashcards?: unknown };
    const flashcards = normalizeFlashcards(parsed.flashcards);

    if (flashcards.length === 0) {
      return Response.json(
        { error: "AI response did not include usable flashcards" },
        { status: 500 },
      );
    }

    return Response.json({ flashcards });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI flashcard generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
