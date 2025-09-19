import { PageMetadata } from './generator';

export function renderTemplate(content: string, metadata: PageMetadata, assetsPath = './assets'): string {
  const title = typeof metadata.title === 'string' ? metadata.title : 'Untitled';
  const description = typeof metadata.description === 'string' ? metadata.description : '';
  const author = typeof metadata.author === 'string' ? metadata.author : '';
  const date = metadata.date ? new Date(String(metadata.date)).toLocaleDateString() : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(String(title))}</title>
    ${description ? `<meta name="description" content="${escapeHtml(String(description))}">` : ''}
    ${author ? `<meta name="author" content="${escapeHtml(String(author))}">` : ''}
    ${date ? `<meta name="date" content="${escapeHtml(date)}">` : ''}
    <link rel="stylesheet" href="${assetsPath}/prism.css">
    <link rel="stylesheet" href="${assetsPath}/style.css">
</head>
<body>
    <header class="site-header">
        <h1 class="site-title">${escapeHtml(title)}</h1>
        ${renderMetadata(metadata)}
    </header>

    <main class="content">
        ${content}
    </main>

    <footer class="site-footer">
        <p>Created By Aymane Bouljam</p>
    </footer>

    <script src="${assetsPath}/prism.js"></script>
</body>
</html>`;
}

function renderMetadata(metadata: PageMetadata): string {
  const metadataElements: string[] = [];

  if (metadata.description && typeof metadata.description === 'string') {
    metadataElements.push(`<div class="metadata-item"><strong>Description:</strong> ${escapeHtml(metadata.description)}</div>`);
  }

  if (metadata.date) {
    const formattedDate = new Date(metadata.date).toLocaleDateString();
    metadataElements.push(`<div class="metadata-item"><strong>Date:</strong> ${escapeHtml(formattedDate)}</div>`);
  }

  if (metadata.author && typeof metadata.author === 'string') {
    metadataElements.push(`<div class="metadata-item"><strong>Author:</strong> ${escapeHtml(metadata.author)}</div>`);
  }

  if (metadata.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0) {
    const tagsHtml = metadata.tags
      .map(tag => `<span class="tag">${escapeHtml(String(tag))}</span>`)
      .join(' ');
    metadataElements.push(`<div class="metadata-item tags-container"><strong>Tags:</strong> ${tagsHtml}</div>`);
  }

  if (metadataElements.length === 0) {
    return '';
  }

  return `
    <div class="metadata">
        ${metadataElements.join('\n        ')}
    </div>`;
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