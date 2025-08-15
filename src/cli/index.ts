#!/usr/bin/env node

import { Command } from 'commander';
import { buildSite } from '../generator';
import chalk from 'chalk';

const program = new Command();

program.name('my-ssg').description('TypeScript Static Site Generator').version('1.0.0');

program
  .command('build')
  .description('Build static site from Markdown files')
  .argument('<inputDir>', 'Directory containing Markdown files')
  .argument('<outputDir>', 'Directory to output generated HTML files')
  .option('--watch', 'Watch for file changes and rebuild automatically')
  .option('--theme <name>', 'PrismJS theme for syntax highlighting', 'default')
  .action(
    async (inputDir: string, outputDir: string, options: { watch?: boolean; theme: string }) => {
      try {
        console.log(chalk.blue('[START] Starting static site generation...'));
        console.log(chalk.gray(`Input: ${inputDir}`));
        console.log(chalk.gray(`Output: ${outputDir}`));
        console.log(chalk.gray(`Theme: ${options.theme}`));

        if (options.watch) {
          console.log(chalk.yellow('[WATCH] Watch mode enabled'));
        }

        await buildSite(inputDir, outputDir, options);
      } catch (error) {
        console.error(
          chalk.red('[ERROR] Build failed:'),
          error instanceof Error ? error.message : error
        );
        process.exit(1);
      }
    }
  );

program.parse();
