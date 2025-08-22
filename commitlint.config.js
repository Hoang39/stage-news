module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "feat", // New features
                "fix", // Bug fixes
                "docs", // Documentation changes
                "style", // Code style changes (formatting, missing semicolons, etc.)
                "refactor", // Code refactoring
                "perf", // Performance improvements
                "test", // Adding or updating tests
                "chore", // Build process or auxiliary tool changes
                "ci", // CI/CD changes
                "build", // Build system changes
                "revert" // Revert previous commits
            ]
        ],
        "type-empty": [2, "never"],
        "subject-empty": [2, "never"],
        "subject-full-stop": [2, "never", "."],
        "header-max-length": [2, "always", 72],
        "body-max-line-length": [2, "always", 200],
        "footer-max-line-length": [2, "always", 200]
    }
};
