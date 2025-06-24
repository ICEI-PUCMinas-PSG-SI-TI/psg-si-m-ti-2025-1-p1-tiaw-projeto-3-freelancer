import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
    {
        rules: {
            camelcase: "warn",
            "consistent-return": "warn",
            "dot-notation": "warn",
            "no-inline-comments": "warn",
            "no-lonely-if": "warn",
            "no-nested-ternary": "warn",
            "no-var": "warn",
            "prefer-object-has-own": "warn",
            radix: "warn",
            "require-await": "warn",
            "no-eval": "warn",
            "no-continue": "warn",
            eqeqeq: ["warn", "always", { null: "ignore" }],
            "no-restricted-syntax": [
                "warn",
                {
                    selector:
                        "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error|info|trace)$/]",
                    message: "Unexpected property on console object was called",
                },
            ],
        },
    },
]);
