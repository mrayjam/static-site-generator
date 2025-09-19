import * as fs from 'fs/promises';
import * as path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import chalk from 'chalk';
import { renderTemplate } from './template';
import { copyAssets, ensureDirectoryExists, readDirectoryRecursive } from './utils';
import { setupPrismHighlighting } from './highlighting';

export interface BuildOptions {
  watch?: boolean;
  theme: string;
}

export interface PageMetadata {
  title?: string;
  date?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface GeneratedPage {
  content: string;
  metadata: PageMetadata;
  outputPath: string;
  inputPath: string;
}

export async function buildSite(inputDir: string, outputDir: string, options: BuildOptions): Promise<void> {
  try {
    console.log(chalk.blue('[INFO] Reading input directory...'));

    await ensureDirectoryExists(outputDir);

    const markdownFiles = await findMarkdownFiles(inputDir);

    if (markdownFiles.length === 0) {
      console.log(chalk.yellow('[WARN] No Markdown files found'));
      return;
    }

    console.log(chalk.gray(`Found ${markdownFiles.length} Markdown files`));

    setupPrismHighlighting(options.theme);

    const generatedPages: GeneratedPage[] = [];

    for (const filePath of markdownFiles) {
      try {
        const page = await processMarkdownFile(filePath, inputDir, outputDir);
        generatedPages.push(page);

        await fs.writeFile(page.outputPath, page.content, 'utf-8');
        console.log(chalk.green(`[OK] Generated: ${path.relative(outputDir, page.outputPath)}`));
      } catch (error) {
        console.error(chalk.red(`[ERROR] Failed to process ${filePath}:`), error instanceof Error ? error.message : error);
      }
    }

    await copyAssets(outputDir, options.theme);

    console.log(chalk.green(`[OK] Successfully built ${generatedPages.length} pages`));

    if (options.watch) {
      await watchForChanges(inputDir, outputDir, options);
    }
  } catch (error) {
    console.error(chalk.red('[ERROR] Build failed:'), error instanceof Error ? error.message : error);
    throw error;
  }
}

async function findMarkdownFiles(inputDir: string): Promise<string[]> {
  const files = await readDirectoryRecursive(inputDir);
  return files.filter(file => path.extname(file) === '.md');
}

async function processMarkdownFile(filePath: string, inputDir: string, outputDir: string): Promise<GeneratedPage> {
  const fileContent = await fs.readFile(filePath, 'utf-8');

  const parsedContent = matter(fileContent);
  const metadata: PageMetadata = parsedContent.data || {};
  const markdownContent = parsedContent.content;

  const htmlContent = await marked(markdownContent);

  const relativePath = path.relative(inputDir, filePath);
  const outputPath = path.join(outputDir, relativePath.replace(/\.md$/, '.html'));

  await ensureDirectoryExists(path.dirname(outputPath));

  const outputRelativePath = path.relative(outputDir, outputPath);
  const depth = outputRelativePath.split(path.sep).length - 1;
  const assetsPath = depth > 0 ? '../'.repeat(depth) + 'assets' : './assets';

  const finalContent = renderTemplate(htmlContent, metadata, assetsPath);

  return {
    content: finalContent,
    metadata,
    outputPath,
    inputPath: filePath
  };
}

async function watchForChanges(inputDir: string, outputDir: string, options: BuildOptions): Promise<void> {
  console.log(chalk.yellow('[WATCH] Watching for changes... Press Ctrl+C to stop'));

  const { watch } = await import('fs');

  watch(inputDir, { recursive: true }, (_eventType, filename) => {
    if (filename && path.extname(filename) === '.md') {
      console.log(chalk.blue(`[WATCH] File changed: ${filename}`));
      console.log(chalk.gray('Rebuilding...'));

      buildSite(inputDir, outputDir, { ...options, watch: false }).catch(error => {
        console.error(chalk.red('[ERROR] Rebuild failed:'), error instanceof Error ? error.message : String(error));
      });
    }
  });
}