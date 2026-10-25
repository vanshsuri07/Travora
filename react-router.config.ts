import type { Config } from "@react-router/dev/config";
// 🔄 FIX: Imported from the dedicated /vite subpath in v11
import { sentryOnBuildEnd } from "@sentry/react-router/vite"; 

export default {
  buildEnd: async ({ viteConfig, reactRouterConfig, buildManifest }) => {
    // ... Any other custom buildEnd logic
    
    // Call this at the end of the hook
    await sentryOnBuildEnd({ viteConfig, reactRouterConfig, buildManifest });
  },
} satisfies Config;
