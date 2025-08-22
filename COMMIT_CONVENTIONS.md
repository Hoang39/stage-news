# Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to ensure consistency in commit messages.

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Changes that don't affect code (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build process or tools
- **ci**: CI/CD changes
- **build**: Build system changes
- **revert**: Revert previous commit

## Examples

### Simple commit

```
feat: add user authentication
fix: resolve login button not working
docs: update API documentation
```

### Commit with scope

```
feat(auth): add OAuth2 support
fix(api): resolve user creation endpoint
docs(readme): add installation instructions
```

### Commit with body

```
feat: add user dashboard

- Implement user profile view
- Add settings page
- Include activity history
```

### Commit with breaking change

```
feat!: change authentication API

BREAKING CHANGE: The authentication endpoint now requires JWT token in header instead of query parameter.
```

## Rules

1. **Type** must be one of the defined values
2. **Type** and **description** must be lowercase
3. **Description** cannot be empty
4. **Description** cannot end with a period
5. **Header** cannot exceed 72 characters
6. **Body** and **footer** each line cannot exceed 100 characters

## Common Errors

- `type-enum`: Invalid type
- `type-case`: Type must be lowercase
- `subject-empty`: Description cannot be empty
- `subject-full-stop`: Description cannot end with a period
- `header-max-length`: Header too long

## Commit Validation

To validate commit messages:

```bash
npm run commitlint
```

## Lint-staged

Before committing, code will be automatically formatted and linted through lint-staged:

- ESLint will check and fix errors
- Prettier will format code
- CommitLint will validate commit messages
