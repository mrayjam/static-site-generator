import * as fs from 'fs/promises';
import * as path from 'path';
import { getThemeCssPath } from './highlighting';

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function readDirectoryRecursive(dirPath: string): Promise<string[]> {
  const files: string[] = [];

  async function traverse(currentPath: string): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await traverse(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  await traverse(dirPath);
  return files;
}

export async function copyAssets(outputDir: string, theme: string): Promise<void> {
  const assetsDir = path.join(outputDir, 'assets');
  await ensureDirectoryExists(assetsDir);

  await copyPrismAssets(assetsDir, theme);
  await createThemeAwareStyles(assetsDir, theme);
}

async function copyPrismAssets(assetsDir: string, theme: string): Promise<void> {
  const prismCssPath = getThemeCssPath(theme);
  const prismJsPath = 'prismjs/prism.js';

  try {
    const prismCssContent = await fs.readFile(
      path.join(process.cwd(), 'node_modules', prismCssPath),
      'utf-8'
    );
    await fs.writeFile(path.join(assetsDir, 'prism.css'), prismCssContent);

    const prismJsContent = await fs.readFile(
      path.join(process.cwd(), 'node_modules', prismJsPath),
      'utf-8'
    );
    await fs.writeFile(path.join(assetsDir, 'prism.js'), prismJsContent);
  } catch (error) {
    throw new Error(`Failed to copy PrismJS assets: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function createThemeAwareStyles(assetsDir: string, theme: string): Promise<void> {
  const isDarkTheme = ['dark', 'okaidia', 'twilight', 'funky'].includes(theme);

  const themeColors = getThemeColors(theme);

  const css = `
/* Theme-Aware SSG Styles - ${theme} */
:root {
  --primary-color: ${themeColors.primary};
  --secondary-color: ${themeColors.secondary};
  --accent-color: ${themeColors.accent};
  --bg-color: ${themeColors.background};
  --text-color: ${themeColors.text};
  --text-secondary: ${themeColors.textSecondary};
  --border-color: ${themeColors.border};
  --code-bg: ${themeColors.codeBg};
  --shadow-color: ${themeColors.shadow};
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--bg-color);
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  transition: all 0.3s ease;
}

.site-header {
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  text-align: center;
}

.site-title {
  margin: 0 0 1rem 0;
  color: var(--primary-color);
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-shadow: ${isDarkTheme ? '0 2px 4px var(--shadow-color)' : 'none'};
}

.metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: ${isDarkTheme ? 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' : 'linear-gradient(135deg, var(--code-bg), rgba(255,255,255,0.8))'};
  border-radius: 12px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.metadata-item {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.metadata-item strong {
  color: var(--text-color);
  margin-right: 0.5rem;
}

.tags-container {
  width: 100%;
  text-align: center;
}

.tag {
  display: inline-block;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: ${isDarkTheme ? 'white' : 'white'};
  padding: 0.3rem 0.8rem;
  margin: 0 0.3rem 0 0;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 4px var(--shadow-color);
  transition: transform 0.2s ease;
}

.tag:hover {
  transform: translateY(-1px);
}

.content {
  margin: 3rem 0;
  line-height: 1.7;
}

.content h1, .content h2, .content h3, .content h4, .content h5, .content h6 {
  color: var(--primary-color);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.content h1 {
  font-size: 2.2rem;
  border-bottom: 3px solid var(--accent-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.content h2 {
  font-size: 1.8rem;
  margin-top: 2rem;
}

.content h3 {
  font-size: 1.4rem;
  color: var(--secondary-color);
}

.content p {
  margin-bottom: 1.2rem;
  text-align: justify;
}

.content blockquote {
  border-left: 4px solid var(--accent-color);
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: ${isDarkTheme ? 'rgba(255,255,255,0.05)' : 'var(--code-bg)'};
  border-radius: 0 8px 8px 0;
  font-style: italic;
  position: relative;
}

.content blockquote::before {
  content: '"';
  font-size: 4rem;
  color: var(--accent-color);
  position: absolute;
  top: -10px;
  left: 15px;
  opacity: 0.3;
}

.content ul, .content ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.content li {
  margin-bottom: 0.5rem;
}

.content li::marker {
  color: var(--accent-color);
}

.content a {
  color: var(--accent-color);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.content a:hover {
  border-bottom-color: var(--accent-color);
  transform: translateY(-1px);
}

.content img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 25px var(--shadow-color);
  transition: transform 0.3s ease;
}

.content img:hover {
  transform: scale(1.02);
}

/* Enhanced code styling */
.content pre {
  background-color: var(--code-bg);
  border-radius: 12px;
  padding: 1.5rem;
  overflow-x: auto;
  margin: 2rem 0;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px var(--shadow-color);
  position: relative;
}

.content pre::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
  border-radius: 12px 12px 0 0;
}

.content code {
  background-color: var(--code-bg);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'SFMono-Regular', 'JetBrains Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
  border: 1px solid var(--border-color);
}

.content pre code {
  background-color: transparent;
  padding: 0;
  border: none;
  font-size: 0.95em;
}

.site-footer {
  border-top: 2px solid var(--border-color);
  margin-top: 4rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  background: ${isDarkTheme ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'};
  border-radius: 12px 12px 0 0;
}

.site-footer p {
  margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  body {
    padding: 1rem;
  }

  .site-title {
    font-size: 2.2rem;
  }

  .metadata {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .content h1 {
    font-size: 1.8rem;
  }

  .content h2 {
    font-size: 1.5rem;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Selection styling */
::selection {
  background-color: var(--accent-color);
  color: ${isDarkTheme ? 'white' : 'black'};
}
`;

  await fs.writeFile(path.join(assetsDir, 'style.css'), css);
}

function getThemeColors(theme: string): Record<string, string> {
  const themes: Record<string, Record<string, string>> = {
    default: {
      primary: '#2c3e50',
      secondary: '#34495e',
      accent: '#3498db',
      background: '#ffffff',
      text: '#2c3e50',
      textSecondary: '#7f8c8d',
      border: '#ecf0f1',
      codeBg: '#f8f9fa',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    dark: {
      primary: '#e74c3c',
      secondary: '#c0392b',
      accent: '#e67e22',
      background: '#2c3e50',
      text: '#ecf0f1',
      textSecondary: '#bdc3c7',
      border: '#34495e',
      codeBg: '#34495e',
      shadow: 'rgba(0, 0, 0, 0.3)'
    },
    okaidia: {
      primary: '#f92672',
      secondary: '#a6e22e',
      accent: '#66d9ef',
      background: '#272822',
      text: '#f8f8f2',
      textSecondary: '#75715e',
      border: '#3e3d32',
      codeBg: '#3e3d32',
      shadow: 'rgba(0, 0, 0, 0.5)'
    },
    tomorrow: {
      primary: '#4271ae',
      secondary: '#8959a8',
      accent: '#718c00',
      background: '#ffffff',
      text: '#4d4d4c',
      textSecondary: '#8e908c',
      border: '#e0e0e0',
      codeBg: '#f5f5f5',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    twilight: {
      primary: '#cf6a4c',
      secondary: '#9b703f',
      accent: '#7587a6',
      background: '#141414',
      text: '#f8f8f8',
      textSecondary: '#5f5a60',
      border: '#323232',
      codeBg: '#1e1e1e',
      shadow: 'rgba(0, 0, 0, 0.6)'
    },
    coy: {
      primary: '#5e6687',
      secondary: '#6679cc',
      accent: '#c94922',
      background: '#fdfdfd',
      text: '#5e6687',
      textSecondary: '#9a9fb8',
      border: '#e0e5e6',
      codeBg: '#f5f2f0',
      shadow: 'rgba(0, 0, 0, 0.08)'
    },
    solarizedlight: {
      primary: '#586e75',
      secondary: '#657b83',
      accent: '#268bd2',
      background: '#fdf6e3',
      text: '#657b83',
      textSecondary: '#93a1a1',
      border: '#eee8d5',
      codeBg: '#eee8d5',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    funky: {
      primary: '#d80800',
      secondary: '#952bb9',
      accent: '#00a8c6',
      background: '#000000',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333',
      codeBg: '#2d2d2d',
      shadow: 'rgba(0, 0, 0, 0.7)'
    }
  };

  return (themes[theme] ?? themes['default']) as Record<string, string>;
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}