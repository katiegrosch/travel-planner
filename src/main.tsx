import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";

// Initialize Sentry
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "https://43706f904960fa31803a681ee8c10cac@o4510346823335936.ingest.us.sentry.io/4510346872160256",
  environment: import.meta.env.MODE || "development",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring - lower in production
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  // Set tracePropagationTargets to control distributed tracing
  tracePropagationTargets: [
    "localhost", 
    /^https:\/\/travel-planner-stripe\.onrender\.com/,
  ],
  // Session Replay - lower in production
  replaysSessionSampleRate: import.meta.env.PROD ? 0.01 : 0.1,
  replaysOnErrorSampleRate: 1.0, // Always capture sessions with errors
});

createRoot(document.getElementById("root")!).render(<App />);
