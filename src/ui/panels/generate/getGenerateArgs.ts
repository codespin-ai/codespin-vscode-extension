import {
  GenerateArgs as CodespinGenerateArgs,
  GenerateArgs,
} from "codespin/dist/commands/generate.js";
import { mkdir } from "fs/promises";
import * as path from "path";
import { pathExists } from "../../../fs/pathExists.js";
import { getAPIConfigPath } from "../../../settings/api/getAPIConfigPath.js";
import { getCodingConventionPath } from "../../../settings/conventions/getCodingConventionPath.js";
import { isInitialized } from "../../../settings/isInitialized.js";
import { EventTemplate } from "../../EventTemplate.js";
import { ArgsFromGeneratePanel } from "./ArgsFromGeneratePanel.js";

type GetGenerateArgsResult =
  | {
      status: "not_initialized";
    }
  | {
      status: "missing_config";
      api: string;
    }
  | {
      status: "can_generate";
      args: CodespinGenerateArgs;
      dirName: string;
    };

export async function getGenerateArgs(
  argsFromPanel: EventTemplate<ArgsFromGeneratePanel>,
  cancelCallback: (cancel: () => void) => void,
  workspaceRoot: string
): Promise<GetGenerateArgsResult> {
  // Check if .codespin dir exists
  if (!isInitialized(workspaceRoot)) {
    return { status: "not_initialized" };
  } else {
    const api = argsFromPanel.model.split(":")[0];
    const configFilePath = await getAPIConfigPath(api, workspaceRoot);
    const dirName = Date.now().toString();
    
    if (configFilePath) {
      const historyDirPath = path.join(
        workspaceRoot,
        ".codespin",
        "history",
        dirName
      );

      if (!(await pathExists(historyDirPath))) {
        await mkdir(historyDirPath, { recursive: true });
      }

      const [vendor, model] = argsFromPanel.model.split(":");

      const promptFilePath = path.join(historyDirPath, "prompt.txt");

      const codespinGenerateArgs: GenerateArgs = {
        promptFile: promptFilePath,
        out:
          argsFromPanel.codegenTargets !== ":prompt"
            ? argsFromPanel.codegenTargets
            : undefined,
        model,
        write: true,
        include: argsFromPanel.includedFiles
          .filter((f) => f.includeOption === "source")
          .map((f) =>
            argsFromPanel.fileVersion === "HEAD" ? `HEAD:${f.path}` : f.path
          ),
        exclude: undefined,
        declare: argsFromPanel.includedFiles
          .filter((f) => f.includeOption === "declaration")
          .map((f) => f.path),
        spec: argsFromPanel.codingConvention
          ? await getCodingConventionPath(
              argsFromPanel.codingConvention,
              workspaceRoot
            )
          : undefined,
        prompt: undefined,
        api: vendor,
        maxTokens: 4000,
        printPrompt: undefined,
        writePrompt: undefined,
        template: undefined,
        templateArgs: undefined,
        debug: true,
        exec: undefined,
        config: undefined,
        outDir: undefined,
        parser: undefined,
        parse: undefined,
        go: undefined,
        maxDeclare: undefined,
        cancelCallback,
      };

      return {
        status: "can_generate",
        args: codespinGenerateArgs,
        dirName,
      };
    }
    // config file doesn't exist.
    else {
      return {
        status: "missing_config",
        api,
      };
    }
  }
}