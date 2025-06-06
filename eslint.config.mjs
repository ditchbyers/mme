import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import next from "eslint-plugin-next"
import tailwindcss from "eslint-plugin-tailwindcss"
import tseslint from "typescript-eslint"

export default [
  // Base JavaScript + TypeScript setup
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Next.js + Tailwind + Prettier
  next.configs["core-web-vitals"],
  {
    plugins: {
      tailwindcss,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react/jsx-key": "off",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/classnames-order": "error",
      "@typescript-eslint/no-require-imports": "off",
    },
    settings: {
      tailwindcss: {
        callees: ["cn"], // e.g. clsx or cn()
        config: "tailwind.config.js",
      },
      next: {
        rootDir: true,
      },
    },
  },

  // Prettier last to disable conflicting formatting rules
  {
    rules: {
      ...prettier.rules,
    },
  },

  // Parser for .ts and .tsx
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
]
