import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ToastProvider from "./shared/component/ToastProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const modalRootId = "modal-root";
if (!document.getElementById(modalRootId)) {
  const div = document.createElement("div");
  div.id = modalRootId;
  document.body.appendChild(div);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastProvider />
    </QueryClientProvider>
  </StrictMode>,
);
