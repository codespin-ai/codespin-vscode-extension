import { InvalidCredentialsError } from "codespin/dist/errors.js";
import { getModelDescription, getGenerateArgs } from "../getGenerateArgs.js";
import { navigateTo } from "../../navigateTo.js";
import { invokeGenerate } from "../invokeGenerate.js";
import { GenerateEvent } from "../types.js";
import { ChatPanel } from "../ChatPanel.js";
import type { ProviderConfigPageArgs } from "../html/pages/provider/EditConfig.js";

export async function handleGenerate(
  chatPanel: ChatPanel,
  message: GenerateEvent,
  workspaceRoot: string
): Promise<void> {
  const startChatArgs = await getGenerateArgs(message, workspaceRoot);

  switch (startChatArgs.status) {
    case "can_generate":
      try {
        await invokeGenerate(
          chatPanel,
          startChatArgs.args,
          message,
          workspaceRoot
        );
      } catch (ex) {
        if (ex instanceof InvalidCredentialsError) {
          const modelDescription = await getModelDescription(workspaceRoot);

          const configPageState: ProviderConfigPageArgs = {
            provider: modelDescription.provider,
            startChatUserInput: message,
          };

          await navigateTo(chatPanel, `/provider/config/edit`, configPageState);
          break;
        }
        throw ex;
      }
      break;

    case "missing_provider_config":
      await navigateTo(
        chatPanel,
        `/provider/config/edit`,
        startChatArgs.providerConfigPageArgs
      );
      break;
  }
}