import { GenerateArgs as CodeSpinGenerateArgs } from "codespin/dist/commands/generate/index.js";
import { getModel } from "codespin/dist/settings/getModel.js";
import { readCodeSpinConfig } from "codespin/dist/settings/readCodeSpinConfig.js";
import { getCodingConventionPath } from "../../settings/conventions/getCodingConventionPath.js";
import { getProviderConfigPath } from "../../settings/provider/getProviderConfigPath.js";
import { GenerateUserInput } from "./types.js";
import type { ProviderConfigPageArgs } from "./html/pages/provider/EditConfig.js";

export type MissingProviderConfigArgs = {
  status: "missing_provider_config";
  providerConfigPageArgs: ProviderConfigPageArgs;
};

export type CanGenerateArgs = {
  status: "can_generate";
  args: CodeSpinGenerateArgs;
};

export type GetGenerateArgs =
  | MissingProviderConfigArgs
  | CanGenerateArgs;

export async function getGenerateArgs(
  startChatInput: GenerateUserInput,
  workspaceRoot: string
): Promise<GetGenerateArgs> {
  const modelDescription = await getModelDescription(workspaceRoot);

  const configFilePath = await getProviderConfigPath(
    modelDescription.provider,
    workspaceRoot
  );

  if (configFilePath) {
    const codespinGenerateArgs: CodeSpinGenerateArgs = {
      prompt: startChatInput.prompt,
      model: startChatInput.model,
      write: false,
      include: startChatInput.includedFiles.map((f) => f.path),
      spec: startChatInput.codingConvention
        ? await getCodingConventionPath(
            startChatInput.codingConvention,
            workspaceRoot
          )
        : undefined,
      reloadProviderConfig: true,
    };

    const canstartChatArgs: CanGenerateArgs = {
      status: "can_generate",
      args: codespinGenerateArgs,
    };

    return canstartChatArgs;
  } else {
    const missingConfigResult: MissingProviderConfigArgs = {
      status: "missing_provider_config",
      providerConfigPageArgs: {
        provider: modelDescription.provider,
        startChatUserInput: startChatInput,
      },
    };
    return missingConfigResult;
  }
}

export async function getModelDescription(workspaceRoot: string) {
  const codespinConfig = await readCodeSpinConfig(undefined, workspaceRoot);
  return await getModel([codespinConfig.model], codespinConfig);
}