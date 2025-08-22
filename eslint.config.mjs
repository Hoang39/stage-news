import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    ...compat.extends("prettier"),
    {
        plugins: {
            prettier: (await import("eslint-plugin-prettier")).default
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "@next/next/no-html-link-for-pages": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "prettier/prettier": "error",
            "arrow-body-style": "off",
            "prefer-arrow-callback": "off"
        }
    }
];

export default eslintConfig;
