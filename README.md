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
title: Understanding JavaScript Closures - A Deep Dive
description: Explore the fascinating world of JavaScript closures with practical examples and real-world applications that will enhance your coding skills
date: 2025-01-15
author: Sarah Chen
tags: [javascript, programming, closures, web-development]
---

# Understanding JavaScript Closures - A Deep Dive

JavaScript closures are one of the most powerful yet misunderstood concepts in the language. Today, we'll demystify closures and explore how they can make your code more **elegant**, **efficient**, and **maintainable**.

## What Are Closures?

A closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.

## Practical Examples

Here's a simple example that demonstrates closure behavior:

    function createCounter() {
      let count = 0;

      return function() {
        count++;
        return count;
      };
    }

    const counter = createCounter();
    console.log(counter()); // 1
    console.log(counter()); // 2
    console.log(counter()); // 3

## Real-World Applications

Closures are incredibly useful for:

- **Data Privacy** - Creating private variables and methods
- **Module Pattern** - Organizing code into reusable modules
- **Event Handlers** - Maintaining state in asynchronous operations
- **Partial Application** - Creating specialized functions

## Advanced Pattern: Module Pattern

    const Calculator = (function() {
      let result = 0;

      return {
        add: function(x) {
          result += x;
          return this;
        },
        multiply: function(x) {
          result *= x;
          return this;
        },
        getResult: function() {
          return result;
        }
      };
    })();

    // Usage: Calculator.add(5).multiply(3).getResult(); // 15

> "Closures are not magic, they're just functions that remember the environment in which they were created." - Kyle Simpson

## Performance Considerations

While closures are powerful, be mindful of memory usage. Variables referenced by closures remain in memory, so avoid creating unnecessary closures in performance-critical code.

## Conclusion

Mastering closures will significantly improve your JavaScript skills. Practice with different patterns and soon you'll be writing more sophisticated and maintainable code!
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