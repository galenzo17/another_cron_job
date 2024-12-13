import axios from "axios";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import path from "path";

dotenv.config();

const NEWS_API_URL =
  "https://newsapi.org/v2/everything?q=artificial%20intelligence";
const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const fetchNews = async () => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      headers: { Authorization: `Bearer ${NEWS_API_KEY}` },
      params: { language: "en", sortBy: "publishedAt", pageSize: 5 },
    });
    return response.data.articles || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news");
  }
};

const summarizeArticles = async (articles: any[]) => {
  const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

  const content = articles
    .map((article) => `- ${article.title} (${article.url})`)
    .join("\n");

  const prompt = `Summarize the following articles about artificial intelligence:\n\n${content}`;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
      temperature: 0.7,
    });
    return response.data.choices[0].text?.trim() || "No summary available.";
  } catch (error) {
    console.error("Error summarizing articles:", error);
    throw new Error("Failed to summarize articles");
  }
};

const updateReadme = async (summary: string) => {
  const readmePath = path.join(process.cwd(), "README.md");

  const content = `# AI News Summary\n\n## Latest Updates (${
    new Date().toISOString().split("T")[0]
  })\n\n${summary}`;
  fs.writeFileSync(readmePath, content);

  console.log("README updated successfully.");
};

const main = async () => {
  try {
    console.log("Fetching news...");
    const articles = await fetchNews();
    console.log("Generating summary...");
    const summary = await summarizeArticles(articles);
    console.log("Updating README...");
    await updateReadme(summary);
  } catch (error) {
    console.error("Error in main execution:", error);
  }
};

main();
