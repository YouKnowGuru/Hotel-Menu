import { createRoot } from "react-dom/client";
import { AppUiProvider } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import { App } from "./app";
import "./styles.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <AppUiProvider>
      <App />
    </AppUiProvider>
  );
}
