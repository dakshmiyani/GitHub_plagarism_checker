# Contributing to RepoLens 🔭

First off, thank you for considering contributing to RepoLens! It's people like you that make RepoLens a great tool for the community.

---

## 🏗️ Getting Started

### 1. Find an Issue
- Check the [Issues tab](https://github.com/dakshmiyani/GitHub_plagarism_checker/issues) for curated "Good First Issues" or roadmap items.
- If you have a new idea or found a bug, [open a new issue](https://github.com/dakshmiyani/GitHub_plagarism_checker/issues/new) first to discuss it.

### 2. Local Setup
Follow the instructions in the [README.md](./README.md) to get the Client, Server, and Worker running.
- Ensure you have a local PostgreSQL and Redis instance active.
- Use the provided `.env` template in the README.

---

## 🌿 Branching Strategy

We use a simple branching model:
- `main`: Production-ready code.
- `feature/your-feature-name`: For new features.
- `bugfix/issue-description`: For bug fixes.

**Workflow**:
1. Fork the repository.
2. Create elective branch from `main`.
3. Commit your changes.
4. Push to your fork and submit a Pull Request.

---

## 📜 Coding Standards

- **JavaScript/React**: Use functional components and hooks. Follow the existing ESLint configuration in the `client` directory.
- **Backend**: Ensure all new API endpoints are validated using `Joi`.
- **Formatting**: We use Prettier for consistent code style. Please run `npm run format` (if available) or ensure your editor handles formatting on save.
- **Naming**: Use `camelCase` for variables and functions, `PascalCase` for React components.

---

## 💬 Commit Message Guidelines

To keep the history clean, please use descriptive commit messages. We recommend the following format:
- `feat: add PDF export to dashboard`
- `fix: resolve crash in TechStackDonut on empty data`
- `docs: update setup steps in README`
- `refactor: simplify similarity calculation logic`

---

## ⚓ Pull Request Process

1. **Update and Rebase**: Ensure your branch is up to date with `main` before submitting.
2. **Screenshots/GIFs**: If you changed the UI, please include a screenshot or screen recording in your PR.
3. **Description**: Clearly explain the "Why" and "How" of your changes.
4. **Review**: At least one maintainer will review your code. Please address any requested changes promptly.

---

## ⚖️ Code of Conduct
By contributing to this project, you agree to abide by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md).

---

**Happy Coding!** 🔭💙✨
