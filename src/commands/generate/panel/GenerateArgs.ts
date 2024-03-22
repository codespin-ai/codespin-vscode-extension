import { BasePanelArgs } from "../../../vscode/BasePanel.js";

export type GenerateArgs = {
  files: { path: string; size: number | undefined }[];
  models: { name: string; value: string }[];
  selectedModel: string;
  rules: string[];
};
