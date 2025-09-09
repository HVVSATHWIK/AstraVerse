# Contributing to AstraAI

Thank you for your interest in contributing to AstraAI! This document outlines the guidelines for contributing to the project.

## Code of Conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## How to Contribute

1. **Fork the Repository**: Create a fork of the AstraVerse repository on GitHub.
2. **Create a Feature Branch**: Use a descriptive name, e.g., `git checkout -b feature/add-new-integration`. **Follow the convention: `type/description`** (e.g., `feat/add-zoom-integration`, `fix/workflow-bug`).

| Type | Description | Example |
|------|-------------|---------|
| feat | New feature | `feat/add-user-auth` |
| fix | Bug fix | `fix/resolve-api-error` |
| docs | Documentation | `docs/update-readme` |
| refactor | Code refactor | `refactor/cleanup-components` |
3. **Make Changes**: Ensure your code follows the project's coding standards.
4. **Test Thoroughly**: Run tests and verify functionality.
5. **Submit a Pull Request**: Provide a clear description of your changes. Before submitting, ensure all commits are signed (Developer Certificate of Origin). To sign: `git commit -s -m "Your message"`.

## Coding Standards

- Use TypeScript for all new code.
- Follow ESLint and Prettier configurations.
- Write meaningful commit messages using Conventional Commits (e.g., `feat: add new integration`, `fix: resolve bug in workflow`).
- Include tests for new features.

## Testing

We use Vitest + React Testing Library for testing. Run `npm test` to execute the test suite. Run `npm install` and `npm run dev` before testing changes. Aim for high test coverage on new code.

If adding a new integration, include at least one end-to-end test. For integration tests, use `npm run test:e2e` (planned for future CI setup).

## Pull Request Expectations

- PRs require at least one reviewer approval.
- Must pass CI checks (linting, tests, build).
- Include a changelog entry if user-facing changes are made.
- Provide a clear description of changes and any breaking changes.
- Draft PRs are welcome for early feedback.

## Reporting Issues

Use GitHub Issues to report bugs or suggest features. Provide as much detail as possible. [Open Issues](../../issues).

*Tip: Look for issues labeled `good first issue` or `help wanted` to start contributing easily.*

## Questions?

Reach out via GitHub Discussions or email.

### Example Workflow

```
git checkout -b feat/add-zoom-integration
git commit -s -m "feat: add zoom meeting transcription integration"
git push origin feat/add-zoom-integration
```
