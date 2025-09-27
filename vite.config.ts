import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "js-qz",
  project: "travel-agency",
  // An auth token is required for uploading source maps.
  authToken: "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"
  // ...
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