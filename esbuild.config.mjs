import { build } from "esbuild";
import { resolve } from "node:path";

const projectRoot = resolve(".");

await Promise.all([
  build({
    absWorkingDir: projectRoot,
    entryPoints: ["app/entry.client.tsx"],
    outfile: "build/esbuild/client.js",
    bundle: true,
    format: "esm",
    platform: "browser",
    sourcemap: true,
    minify: true,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    loader: {
      ".tsx": "tsx",
      ".ts": "ts",
    },
  }),
  build({
    absWorkingDir: projectRoot,
    entryPoints: ["app/entry.server.tsx"],
    outfile: "build/esbuild/server.js",
    bundle: true,
    format: "esm",
    platform: "node",
    packages: "external",
    sourcemap: true,
    minify: true,
    alias: {
      "~": resolve(projectRoot, "app"),
    },
    loader: {
      ".tsx": "tsx",
      ".ts": "ts",
    },
  }),
]);

console.log("esbuild completed: build/esbuild/client.js and build/esbuild/server.js");
