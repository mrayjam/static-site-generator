import { describe, it, expect } from '@jest/globals';
import { renderTemplate } from '../src/template';
import type { PageMetadata } from '../src/generator';

describe('Template Module', () => {
  describe('renderTemplate', () => {
    it('should render basic template with minimal metadata', () => {
      const content = '<h1>Test Content</h1>';
      const metadata: PageMetadata = {};

      const result = renderTemplate(content, metadata);

      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<title>Untitled</title>');
      expect(result).toContain('<h1>Test Content</h1>');
      expect(result).toContain('Created By Aymane Bouljam');
    });

    it('should render template with full metadata', () => {
      const content = '<h1>Test Content</h1>';
      const metadata: PageMetadata = {
        title: 'Test Title',
        description: 'Test Description',
        author: 'Test Author',
        date: '2025-08-05',
        tags: ['test', 'typescript']
      };

      const result = renderTemplate(content, metadata);

      expect(result).toContain('<title>Test Title</title>');
      expect(result).toContain('<meta name="description" content="Test Description">');
      expect(result).toContain('<meta name="author" content="Test Author">');
      expect(result).toContain('<meta name="date" content="8/5/2025">');
      expect(result).toContain('<strong>Author:</strong> Test Author');
      expect(result).toContain('<span class="tag">test</span>');
      expect(result).toContain('<span class="tag">typescript</span>');
    });

    it('should handle special characters in metadata', () => {
      const content = '<p>Content</p>';
      const metadata: PageMetadata = {
        title: 'Title with "quotes" & <brackets>',
        description: 'Description with <script>alert("xss")</script>',
        author: 'Author & Co.'
      };

      const result = renderTemplate(content, metadata);

      expect(result).toContain('Title with &quot;quotes&quot; &amp; &lt;brackets&gt;');
      expect(result).toContain('Description with &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(result).toContain('Author &amp; Co.');
    });

    it('should handle empty tags array', () => {
      const content = '<p>Content</p>';
      const metadata: PageMetadata = {
        title: 'Test',
        tags: []
      };

      const result = renderTemplate(content, metadata);

      expect(result).not.toContain('<strong>Tags:</strong>');
      expect(result).not.toContain('class="tag"');
    });

    it('should handle non-string metadata values safely', () => {
      const content = '<p>Content</p>';
      const metadata: PageMetadata = {
        title: 123 as unknown as string,
        description: null as unknown as string,
        author: undefined as unknown as string
      };

      const result = renderTemplate(content, metadata);

      // Should not crash and should handle gracefully
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<p>Content</p>');
    });

    it('should format date correctly', () => {
      const content = '<p>Content</p>';
      const metadata: PageMetadata = {
        title: 'Test',
        date: '2025-12-25'
      };

      const result = renderTemplate(content, metadata);

      expect(result).toContain('<meta name="date" content="12/25/2025">');
      expect(result).toContain('<strong>Date:</strong> 12/25/2025');
    });

    it('should include required assets', () => {
      const content = '<p>Content</p>';
      const metadata: PageMetadata = {};

      const result = renderTemplate(content, metadata);

      expect(result).toContain('<link rel="stylesheet" href="./assets/prism.css">');
      expect(result).toContain('<link rel="stylesheet" href="./assets/style.css">');
      expect(result).toContain('<script src="./assets/prism.js"></script>');
    });

    it('should have proper HTML structure', () => {
      const content = '<p>Content</p>';
      const metadata: PageMetadata = { title: 'Test' };

      const result = renderTemplate(content, metadata);

      expect(result).toContain('<html lang="en">');
      expect(result).toContain('<meta charset="UTF-8">');
      expect(result).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
      expect(result).toContain('<header class="site-header">');
      expect(result).toContain('<main class="content">');
      expect(result).toContain('<footer class="site-footer">');
    });
  });
});