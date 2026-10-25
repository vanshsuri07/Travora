import * as Sentry from "@sentry/react-router";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

Sentry.init({
  dsn: "https://0f5aa400429e7f9f66d912e3daeb5aa8@o4509231123726336.ingest.us.sentry.io/4509231125692416",
  
  // 🔄 FIX: sendDefaultPii is deprecated in v11. 
  // Broad data collection (IPs, cookies, request headers) is enabled by default.
  // You can optionally explicitly configure your allowance parameters like this:
  dataCollection: {
    userInfo: true,
    httpHeaders: true,
    cookies: true,
  },
  
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  
  // 🔄 NOTE: Streams 100% of individual trace spans progressively in v11
  tracesSampleRate: 1.0, 
  
  // Set `tracePropagationTargets` to declare which URL(s) should have trace propagation enabled
  tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
  
  // Capture Replay for 10% of all sessions,
  // plus 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
