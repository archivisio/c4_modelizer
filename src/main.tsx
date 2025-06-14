import UpdateNotification from "@/components/UpdateNotification";
import { loadPlugins } from "@/plugins/manager";
import PortalTarget from "@/slots/PortalTarget.tsx";
import { DialogProvider } from "@contexts/DialogProvider.tsx";
import { ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import RootProviderSlot from "./RootProviderSlot.tsx";
import theme from "./theme/theme";

loadPlugins().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <RootProviderSlot>
          <DialogProvider>
            <App />
            <UpdateNotification />
          </DialogProvider>
        </RootProviderSlot>
        <PortalTarget id="global-overlay" />
      </ThemeProvider>
    </StrictMode>
  );
});
