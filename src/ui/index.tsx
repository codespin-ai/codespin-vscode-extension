import { Route, Switch } from "wouter";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { Generate } from "./pages/Generate.js";
import { NavigateEventArgs } from "./webviewEvents/NavigateEventArgs.js";
import { navigate } from "wouter/use-browser-location";
import { getVsCodeApi } from "../vscode/getVsCodeApi.js";

function App() {
  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      const incomingMessage = event.data;
      switch (incomingMessage.type) {
        case "navigate":
          const eventArgs = incomingMessage as NavigateEventArgs;
          navigate(eventArgs.url);
          getVsCodeApi().postMessage({
            type: "navigated",
            url: eventArgs.url,
          });
      }
    });

    getVsCodeApi().postMessage({ type: "webviewReady" });
  }, []);

  return (
    <>
      <Switch>
        <Route path="/generate" component={Generate} />
        <Route></Route>
      </Switch>
    </>
  );
}

export function initWebView() {
  function onReady() {
    const domRootNode = document.getElementById("root")!;
    const root = createRoot(domRootNode);
    root.render(<App />);
  }

  if (document.readyState === "complete") {
    onReady();
  } else {
    window.addEventListener("DOMContentLoaded", onReady);
  }
}
