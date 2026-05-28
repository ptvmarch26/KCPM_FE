import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { PopupProvider } from "./context/PopupContext.jsx";
import { UserProvider } from "./context/UserContext";
import { DeviceProvider } from "./context/DeviceContext";
import { MaintenancePlanProvider } from "./context/MaintenancePlanContext";
import { RepairPlanProvider } from "./context/RepairPlanContext";
import { WorkHistoryProvider } from "./context/WorkHistoryContext";
// import "antd/dist/reset.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PopupProvider>
      <AuthProvider>
        <WorkHistoryProvider>
          <DeviceProvider>
            <MaintenancePlanProvider>
              <RepairPlanProvider>
                <UserProvider>
                  <App />
                </UserProvider>
              </RepairPlanProvider>
            </MaintenancePlanProvider>
          </DeviceProvider>
        </WorkHistoryProvider>
      </AuthProvider>
    </PopupProvider>
  </StrictMode>,
);
