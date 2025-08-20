import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import { buildSite } from '../src/generator';
import type { BuildOptions } from '../src/generator';

describe('Integration Tests', () => {
  const testInputDir = path.join(__dirname, 'temp-input');
  const testOutputDir = path.join(__dirname, 'temp-output');

  beforeEach(async () => {
    // Create test directories
    await fs.mkdir(testInputDir, { recursive: true });
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directories
    try {
      await fs.rm(testInputDir, { recursive: true, force: true });
      await fs.rm(testOutputDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Full build process', () => {
    it('should build a complete site from markdown files', async () => {
      // Create test markdown files
      const testMarkdown1 = `---
title: Test Page 1
date: 2025-08-05
author: Test Author
description: A test page
tags: [test, markdown]
---

# Test Page 1

This is a test page with **bold text** and \`inline code\`.

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

- List item 1
- List item 2
`;

      const testMarkdown2 = `---
title: Test Page 2
date: 2025-08-06
---

# Another Test Page

This page has minimal frontmatter.

> This is a blockquote.
`;

      await fs.writeFile(path.join(testInputDir, 'page1.md'), testMarkdown1);
      await fs.writeFile(path.join(testInputDir, 'page2.md'), testMarkdown2);

      // Create subdirectory with nested file
      const subDir = path.join(testInputDir, 'blog');
      await fs.mkdir(subDir);
      await fs.writeFile(path.join(subDir, 'nested.md'), `# Nested Page\n\nContent`);

      // Build the site
      const options: BuildOptions = { theme: 'default' };
      await buildSite(testInputDir, testOutputDir, options);

      // Verify output structure
      const outputFiles = await fs.readdir(testOutputDir);
      expect(outputFiles).toContain('page1.html');
      expect(outputFiles).toContain('page2.html');
      expect(outputFiles).toContain('assets');

      // Verify nested structure
      const blogDir = path.join(testOutputDir, 'blog');
      const blogFiles = await fs.readdir(blogDir);
      expect(blogFiles).toContain('nested.html');

      // Verify assets were copied
      const assetsDir = path.join(testOutputDir, 'assets');
      const assetFiles = await fs.readdir(assetsDir);
      expect(assetFiles).toContain('style.css');
      expect(assetFiles).toContain('prism.css');
      expect(assetFiles).toContain('prism.js');

      // Verify HTML content
      const page1Content = await fs.readFile(path.join(testOutputDir, 'page1.html'), 'utf-8');
      expect(page1Content).toContain('<!DOCTYPE html>');
      expect(page1Content).toContain('<title>Test Page 1</title>');
      expect(page1Content).toContain('<h1>Test Page 1</h1>');
      expect(page1Content).toContain('Test Author');
      expect(page1Content).toContain('8/5/2025');
      expect(page1Content).toContain('<span class="tag">test</span>');
      expect(page1Content).toContain('<span class="tag">markdown</span>');
      expect(page1Content).toContain('Created By Aymane Bouljam');

      const page2Content = await fs.readFile(path.join(testOutputDir, 'page2.html'), 'utf-8');
      expect(page2Content).toContain('<title>Test Page 2</title>');
      expect(page2Content).toContain('<blockquote>');
    });

    it('should work with different themes', async () => {
      await fs.writeFile(path.join(testInputDir, 'test.md'), '# Test\n\nContent');

      const options: BuildOptions = { theme: 'okaidia' };
      await buildSite(testInputDir, testOutputDir, options);

      // Verify theme-specific assets
      const prismCss = await fs.readFile(path.join(testOutputDir, 'assets', 'prism.css'), 'utf-8');
      expect(prismCss).toContain('okaidia'); // Theme-specific CSS should be present

      const styleCss = await fs.readFile(path.join(testOutputDir, 'assets', 'style.css'), 'utf-8');
      expect(styleCss).toContain('okaidia'); // Theme name should appear in generated CSS
    });

    it('should handle empty input directory', async () => {
      const options: BuildOptions = { theme: 'default' };

      await expect(buildSite(testInputDir, testOutputDir, options)).resolves.not.toThrow();

      // Should still create output directory and assets
      const outputExists = await fs.access(testOutputDir).then(() => true).catch(() => false);
      expect(outputExists).toBe(true);
    });

    it('should handle files with no frontmatter', async () => {
      await fs.writeFile(path.join(testInputDir, 'simple.md'), '# Simple Page\n\nNo frontmatter here.');

      const options: BuildOptions = { theme: 'default' };
      await buildSite(testInputDir, testOutputDir, options);

      const content = await fs.readFile(path.join(testOutputDir, 'simple.html'), 'utf-8');
      expect(content).toContain('<title>Untitled</title>');
      expect(content).toContain('<h1>Simple Page</h1>');
    });

    it('should handle special characters in file names', async () => {
      await fs.writeFile(path.join(testInputDir, 'file with spaces.md'), '# Spaced File\n\nContent');
      await fs.writeFile(path.join(testInputDir, 'file-with-dashes.md'), '# Dashed File\n\nContent');

      const options: BuildOptions = { theme: 'default' };
      await buildSite(testInputDir, testOutputDir, options);

      const outputFiles = await fs.readdir(testOutputDir);
      expect(outputFiles).toContain('file with spaces.html');
      expect(outputFiles).toContain('file-with-dashes.html');
    });

    it('should preserve directory structure', async () => {
      // Create nested directory structure
      const level1 = path.join(testInputDir, 'level1');
      const level2 = path.join(level1, 'level2');
      await fs.mkdir(level1, { recursive: true });
      await fs.mkdir(level2, { recursive: true });

      await fs.writeFile(path.join(level1, 'file1.md'), '# Level 1 File\n\nContent');
      await fs.writeFile(path.join(level2, 'file2.md'), '# Level 2 File\n\nContent');

      const options: BuildOptions = { theme: 'default' };
      await buildSite(testInputDir, testOutputDir, options);

      // Verify nested structure is preserved
      const level1Output = path.join(testOutputDir, 'level1');
      const level2Output = path.join(level1Output, 'level2');

      const level1Files = await fs.readdir(level1Output);
      const level2Files = await fs.readdir(level2Output);

      expect(level1Files).toContain('file1.html');
      expect(level2Files).toContain('file2.html');
    });

    it('should handle invalid markdown gracefully', async () => {
      // Create file with malformed frontmatter
      const invalidMarkdown = `---
title: Test
invalid-yaml: [unclosed array
---

# Content`;

      await fs.writeFile(path.join(testInputDir, 'invalid.md'), invalidMarkdown);

      const options: BuildOptions = { theme: 'default' };

      // Should not throw, but handle gracefully
      await expect(buildSite(testInputDir, testOutputDir, options)).resolves.not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should handle multiple files efficiently', async () => {
      // Create many test files
      const fileCount = 50;
      const promises = [];

      for (let i = 0; i < fileCount; i++) {
        const content = `---
title: Test File ${i}
date: 2025-08-${String(i % 28 + 1).padStart(2, '0')}
---

# Test File ${i}

This is test file number ${i}.

## Section

Some content here.
`;
        promises.push(fs.writeFile(path.join(testInputDir, `file${i}.md`), content));
      }

      await Promise.all(promises);

      const startTime = Date.now();
      const options: BuildOptions = { theme: 'default' };
      await buildSite(testInputDir, testOutputDir, options);
      const endTime = Date.now();

      // Should complete in reasonable time (less than 10 seconds for 50 files)
      expect(endTime - startTime).toBeLessThan(10000);

      // Verify all files were processed
      const outputFiles = await fs.readdir(testOutputDir);
      const htmlFiles = outputFiles.filter(f => f.endsWith('.html'));
      expect(htmlFiles).toHaveLength(fileCount);
    });
  });
});