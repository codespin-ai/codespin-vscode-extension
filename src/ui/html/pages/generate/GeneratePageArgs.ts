import { CodingConvention } from "../../../../settings/conventions/CodingConvention.js";
import {
  FileVersions
} from "../../../panels/generate/types.js";

export type GeneratePageArgs = {
  models: { [key: string]: string };
  codingConventions: Array<CodingConvention>;
  selectedModel: string;
  codingConvention: string | undefined;
  prompt: string;
  codegenTargets: string;
  fileVersion: FileVersions;
  outputKind: "full" | "diff";
  includedFiles: {
    path: string;
    size: number;
  }[];
  uiProps?: {
    promptTextAreaHeight?: number;
    promptTextAreaWidth?: number;
  };
};
