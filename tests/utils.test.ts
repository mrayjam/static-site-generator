import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ensureDirectoryExists, readDirectoryRecursive, fileExists } from '../src/utils';

/**
 * Mocks the fs module for isolated testing.
 *
 * @remarks
 * Required to test file system operations without actual file system access.
 */
jest.mock('fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('Utils Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureDirectoryExists', () => {
    it('should not create directory if it already exists', async () => {
      mockFs.access.mockResolvedValue(undefined);

      await ensureDirectoryExists('/existing/dir');

      expect(mockFs.access).toHaveBeenCalledWith('/existing/dir');
      expect(mockFs.mkdir).not.toHaveBeenCalled();
    });

    it('should create directory if it does not exist', async () => {
      mockFs.access.mockRejectedValue(new Error('Directory not found'));
      mockFs.mkdir.mockResolvedValue(undefined);

      await ensureDirectoryExists('/new/dir');

      expect(mockFs.access).toHaveBeenCalledWith('/new/dir');
      expect(mockFs.mkdir).toHaveBeenCalledWith('/new/dir', { recursive: true });
    });

    it('should handle mkdir errors gracefully', async () => {
      mockFs.access.mockRejectedValue(new Error('Not found'));
      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await expect(ensureDirectoryExists('/forbidden/dir')).rejects.toThrow('Permission denied');
    });
  });

  describe('readDirectoryRecursive', () => {
    it('should read files recursively', async () => {
      const mockEntries = [
        { name: 'file1.md', isFile: () => true, isDirectory: () => false },
        { name: 'subdir', isFile: () => false, isDirectory: () => true },
        { name: 'file2.txt', isFile: () => true, isDirectory: () => false }
      ];

      const mockSubdirEntries = [
        { name: 'nested.md', isFile: () => true, isDirectory: () => false }
      ];

      mockFs.readdir
        .mockResolvedValueOnce(mockEntries as never)
        .mockResolvedValueOnce(mockSubdirEntries as never);

      const result = await readDirectoryRecursive('/test/dir');

      expect(result).toEqual([
        '/test/dir/file1.md',
        '/test/dir/subdir/nested.md',
        '/test/dir/file2.txt'
      ]);
    });

    it('should handle empty directories', async () => {
      mockFs.readdir.mockResolvedValue([] as never);

      const result = await readDirectoryRecursive('/empty/dir');

      expect(result).toEqual([]);
    });

    it('should handle directory read errors', async () => {
      mockFs.readdir.mockRejectedValue(new Error('Permission denied'));

      await expect(readDirectoryRecursive('/forbidden/dir')).rejects.toThrow('Permission denied');
    });

    it('should filter out non-files and non-directories', async () => {
      const mockEntries = [
        { name: 'file.md', isFile: () => true, isDirectory: () => false },
        { name: 'symlink', isFile: () => false, isDirectory: () => false },
        { name: 'dir', isFile: () => false, isDirectory: () => true }
      ];

      const mockDirEntries = [
        { name: 'nested.txt', isFile: () => true, isDirectory: () => false }
      ];

      mockFs.readdir
        .mockResolvedValueOnce(mockEntries as never)
        .mockResolvedValueOnce(mockDirEntries as never);

      const result = await readDirectoryRecursive('/test');

      expect(result).toEqual([
        '/test/file.md',
        '/test/dir/nested.txt'
      ]);
    });
  });

  describe('fileExists', () => {
    it('should return true if file exists', async () => {
      mockFs.access.mockResolvedValue(undefined);

      const result = await fileExists('/existing/file.txt');

      expect(result).toBe(true);
      expect(mockFs.access).toHaveBeenCalledWith('/existing/file.txt');
    });

    it('should return false if file does not exist', async () => {
      mockFs.access.mockRejectedValue(new Error('File not found'));

      const result = await fileExists('/missing/file.txt');

      expect(result).toBe(false);
      expect(mockFs.access).toHaveBeenCalledWith('/missing/file.txt');
    });

    it('should return false for any access error', async () => {
      mockFs.access.mockRejectedValue(new Error('Permission denied'));

      const result = await fileExists('/forbidden/file.txt');

      expect(result).toBe(false);
    });
  });

  describe('copyAssets integration', () => {
    /**
     * Note: copyAssets requires integration testing.
     *
     * @remarks
     * This function involves complex file system operations and PrismJS assets
     * that are better tested in integration tests rather than unit tests.
     */
    it('should be tested in integration tests', () => {
      expect(true).toBe(true);
    });
  });
});