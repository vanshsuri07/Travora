import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from "@sentry/react-router/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "js-qz",
  project: "travel-agency",
  // An auth token is required for uploading source maps.
  // You can find your auth token in the Sentry UI at https://sentry.io/settings/<organization>/auth-tokens/
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

export default defineConfig(config => {
  return {
  plugins: [tailwindcss(),tsconfigPaths(),reactRouter(),sentryReactRouter(sentryConfig, config)],
  sentryConfig, 
  ssr:
  {
    noExternal: [],
  },
  };
});