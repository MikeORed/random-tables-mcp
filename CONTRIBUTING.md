# Contributing to MCP Random Tables

Thank you for your interest in contributing to MCP Random Tables! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive
- Be patient and welcoming
- Be thoughtful
- Be collaborative
- When disagreeing, try to understand why

## How to Contribute

There are many ways to contribute to MCP Random Tables:

1. **Reporting bugs**: If you find a bug, please create an issue with a detailed description.
2. **Suggesting enhancements**: Have an idea for a new feature? Create an issue to discuss it.
3. **Improving documentation**: Help us improve our documentation by fixing errors or adding examples.
4. **Contributing code**: Submit pull requests with bug fixes or new features.

## Development Setup

### Prerequisites

- Node.js (v20 or higher)
- npm

### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR-USERNAME/random-tables-mcp.git
   cd random-tables-mcp
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Make your changes and commit them:

   ```bash
   git commit -m "Description of your changes"
   ```

6. Push your changes to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a pull request from your fork to the main repository

## Development Workflow

### Building the Project

```bash
npm run build
```

### Running in Development Mode

```bash
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation as needed
3. Add tests for new features
4. Ensure all tests pass
5. Make sure your code lints without errors
6. Update the CHANGELOG.md with details of your changes
7. Submit your pull request

## Coding Standards

### Code Structure

This project follows a hexagonal architecture (ports & adapters) approach:

- `src/domain/`: Core domain entities and value objects
- `src/ports/`: Interface definitions for primary and secondary ports
- `src/use-cases/`: Application use cases and service implementations
- `src/adapters/`: Primary and secondary adapters

### TypeScript Guidelines

- Use TypeScript's strict mode
- Prefer interfaces over type aliases for object types
- Use meaningful variable and function names
- Document public APIs with JSDoc comments
- Follow the existing code style

### Testing Standards

- All tests should be placed in the `test/` directory, mirroring the structure of the `src/` directory
- Write unit tests for individual components
- Write integration tests for component interactions
- Write end-to-end tests for complete workflows

## Testing

### Test Location Standard

- Tests should mirror the structure of the `src/` directory
- For example, tests for `src/adapters/secondary/rng/DefaultRandomNumberGenerator.ts` should be in `test/unit/adapters/secondary/rng/DefaultRandomNumberGenerator.test.ts`

### Test Types

- **Unit tests**: Test individual components in isolation
- **Integration tests**: Test interactions between components
- **End-to-end tests**: Test the entire system

## Issue Reporting

### Bug Reports

When reporting a bug, please include:

- A clear and descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots or code snippets if applicable
- Environment information (OS, Node.js version, etc.)

### Feature Requests

When requesting a feature, please include:

- A clear and descriptive title
- A detailed description of the proposed feature
- Any relevant examples or use cases
- Why this feature would be useful to the project

## Release Process

The project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible functionality additions
- **PATCH** version for backward-compatible bug fixes

## License

By contributing to MCP Random Tables, you agree that your contributions will be licensed under the project's MIT license.
