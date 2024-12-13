import { simpleGit } from "simple-git";
import path from "path";
import fs from "fs";

const GITHUB_REPO = process.env.GITHUB_REPO || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

// Clona el repositorio si no existe
const cloneOrPullRepo = async (repoPath: string) => {
  const git = simpleGit();
  if (!fs.existsSync(repoPath)) {
    console.log("Cloning repository...");
    await git.clone(
      `https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git`,
      repoPath
    );
  } else {
    console.log("Pulling latest changes...");
    const repo = simpleGit(repoPath);
    await repo.pull("origin", "main");
  }
};

// Realiza el commit y push al repositorio
const commitAndPush = async (repoPath: string, message: string) => {
  const repo = simpleGit(repoPath);
  console.log("Committing and pushing changes...");
  await repo.add(".");
  await repo.commit(message);
  await repo.push("origin", "main");
};

export const updateRepository = async (summary: string) => {
  const repoPath = path.join(process.cwd(), "ai-news-repo");
  const readmePath = path.join(repoPath, "README.md");

  await cloneOrPullRepo(repoPath);

  // Escribe el resumen en el README.md
  const content = `# AI News Summary\n\n## Latest Updates (${
    new Date().toISOString().split("T")[0]
  })\n\n${summary}`;
  fs.writeFileSync(readmePath, content);

  await commitAndPush(repoPath, "Update AI news summary");
};
