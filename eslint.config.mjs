import js from "@eslint/js";
import nextConfig from "eslint-config-next";

const eslintConfig = [
  js.configs.recommended,
  ...nextConfig,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unused-vars": "off",
    },
  },
  {
    ignores: [".next/", "node_modules/", "public/", "eslint.config.mjs"],
  },
];

export default eslintConfig;
