import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    ".claude/**",
    "worker/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },
]);

export default eslintConfig;
