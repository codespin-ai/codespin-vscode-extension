import { promises as fs } from "fs";
import * as path from "path";
import { HistoryEntry, UserInput } from "../../viewProviders/history/types.js";
import { getHistoryDir } from "../codespinDirs.js";

// Functional style utility functions
async function readJsonFile<T>(filePath: string): Promise<T> {
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents) as T;
}

// Convert readTextFile to async function
async function readTextFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

// Update getHistoryEntry to async function
export async function getHistoryEntry(
  entryDirName: string,
  workspaceRoot: string
): Promise<HistoryEntry | null> {
  const historyDir = await getHistoryDir(workspaceRoot);
  const entryDirPath = path.join(historyDir, entryDirName);
  const userInputPath = path.join(entryDirPath, "user-input.json");
  const promptPath = path.join(entryDirPath, "prompt.txt");

  const timestamp = parseInt(path.basename(entryDirName), 10);
  if (isNaN(timestamp)) {
    return null;
  }

  try {
    const [userInputExists, promptExists] = await Promise.all([
      fs
        .access(userInputPath)
        .then(() => true)
        .catch(() => false),
      fs
        .access(promptPath)
        .then(() => true)
        .catch(() => false),
    ]);

    if (userInputExists && promptExists) {
      const userInput = await readJsonFile<UserInput>(userInputPath);
      const prompt = await readTextFile(promptPath);
      return { timestamp, userInput, prompt };
    }
  } catch (error) {
    console.error("Error reading history entry:", error);
  }

  return null;
}