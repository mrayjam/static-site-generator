---
title: Getting Started Guide
date: 2025-08-10
author: Documentation Team
description: Learn how to get started with TypeScript SSG
tags: [guide, tutorial, getting-started]
---

# Getting Started with TypeScript SSG

This guide will help you get up and running with TypeScript SSG quickly.

## Prerequisites

- Node.js 16 or higher
- npm or yarn package manager

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Generate your site:**
   ```bash
   npx ts-node src/cli/index.ts build ./content ./dist
   ```

## Project Structure

Your project should follow this structure:

```
my-site/
├── content/           # Your Markdown files
│   ├── index.md
│   └── posts/
├── dist/             # Generated HTML output
└── package.json
```

## Frontmatter Options

You can use these frontmatter fields in your Markdown files:

- `title`: Page title
- `date`: Publication date
- `author`: Author name
- `description`: Page description for SEO
- `tags`: Array of tags

## Available Themes

TypeScript SSG supports several PrismJS themes for syntax highlighting:

- `default` - Clean and simple
- `dark` - Dark theme
- `okaidia` - Popular dark theme
- `tomorrow` - Light theme with subtle colors

Use the `--theme` option:

```bash
npx ts-node src/cli/index.ts build ./content ./dist --theme okaidia
```

## Watch Mode

For development, use watch mode to automatically rebuild when files change:

```bash
npx ts-node src/cli/index.ts build ./content ./dist --watch
```

Happy building! 🚀