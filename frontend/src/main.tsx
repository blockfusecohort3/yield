// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AppKitProvider } from "./components/AppKitProvider.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppKitProvider>
        <App />
        {/* Toast provider */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: { style: { background: "green", color: "white" } },
            error: { style: { background: "red", color: "white" } },
          }}
        />
      </AppKitProvider>
    </BrowserRouter>
  </React.StrictMode>
);
