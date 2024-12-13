import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const NEWS_API_URL =
  "https://newsapi.org/v2/everything?q=artificial%20intelligence";
const NEWS_API_KEY = process.env.NEWS_API_KEY || "";

export async function fetchNews() {
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
}
