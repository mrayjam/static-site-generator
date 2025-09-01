# TypeScript Static Site Generator

A powerful and lightweight static site generator built with TypeScript that transforms Markdown files into beautiful HTML pages with syntax highlighting support.

## Features

- **Markdown Processing**: Full support for Markdown with frontmatter metadata
- **Syntax Highlighting**: Built-in code syntax highlighting using PrismJS
- **Theme Support**: Multiple syntax highlighting themes (dark, light, tomorrow)
- **Watch Mode**: Development server with automatic rebuilding
- **TypeScript**: Written entirely in TypeScript with strict type checking
- **CLI Interface**: Simple command-line interface for easy usage
- **Fast Builds**: Efficient file processing and HTML generation

## Installation

Clone the repository and build from source:

```bash
git clone https://github.com/aymanebouljam/static-site-generator.git
cd static-site-generator
npm install
npm run build
```

## Usage

### Basic Build

```bash
npm run start -- build <input-dir> <output-dir>
```

### Development Mode

```bash
npm run dev:watch
```

### Theme Selection

```bash
npm run dev:dark    # Dark theme
npm run dev:light   # Light theme
```

## Project Structure

```
content/           # Your Markdown files
├── index.md
├── about.md
└── posts/
    └── hello.md

site/             # Generated HTML output
├── index.html
├── about.html
└── posts/
    └── hello.html
```

## Frontmatter Support

Add metadata to your Markdown files using YAML frontmatter:

```markdown
---
title: Hello World
description: My first post
date: 2025-07-28
---

# Hello World

Your content here...
```

## Development

### Prerequisites

- Node.js 18 or higher
- TypeScript 5.0 or higher

### Available Scripts

```bash
npm run build          # Build the project
npm run dev            # Run in development mode
npm run dev:watch      # Development with watch mode
npm run dev:dark       # Development with dark theme
npm run dev:light      # Development with tomorrow theme
npm run start          # Run built CLI
npm run clean          # Clean build and site directories
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run test           # Run tests
npm run type-check     # TypeScript type checking
npm run check-all      # Run all checks (lint, format, test, types)
```

## Configuration

The project uses TypeScript with strict mode enabled and includes:

- ESLint for code linting with TypeScript support
- Prettier for code formatting
- Jest for comprehensive testing
- PrismJS for syntax highlighting

## Architecture

The generator consists of several core modules:

- **Generator**: Main site generation logic with Markdown processing
- **Template**: HTML template rendering system
- **Highlighting**: PrismJS syntax highlighting integration
- **Utils**: File system utilities and helper functions
- **CLI**: Command-line interface with Commander.js

