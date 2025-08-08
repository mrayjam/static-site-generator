import * as Prism from 'prismjs';
import { marked } from 'marked';

const AVAILABLE_THEMES = [
  'default', 'dark', 'funky', 'okaidia', 'twilight', 'coy', 'solarizedlight', 'tomorrow'
];

export function setupPrismHighlighting(theme: string): void {
  if (!AVAILABLE_THEMES.includes(theme)) {
    console.warn(`Theme "${theme}" not available. Using "default" theme.`);
    theme = 'default';
  }

  const renderer = new marked.Renderer();

  renderer.code = function({ text, lang }: { text: string; lang?: string }): string {
    if (lang && Prism.languages[lang]) {
      const highlighted = Prism.highlight(text, Prism.languages[lang], lang);
      return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
    }

    return `<pre><code>${escapeHtml(text)}</code></pre>`;
  };

  marked.setOptions({
    renderer
  });
}

export function getThemeCssPath(theme: string): string {
  if (theme === 'default') {
    return 'prismjs/themes/prism.css';
  }
  return `prismjs/themes/prism-${theme}.css`;
}

export function getAvailableThemes(): string[] {
  return [...AVAILABLE_THEMES];
}

function escapeHtml(text: string): string {
  const htmlEscapes: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (match) => htmlEscapes[match] ?? match);
}