import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VisibilityProvider, debugData } from "@gns/helix";
import { ToastProvider, TooltipProvider } from "@gns/ui";
import { App } from "./App";
import "./styles.css";

// Outside the client there is no Lua to open the UI, so fake the event.
debugData([{ name: "gnsui:setVisible", data: true }]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VisibilityProvider>
      <TooltipProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </TooltipProvider>
    </VisibilityProvider>
  </StrictMode>,
);
