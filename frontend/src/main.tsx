import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";
import { router } from "@/router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={150}>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            className: "!text-sm !rounded-xl !shadow-lg !border !border-border",
            success: { iconTheme: { primary: "oklch(0.6 0.15 160)", secondary: "white" } },
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
