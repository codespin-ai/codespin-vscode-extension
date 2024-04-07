import {
  VSCodeButton,
  VSCodeDivider,
  VSCodeProgressRing,
} from "@vscode/webview-ui-toolkit/react/index.js";
import * as React from "react";
import { CSFormField } from "../../components/CSFormField.js";
import { getVsCodeApi } from "../../../../vscode/getVsCodeApi.js";
import { EventTemplate } from "../../../EventTemplate.js";
import { PromptCreatedEventArgs, ResponseStreamEventArgs } from "../../../panels/generate/eventArgs.js";

type GenerateStreamArgs = {
  api: string;
  model: string;
};

export function GenerateStream() {
  const args: GenerateStreamArgs = history.state;

  const [bytesReceived, setBytesReceived] = React.useState(0);
  let [data, setData] = React.useState("");
  const [prompt, setPrompt] = React.useState("");

  React.useEffect(() => {
    function listeners(event: MessageEvent<EventTemplate<unknown>>) {
      const incomingMessage = event.data;
      switch (incomingMessage.type) {
        case "promptCreated":
          const { prompt } =
            incomingMessage as EventTemplate<PromptCreatedEventArgs>;
          setPrompt(prompt);
          return;
        case "responseStream":
          const { data: chunk } =
            incomingMessage as EventTemplate<ResponseStreamEventArgs>;
          data = data + chunk;
          setData(data);
          setBytesReceived(data.length);
          return;
      }
    }
    window.addEventListener("message", listeners);
    getVsCodeApi().postMessage({ type: "webviewReady" });
    return () => window.removeEventListener("message", listeners);
  }, []);

  function cancel() {
    getVsCodeApi().postMessage({ type: "cancel" });
  }

  return (
    <div>
      <h1>
        Generating ({args.api}:{args.model})
      </h1>
      <CSFormField>
        <VSCodeButton onClick={cancel}>Cancel</VSCodeButton>
      </CSFormField>
      <VSCodeDivider />
      <h3>Response</h3>
      <CSFormField>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <VSCodeProgressRing />{" "}
          <div style={{ marginLeft: "1em" }}>
            Received: {bytesReceived} bytes
          </div>
        </div>
      </CSFormField>
      <pre>{data || "generating..."}</pre>
      <VSCodeDivider style={{ marginTop: "1em" }} />
      <h3>Prompt</h3>
      <pre>{prompt}</pre>
    </div>
  );
}