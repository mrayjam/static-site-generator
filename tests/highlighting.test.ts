import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { setupPrismHighlighting, getThemeCssPath, getAvailableThemes } from '../src/highlighting';

/**
 * Mocks the marked module for testing.
 *
 * @remarks
 * Required to test highlighting functionality without external dependencies.
 */
const mockSetOptions = jest.fn();
const mockRenderer = {
  code: jest.fn()
};

jest.mock('marked', () => ({
  marked: {
    setOptions: mockSetOptions,
    Renderer: jest.fn().mockImplementation(() => mockRenderer)
  }
}));

/**
 * Mocks PrismJS for testing syntax highlighting.
 *
 * @remarks
 * Provides controlled test environment for highlighting functionality.
 */
jest.mock('prismjs', () => ({
  languages: {
    javascript: { keyword: /\\b(?:function|var|let|const)\\b/ },
    typescript: { keyword: /\\b(?:function|var|let|const|interface)\\b/ },
    python: { keyword: /\\b(?:def|class|import)\\b/ }
  },
  highlight: jest.fn((code: string, grammar: unknown, language: string) => {
    return `<span class="highlighted">${code}</span>`;
  })
}));

describe('Highlighting Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setupPrismHighlighting', () => {
    it('should setup marked with PrismJS renderer', () => {
      setupPrismHighlighting('default');

      expect(mockSetOptions).toHaveBeenCalledWith({
        renderer: expect.any(Object)
      });
    });

    it('should handle valid theme', () => {
      expect(() => setupPrismHighlighting('okaidia')).not.toThrow();
      expect(() => setupPrismHighlighting('dark')).not.toThrow();
      expect(() => setupPrismHighlighting('tomorrow')).not.toThrow();
    });

    it('should handle invalid theme gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      setupPrismHighlighting('invalid-theme');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Theme "invalid-theme" not available. Using "default" theme.'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getThemeCssPath', () => {
    it('should return correct path for default theme', () => {
      const result = getThemeCssPath('default');
      expect(result).toBe('prismjs/themes/prism.css');
    });

    it('should return correct path for named themes', () => {
      expect(getThemeCssPath('okaidia')).toBe('prismjs/themes/prism-okaidia.css');
      expect(getThemeCssPath('dark')).toBe('prismjs/themes/prism-dark.css');
      expect(getThemeCssPath('tomorrow')).toBe('prismjs/themes/prism-tomorrow.css');
    });

    it('should handle custom theme names', () => {
      expect(getThemeCssPath('custom')).toBe('prismjs/themes/prism-custom.css');
    });
  });

  describe('getAvailableThemes', () => {
    it('should return array of available themes', () => {
      const themes = getAvailableThemes();

      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBeGreaterThan(0);
      expect(themes).toContain('default');
      expect(themes).toContain('okaidia');
      expect(themes).toContain('dark');
      expect(themes).toContain('tomorrow');
    });

    it('should return immutable copy', () => {
      const themes1 = getAvailableThemes();
      const themes2 = getAvailableThemes();

      themes1.push('new-theme');

      expect(themes2).not.toContain('new-theme');
    });
  });

  describe('Code highlighting functionality', () => {
    it('should create renderer with code highlighting', () => {
      setupPrismHighlighting('default');

      const codeRenderer = mockRenderer.code;
      expect(codeRenderer).toBeDefined();
    });
  });
});