//v9
// import * as Sentry from "@sentry/react-router";
// import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Sentry.init({
//   dsn: "https://0f5aa400429e7f9f66d912e3daeb5aa8@o4509231123726336.ingest.us.sentry.io/4509231125692416",

//   // Adds request headers and IP for users, for more info visit:
//   // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
//   sendDefaultPii: true,

//   integrations: [nodeProfilingIntegration()],
//   tracesSampleRate: 1.0, // Capture 100% of the transactions
//   profilesSampleRate: 1.0, // profile every transaction
// });
//v11
import * as Sentry from "@sentry/react-router";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://0f5aa400429e7f9f66d912e3daeb5aa8@o4509231123726336.ingest.us.sentry.io/4509231125692416",

  // In v11, sendDefaultPii is deprecated. 
  // Broad data collection (IPs, request headers, cookies) is now ON by default.
  // You can optionally explicitly configure it like this:
  dataCollection: {
    userInfo: true,
    httpHeaders: true,
    cookies: true,
  },

  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0, // Capture 100% of the traces
  profilesSessionSampleRate: 1.0, // Profile every transaction
  profileLifecycle:"trace", // Profile every transaction
});
