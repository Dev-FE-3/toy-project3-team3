import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ToastProvider from "./shared/component/ToastProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastProvider />
    </QueryClientProvider>
  </StrictMode>,
);
