import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext";
import { PopupProvider } from "./context/PopupContext.jsx";
// import "antd/dist/reset.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PopupProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </PopupProvider>
  </StrictMode>,
);
