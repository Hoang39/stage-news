module.exports = {
    arrowParens: "always", // Always use parentheses for arrow function parameters
    semi: true, // Always add semicolons at the end of statements
    trailingComma: "none", // Don't add trailing commas at the end of objects/arrays
    tabWidth: 4, // Use 4 spaces for each indentation level
    endOfLine: "auto", // Automatically handle line endings (LF/CRLF) based on operating system
    useTabs: false, // Use spaces instead of tabs
    singleQuote: false, // Use double quotes for strings
    printWidth: 120, // Maximum line length before wrapping
    jsxSingleQuote: true, // Use single quotes for JSX attributes
    importOrder: [
        // Import statement ordering
        "^(react/(.*)$)|^(react$)", // React imports first
        "^(next/(.*)$)|^(next$)", // Next.js imports second
        "<THIRD_PARTY_MODULES>", // Third-party libraries
        "^@/(.*)$", // Absolute imports from @/ alias
        "(.css|.scss)$", // CSS/SCSS imports
        "^[./]", // Relative imports
        "^types$" // Type imports
    ],
    importOrderSeparation: true, // Add blank lines between import groups
    importOrderSortSpecifiers: true, // Sort named imports alphabetically
    plugins: ["@trivago/prettier-plugin-sort-imports"] // Plugin for sorting import statements
};
