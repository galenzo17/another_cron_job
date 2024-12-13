import { summarizeArticles } from "./ia-service";
import { fetchNews } from "./new-service";
import { updateRepository } from "./update-repo";

const main = async () => {
  try {
    console.log("Fetching news...");
    const articles = await fetchNews();
    console.log("Generating summary...");
    const summary = await summarizeArticles(articles);
    console.log("Updating GitHub repository...");
    await updateRepository(summary);
    console.log("Repository updated successfully.");
  } catch (error) {
    console.error("Error in main execution:", error);
  }
};
