import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
	  "**/.next/**",
	  "**/out/**",
	  "**/build/**",
    "next-env.d.ts",

	  // Ignore legacy / nested workspace copy (apps/web)
	  "apps/**",

    // macOS AppleDouble + filesystem metadata (can appear on external drives)
    "**/._*",
    "**/.DS_Store",
    "**/.AppleDouble/**",
  ]),
]);

export default eslintConfig;
