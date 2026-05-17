import { NextRequest } from "next/server";
import OpenAI from "openai";

const MAX_INPUT_CHARS = 12_000;

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
    const { extractedText } = body as { extractedText?: string };

    if (!extractedText || typeof extractedText !== "string" || extractedText.trim().length === 0) {
      return Response.json(
        { error: "extractedText is required and must be non-empty" },
        { status: 400 },
      );
    }

    // Truncate to limit token usage / cost
    const trimmed = extractedText.slice(0, MAX_INPUT_CHARS);

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a study assistant. Given extracted text from a study document, produce a structured JSON response with exactly these keys:
- "summary": a concise 3-5 paragraph study summary
- "keyPoints": an array of 5-8 key point strings
- "importantConcepts": an array of 4-8 important concept/term strings
- "studyTips": an array of 3-5 actionable study tip strings

Output valid JSON only. Do not include any markdown or extra text.`,
        },
        {
          role: "user",
          content: `Here is the extracted text from the document:\n\n${trimmed}`,
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

    const parsed = JSON.parse(raw) as {
      summary?: string;
      keyPoints?: string[];
      importantConcepts?: string[];
      studyTips?: string[];
    };

    return Response.json({
      summary: parsed.summary ?? "",
      keyPoints: parsed.keyPoints ?? [],
      importantConcepts: parsed.importantConcepts ?? [],
      studyTips: parsed.studyTips ?? [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI summary generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
