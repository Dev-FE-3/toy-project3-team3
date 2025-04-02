import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const modalRootId = "modal-root";
if (!document.getElementById(modalRootId)) {
  const div = document.createElement("div");
  div.id = modalRootId;
  document.body.appendChild(div);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
