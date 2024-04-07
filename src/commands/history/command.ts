import * as vscode from "vscode";
import { HistoryEntryPanel } from "../../ui/panels/historyEntry/HistoryEntryPanel.js";
import { SelectHistoryEntryArgs } from "../../ui/panels/historyEntry/eventArgs.js";

export function getSelectHistoryEntryCommand(context: vscode.ExtensionContext) {
  return async function selectHistoryItemCommand(
    args: SelectHistoryEntryArgs
  ): Promise<void> {
    if (!args.itemId) {
      vscode.window.showErrorMessage("No history item ID provided.");
      return;
    }

    const panel = new HistoryEntryPanel(context);
    await panel.init(args);
  };
}