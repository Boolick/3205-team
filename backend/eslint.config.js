const js = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
  {
    ignores: ["dist", "node_modules", "coverage"],
  },
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
        ecmaVersion: 2020,
        lib: ["ES2020"],
      },
      globals: {
        // Node.js globals
        NodeJS: "readonly",
        process: "readonly",
        console: "readonly",
        global: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        setInterval: "readonly",
        setImmediate: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
        clearInterval: "readonly",
        clearImmediate: "readonly",
        clearTimeout: "readonly",
        // Web APIs (available in Node.js 15+)
        fetch: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",
        // Jest globals
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      ...prettierPlugin.configs.recommended.rules,

      // ЖЕСТКИЙ ТАЙПСКРИПТ
      "@typescript-eslint/no-explicit-any": "error", // Никаких any!
      "@typescript-eslint/explicit-function-return-type": "warn", // Требуем явные типы возврата
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // ЧИСТОТА КОДА
      "no-console": ["warn", { allow: ["warn", "error", "log"] }],
      "no-useless-assignment": "warn",
    },
  },
];
