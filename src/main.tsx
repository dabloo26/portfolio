import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const root = createRoot(document.getElementById("root")!);
const app = import.meta.env.DEV ? (
  <StrictMode>
    <App />
  </StrictMode>
) : (
  <App />
);
root.render(app);
