import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import stylistic from '@stylistic/eslint-plugin'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import eslint from '@eslint/js';
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import { fixupPluginRules } from "@eslint/compat";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
    {
        ignores: [
            "**/dist",
            "**/node_modules/",
            "**/build",
            "**/vite.config.ts",
            "**/.prettierrc.cjs",
            "**/example/",
        ]
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                Parse: "readonly",
                // ...globals.node,
            },
            parserOptions: {
                // projectService: true,
                projectService: {
                    allowDefaultProject: ['*.mjs', '*.js'],
                    defaultProject: 'tsconfig.json',
                },
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                tsconfigRootDir: import.meta.dirname,
            },
            sourceType: "module",
            ecmaVersion: 2023,
        },
    },
    jsxA11y.flatConfigs.recommended,
    {
        extends: [
            js.configs.recommended,
            eslintPluginPrettierRecommended,
            comments.recommended,
        ],
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            "react-hooks": fixupPluginRules(reactHooks),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            'react-refresh': reactRefresh,
            "prefer-arrow-functions": preferArrowFunctions,
            '@stylistic': stylistic
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            ...stylistic.configs["recommended-flat"].rules,
            "@typescript-eslint/no-empty-object-type": "off",
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            "prettier/prettier": ["off", {
                singleQuote: true,
            }],
            "@typescript-eslint/no-explicit-any": "off",
            "import/no-extraneous-dependencies": "off",
            "import/extensions": "off",
            "no-await-in-loop": "off",
            "import/no-cycle": "off",
            "no-plusplus": "off",
            "no-param-reassign": "off",
            "prefer-template": "off",
            "react/react-in-jsx-scope": "off",
            "no-console": "off",
            "import/prefer-default-export": "off",
            "global-require": "off",
            "react/require-default-props": "off",
            "react/jsx-props-no-spreading": "off",
            "jsx-a11y/label-has-associated-control": "off",
            "react/no-unescaped-entities": "off",
            "jsx-a11y/control-has-associated-label": "off",
            "react/function-component-definition": "off",
            "react/prop-types": "off",
            "max-len": "off",
            "consistent-return": "off",
            "react/no-array-index-key": "off",
            "no-restricted-syntax": "off",
            "arrow-body-style": "off",
            "prefer-arrow-callback": "off",
            "no-unsafe-optional-chaining": "error",
            "prefer-arrow-functions/prefer-arrow-functions": ["warn", {
                allowNamedFunctions: false,
                classPropertiesAllowed: false,
                disallowPrototype: false,
                returnStyle: "unchanged",
                singleReturnOnly: false,
            }],
            "require-await": "error",
            "no-use-before-define": "error",
            "array-bracket-spacing": ["error", "never"],
            "block-spacing": "error",
            "no-unused-vars": "off",
            "@eslint-community/eslint-comments/disable-enable-pair": "off",
            // ------------------------------------ //
            // ------------ @stylistic ------------ //
            // ------------------------------------ //
            "@stylistic/eol-last": "error",
            '@stylistic/semi': 'error',
            "no-useless-return": "error",
            "@stylistic/indent": ["error", 2],
            "@stylistic/keyword-spacing": ["error", { "after": true, "before": true }],
            "@stylistic/key-spacing": ["error", { "beforeColon": false,  "afterColon": true }],
            "@stylistic/lines-around-comment": ["error", { "beforeBlockComment": false }],
            "@stylistic/multiline-comment-style": ["error", "starred-block"],
            "@stylistic/multiline-ternary": "off",
            "@stylistic/no-extra-semi": "error",
            "@stylistic/no-floating-decimal": "error",
            "@stylistic/no-mixed-operators": "error",
            "@stylistic/no-mixed-spaces-and-tabs": "error",
            "@stylistic/no-multi-spaces": "error",
            "@stylistic/no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 0 }],
            "@stylistic/no-trailing-spaces": "error",

            "@stylistic/max-len": ["error", {
                "code": 110,
                // Ignore objects when enforcing line length (to avoid conflicts with object-curly-newline)
                "ignorePattern": "ImportDeclaration",
                "ignoreUrls": true,  // Optionally, you can ignore long URLs
                "ignoreStrings": true, // Ignore long strings (optional)
                "ignoreComments": true,
                "ignoreTrailingComments": true,
            }],
            "@stylistic/object-curly-newline": ["error", {
                // e.g: const a = {};
                "ObjectExpression": { "consistent": true, "multiline": true, "minProperties": 0 },
                // "ObjectExpression": { "consistent": true, "multiline": true, "minProperties": 3 },
                // e.g: const { a } = obj;
                "ObjectPattern": { "consistent": true, "multiline": true, "minProperties": 4 },
                // e.g: import { a } from 'module';
                "ImportDeclaration": { "consistent": true, "minProperties": 4 },
                // e.g: export { a } from 'module';
                "ExportDeclaration": { "consistent": true, "multiline": true, "minProperties": 3 }
            }],
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/quote-props": ["error", "as-needed"],
            "@stylistic/quotes": ["error", "single"],
            "@stylistic/rest-spread-spacing": ["error", "never"],
            "@stylistic/semi-spacing": "error",
            "@stylistic/space-before-blocks": "error",
            "@stylistic/space-in-parens": ["error", "never"],
            "@stylistic/space-unary-ops": "error",
            "@stylistic/spaced-comment": ["error", "always"],
            "@stylistic/template-curly-spacing": "error",
            "@stylistic/member-delimiter-style": "error",
            "@stylistic/padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
                { blankLine: "any",    prev: ["const", "let", "var"], next: ["const", "let", "var"]}
            ],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                "args": "all",
                "argsIgnorePattern": "^_",
                "caughtErrors": "all",
                "caughtErrorsIgnorePattern": "^_",
                "destructuredArrayIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "ignoreRestSiblings": true
                }
            ],
            "@stylistic/comma-dangle": ["error", {
                "arrays": "always-multiline",      // Trailing commas for arrays with multiple lines
                "objects": "always-multiline",     // Trailing commas for objects with multiple lines
                "imports": "always-multiline",     // Trailing commas in multi-line import statements
                "exports": "always-multiline",     // Trailing commas in multi-line export statements
                "functions": "never"               // No trailing commas for function parameters
            }],
            "@stylistic/operator-linebreak": [
                "error",
                "after",
                {
                    "overrides": {
                    "?": "before", // Example: Optional for other operators
                    ":": "before"
                    }
                }
            ],
            // ------------------------------------ //
            // ------------ typescript ------------ //
            // ------------------------------------ //
            "default-param-last": "off",
            "@typescript-eslint/default-param-last": "error",
                // Note: you must disable the base rule as it can report incorrect errors
            "max-params": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/max-params": ["error", { "max": 4 }],
            "@typescript-eslint/method-signature-style": ["error", "property"],
            "@typescript-eslint/no-array-delete": "error",
            "@typescript-eslint/no-duplicate-enum-values": "error",
            "@typescript-eslint/no-duplicate-type-constituents": "error",
            "@typescript-eslint/no-mixed-enums": "error",
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-unnecessary-boolean-literal-compare": ["error", { "allowComparingNullableBooleansToTrue": false }],
            "@typescript-eslint/no-unnecessary-template-expression": "error",
            "@typescript-eslint/no-unnecessary-type-arguments": "error",
            "@typescript-eslint/no-unsafe-function-type": "error",
            "@typescript-eslint/no-useless-empty-export": "error",
            // Note: you must disable the base rule as it can report incorrect errors
            "no-throw-literal": "off",
            "@typescript-eslint/only-throw-error": "error",
            "@typescript-eslint/prefer-find": "error",
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/array-type": "error",
            "@typescript-eslint/explicit-function-return-type": "off",
            // these 2 following rules cause performance issue
            "@typescript-eslint/await-thenable": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-enum-comparison": "off",
            "@typescript-eslint/no-redundant-type-constituents": "off",
            // This rule will not work as expected if strictNullChecks is not enabled, so it is disabled by default.
            "@typescript-eslint/prefer-nullish-coalescing": "off",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
            "@stylistic/type-generic-spacing": ["error"],
            // --------- naming-convention --------- //
            "camelcase": "off",
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "selector": "variable",
                    "modifiers": ["const"],
                    "format": ["camelCase", "UPPER_CASE", "PascalCase"]
                },
                {
                    "selector": "import",
                    "format": ["camelCase", "PascalCase", "UPPER_CASE"]
                },
                {
                    "selector": "variable",
                    "types": ["boolean"],
                    "format": ["PascalCase"],
                    // e.g: isReady, hasError, shouldFetch, ...
                    "prefix": ["is", "should", "has", "can", "did", "will", "open"],
                    "filter": {
                        // exception. e.g: loadingProjects, openDialog, LOCAL
                        "regex": "^(?:[A-Z_]+|.*loading.*|open.*)$",
                        "match": false
                    }
                },
                { "selector": "typeLike", "format": ["PascalCase"] },
                // e.g: IProject, IUser, IProjectData, ...
                { "selector": "interface", "format": ["PascalCase"], "prefix": ["I"] },
                { "selector": "typeAlias", "format": ["PascalCase"] },
                { "selector": "enumMember", "format": ["UPPER_CASE"] },
                { "selector": "class", "format": ["PascalCase"] },
                { "selector": "classProperty", "format": ["camelCase", "UPPER_CASE"] },
                { "selector": "classMethod", "format": ["camelCase"] },
                { "selector": "parameter", "format": ["camelCase"], "leadingUnderscore": "allow" },
                { "selector": "function", "format": ["camelCase"] },
                { "selector": "enum", "format": ["PascalCase"] },
            ],

            // ------------------------------------ //
            // ---------------- jsx --------------- //
            // ------------------------------------ //
            // Enforce closing bracket location in JSX
            '@stylistic/jsx-closing-bracket-location': [1, 'line-aligned'],
            '@stylistic/jsx-one-expression-per-line': [1, { allow: 'non-jsx' }],
            "@stylistic/jsx-pascal-case": [1, { allowAllCaps: false, allowNamespace: true, allowLeadingUnderscore: false }],

            "@stylistic/jsx-equals-spacing": ["error", "never"],

            "@stylistic/jsx-max-props-per-line": [
                "error",
                {
                // Maximum number of props per line
                  "maximum": { 'single': 3, 'multi': 1 },
                }
            ],
            // Force new line after opening tag if multiline
            "@stylistic/jsx-first-prop-new-line": [2, "multiline-multiprop"],
            "@stylistic/jsx-props-no-multi-spaces": "error",
            "@stylistic/jsx-tag-spacing": ["error", {
                "closingSlash": "never",
                "beforeSelfClosing": "always",
                "afterOpening": "never",
                "beforeClosing": "never"
            }],
            /**
             * Sort props in JSX
             * NOTE: comments between props (line) is not supported
             * solution: name="John" // User name
             */
            "@stylistic/jsx-sort-props": ["error", {
                "callbacksLast": true,
                "shorthandFirst": true,
                "shorthandLast": false,
                "ignoreCase": true,
                "reservedFirst": true,
                "multiline": "last",
            }],
            "@stylistic/dot-location": ["error", "property"],
            "@stylistic/curly-newline": ["error", { "minElements": 1 }],
            // Wrap multiline JSX expressions in parentheses, e.g: (<div>...</div>)
            "@stylistic/jsx-wrap-multilines": ["error", {
                "declaration": "parens-new-line",
                "assignment": "parens-new-line",
                "return": "parens-new-line",
                "arrow": "parens-new-line",
                "condition": "parens-new-line",
                "logical": "parens-new-line",
                "prop": "parens-new-line",
                "propertyValue": "parens-new-line"
            }],
        },
    },
)
