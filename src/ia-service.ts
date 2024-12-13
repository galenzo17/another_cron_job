import * as dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

export async function summarizeArticles(articles: any[]): Promise<string> {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const content = articles
    .map((article) => `- ${article.title} (${article.url})`)
    .join("\n");

  const prompt = `Summarize the following articles about artificial intelligence:\n\n${content}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });
    return (
      response.choices[0]?.message?.content?.trim() || "No summary available."
    );
  } catch (error) {
    console.error("Error summarizing articles:", error);
    throw new Error("Failed to summarize articles");
  }
}
