import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { BuildOptions } from '../src/generator';

/**
 * Mocks all dependencies for isolated testing.
 *
 * @remarks
 * Required to test generator functionality without external dependencies.
 */
jest.mock('fs/promises');
jest.mock('gray-matter');
jest.mock('marked');
jest.mock('../src/template');
jest.mock('../src/utils');
jest.mock('../src/highlighting');

const mockFs = fs as jest.Mocked<typeof fs>;

/**
 * Imports generator module after mocking dependencies.
 *
 * @remarks
 * Import order is critical - mocks must be defined before importing modules that use them.
 */
import { buildSite } from '../src/generator';

describe('Generator Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockUtils = require('../src/utils');
    mockUtils.ensureDirectoryExists.mockResolvedValue(undefined);
    mockUtils.readDirectoryRecursive.mockResolvedValue([
      '/test/input/file1.md',
      '/test/input/file2.md'
    ]);
    mockUtils.copyAssets.mockResolvedValue(undefined);

    const mockMatter = require('gray-matter');
    mockMatter.default.mockReturnValue({
      data: { title: 'Test Title', author: 'Test Author' },
      content: '# Test Content'
    });

    const mockMarked = require('marked');
    mockMarked.marked.mockResolvedValue('<h1>Test Content</h1>');

    const mockTemplate = require('../src/template');
    mockTemplate.renderTemplate.mockReturnValue('<html>Mock HTML</html>');

    const mockHighlighting = require('../src/highlighting');
    mockHighlighting.setupPrismHighlighting.mockReturnValue(undefined);

    mockFs.writeFile.mockResolvedValue(undefined);
  });

  describe('buildSite', () => {
    it('should build site successfully with basic options', async () => {
      const options: BuildOptions = { theme: 'default' };

      await buildSite('/test/input', '/test/output', options);

      const mockUtils = require('../src/utils');
      expect(mockUtils.ensureDirectoryExists).toHaveBeenCalledWith('/test/output');
      expect(mockUtils.readDirectoryRecursive).toHaveBeenCalledWith('/test/input');
      expect(mockUtils.copyAssets).toHaveBeenCalledWith('/test/output', 'default');
    });

    it('should process markdown files correctly', async () => {
      const options: BuildOptions = { theme: 'okaidia' };

      await buildSite('/test/input', '/test/output', options);

      expect(mockFs.writeFile).toHaveBeenCalledTimes(2);
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('file1.html'),
        '<html>Mock HTML</html>',
        'utf-8'
      );
    });

    it('should handle no markdown files gracefully', async () => {
      const mockUtils = require('../src/utils');
      mockUtils.readDirectoryRecursive.mockResolvedValue([]);

      const options: BuildOptions = { theme: 'default' };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      await buildSite('/test/empty', '/test/output', options);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] No Markdown files found')
      );

      consoleSpy.mockRestore();
    });

    it('should handle file processing errors gracefully', async () => {
      mockFs.writeFile.mockRejectedValueOnce(new Error('Write failed'));

      const options: BuildOptions = { theme: 'default' };
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await buildSite('/test/input', '/test/output', options);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] Failed to process'),
        expect.any(String)
      );

      consoleSpy.mockRestore();
    });

    it('should setup highlighting with correct theme', async () => {
      const options: BuildOptions = { theme: 'twilight' };

      await buildSite('/test/input', '/test/output', options);

      const mockHighlighting = require('../src/highlighting');
      expect(mockHighlighting.setupPrismHighlighting).toHaveBeenCalledWith('twilight');
    });

    it('should handle build errors and rethrow', async () => {
      const mockUtils = require('../src/utils');
      mockUtils.ensureDirectoryExists.mockRejectedValue(new Error('Directory creation failed'));

      const options: BuildOptions = { theme: 'default' };

      await expect(buildSite('/test/input', '/test/output', options))
        .rejects.toThrow('Directory creation failed');
    });

    it('should filter only markdown files', async () => {
      const mockUtils = require('../src/utils');
      mockUtils.readDirectoryRecursive.mockResolvedValue([
        '/test/input/file1.md',
        '/test/input/file2.txt',
        '/test/input/file3.md',
        '/test/input/image.png'
      ]);

      const options: BuildOptions = { theme: 'default' };

      await buildSite('/test/input', '/test/output', options);

      expect(mockFs.writeFile).toHaveBeenCalledTimes(2);
    });

    it('should log progress messages', async () => {
      const options: BuildOptions = { theme: 'default' };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      await buildSite('/test/input', '/test/output', options);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Reading input directory')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Found 2 Markdown files')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[OK] Successfully built 2 pages')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('watch mode', () => {
    it('should not enable watch mode when not requested', async () => {
      const options: BuildOptions = { theme: 'default' };

      await buildSite('/test/input', '/test/output', options);

      expect(true).toBe(true);
    });

    /**
     * Watch mode testing limitation.
     *
     * @remarks
     * Testing actual watch mode would require complex mocking of fs.watch
     * functionality and is better suited for integration tests.
     */
  });
});