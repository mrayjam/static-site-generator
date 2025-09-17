# TypeScript Static Site Generator

A powerful TypeScript static site generator that converts Markdown files into HTML with syntax highlighting and multiple theme support.

## What it does

This tool transforms Markdown files with frontmatter into static HTML pages with:

- **Markdown Processing**: Converts `.md` files to HTML with frontmatter support
- **Syntax Highlighting**: Code blocks highlighted using PrismJS with 8 available themes
- **Watch Mode**: Automatic rebuilding when files change during development
- **Theme Support**: Multiple PrismJS themes (default, dark, funky, okaidia, twilight, coy, solarizedlight, tomorrow)
- **Asset Management**: Automatically copies CSS and JavaScript assets
- **CLI Interface**: Simple command-line tool for building sites

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/aymanebouljam/static-site-generator.git
cd static-site-generator
npm install
```

Build the project:

```bash
npm run build
```

## Commands

### Development Commands
```bash
# Build and watch for changes (recommended for development)
npm run dev

# Build with watch mode and specific theme
npm run dev:watch
npm run dev:dark
npm run dev:light
```

### Production Commands
```bash
# Build the site once
npm start

# Build with specific themes
npm start:dark
npm start:light
```

### Utility Commands
```bash
# Clean generated files
npm run clean
npm run clean:site

# Code quality
npm run lint
npm run format
npm run type-check
npm run test

# Run all checks
npm run check-all
```

## Demo Example

1. **Create a Markdown file** (`content/blog.md`):
```markdown
---
title: My First Post
description: A sample blog post
date: 2025-01-15
tags: [typescript, markdown, ssg]
---

# My First Post

This is a sample blog post with **bold text** and *italic text*.

## Code Example

```typescript
interface User {
  name: string;
  email: string;
}

const user: User = {
  name: "John Doe",
  email: "john@example.com"
};
```

2. **Generate the site**:
```bash
npm run dev
```

3. **View the result**: Open `site/blog.html` in your browser to see the generated HTML page with syntax highlighting and styling.

## Theme Usage

You can use different syntax highlighting themes by running specific commands:

```bash
# Use dark theme
npm run dev:dark

# Use light theme (tomorrow)
npm run dev:light

# Production builds with themes
npm run start:dark
npm run start:light
```

For custom themes, you can also use the built project directly:
```bash
npm run build
node dist/cli/index.js build ./content ./site --theme okaidia
node dist/cli/index.js build ./content ./site --theme funky --watch
```

## Available Themes

- `default` - Standard PrismJS theme
- `dark` - Dark theme
- `funky` - Colorful theme
- `okaidia` - Okaidia theme
- `twilight` - Twilight theme
- `coy` - Coy theme
- `solarizedlight` - Solarized Light theme
- `tomorrow` - Tomorrow theme