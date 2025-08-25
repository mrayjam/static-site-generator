---
title: Welcome to TypeScript SSG
date: 2025-08-05
author: TypeScript SSG
description: A powerful static site generator built with TypeScript
tags: [typescript, ssg, markdown, static-site]
---

# Welcome to TypeScript SSG

This is an example Markdown file that demonstrates the features of our TypeScript Static Site Generator.

## Features

- **Markdown to HTML conversion** using `marked`
- **Frontmatter support** with `myst-frontmatter`
- **Syntax highlighting** with PrismJS
- **File watching** for development
- **Clean CLI interface** with Commander
- **Styled output** with Chalk

## Code Example

Here's a TypeScript function that demonstrates syntax highlighting:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email
  };
}

const user = createUser("John Doe", "john@example.com");
console.log(`Created user: ${user.name}`);
```

## JavaScript Example

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
npx ts-node src/cli/index.ts build ./content ./dist
```

Enjoy using TypeScript SSG!