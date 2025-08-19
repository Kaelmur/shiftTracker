const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const typescriptPlugin = require("@typescript-eslint/eslint-plugin");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*"],

    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },

    rules: {
      // 💥 Prevent using async in useEffect
      "no-async-promise-executor": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            // 🔒 Protect useEffect
            attributes: false,
            asyncFunctions: true,
          },
        },
      ],
    },
  },
]);
