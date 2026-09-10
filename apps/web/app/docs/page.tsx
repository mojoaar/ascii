import { headers } from 'next/headers';
import SiteHeader from '@/components/ui/SiteHeader';
import { SiteFooter } from '@/components/ui/SiteFooter';
import DocsHighlight from '@/components/docs/DocsHighlight';
import DownloadSection from '@/components/docs/DownloadSection';

export const dynamic = 'force-dynamic';

const version = '0.2.0';
const owner = 'mojoaar';
const repo = 'ascii';
const releaseTag = `v${version}`;
const releasePage = `https://github.com/${owner}/${repo}/releases/tag/${releaseTag}`;
const downloadBase = `https://github.com/${owner}/${repo}/releases/download/${releaseTag}`;

const assets = [
  { label: 'macOS (Apple Silicon)', filename: 'ascii-darwin-arm64', os: 'macOS' },
  { label: 'macOS (Intel)', filename: 'ascii-darwin-amd64', os: 'macOS' },
  { label: 'Linux (arm64)', filename: 'ascii-linux-arm64', os: 'Linux' },
  { label: 'Linux (amd64)', filename: 'ascii-linux-amd64', os: 'Linux' },
  { label: 'Windows (amd64)', filename: 'ascii-windows-amd64.exe', os: 'Windows' },
];

type Detected = {
  filename: string;
  label: string;
  os: string;
};

function detectOS(userAgent: string): Detected {
  const ua = userAgent.toLowerCase();
  if (ua.includes('windows')) {
    return { label: 'Windows (amd64)', filename: 'ascii-windows-amd64.exe', os: 'Windows' };
  }
  if (ua.includes('macintosh') || ua.includes('mac os')) {
    if (ua.includes('arm64') || ua.includes('aarch64')) {
      return { label: 'macOS (Apple Silicon)', filename: 'ascii-darwin-arm64', os: 'macOS' };
    }
    return { label: 'macOS (Intel)', filename: 'ascii-darwin-amd64', os: 'macOS' };
  }
  if (ua.includes('linux')) {
    if (ua.includes('arm64') || ua.includes('aarch64')) {
      return { label: 'Linux (arm64)', filename: 'ascii-linux-arm64', os: 'Linux' };
    }
    return { label: 'Linux (amd64)', filename: 'ascii-linux-amd64', os: 'Linux' };
  }
  return { label: 'macOS (Apple Silicon)', filename: 'ascii-darwin-arm64', os: 'macOS' };
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  return (
    <div className="endpoint">
      <span className={`method method-${method.toLowerCase()}`}>{method}</span>
      <code className="ep-path">{path}</code>
      <span className="ep-desc">{desc}</span>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="code-block">
      <code className="language-bash">{children}</code>
    </pre>
  );
}

export default async function DocsPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') ?? '';
  const detected = detectOS(userAgent);

  return (
    <div className="shell">
      <DocsHighlight />
      <SiteHeader />
      <main className="docs-wrap">
        <aside className="docs-sidebar">
          <a href="#getting-started">Getting started</a>
          <a href="#api">API reference</a>
          <a href="#cli">CLI</a>
          <a href="#mcp">MCP</a>
          <a href="#operations">Operations</a>
        </aside>
        <div className="docs-content">
          <h1 id="getting-started">Getting started</h1>
          <p>ascii is a self-hosted FIGlet text-art generator. Deploy with Docker Compose and hit the API, the website, or the MCP server.</p>
          <h2>Quick start</h2>
          <Code>{`docker compose up -d
open http://localhost:3000`}</Code>
          <h2>Copying art</h2>
          <p>ASCII art only lines up in a monospace font. When you copy art, paste it into a monospace context — a code block, a terminal, or a text editor set to a monospace font — or the columns will misalign. Trailing whitespace is trimmed automatically.</p>

          <h1 id="api">API reference</h1>
          <Endpoint method="GET" path="/api/health" desc="Health check" />
          <Endpoint method="GET" path="/api/fonts" desc="List fonts with attribution" />
          <Endpoint method="GET" path="/api/fonts/:name" desc="Get one font" />
          <Endpoint method="POST" path="/api/generate" desc="Generate art from text" />
          <Endpoint method="POST" path="/api/animate" desc="Generate animation frames" />
          <h3>Example</h3>
          <Code>{`curl -X POST http://localhost:3000/api/generate \\
  -H 'content-type: application/json' \\
  -d '{"text":"hello","font":"Standard"}'`}</Code>

          <DownloadSection
            version={version}
            releasePage={releasePage}
            downloadBase={downloadBase}
            assets={assets}
            serverDetected={detected}
          />

          <h1 id="mcp">MCP</h1>
          <p>Point your MCP client at <code>/mcp</code> (Streamable HTTP). Tools: <code>generate_ascii</code>, <code>list_fonts</code>, <code>preview_font</code>, <code>animate</code>.</p>

          <h1 id="operations">Operations</h1>
          <p>Set <code>ADMIN_TOKEN</code> to enable <a href="/admin">/admin</a>. Umami analytics enable when both <code>UMAMI_SCRIPT_URL</code> and <code>UMAMI_WEBSITE_ID</code> are set.</p>

          <h2>Environment variables</h2>
          <table className="docs-table">
            <thead>
              <tr><th>Variable</th><th>Default</th><th>Purpose</th></tr>
            </thead>
            <tbody>
              <tr><td><code>APP_URL</code></td><td>—</td><td>Canonical public URL, used for sitemaps and Open Graph metadata.</td></tr>
              <tr><td><code>DB_PATH</code></td><td><code>./data/ascii.db</code> / <code>/data/ascii.db</code> in Docker</td><td>SQLite database file path.</td></tr>
              <tr><td><code>ADMIN_TOKEN</code></td><td>—</td><td>Secret token that unlocks the admin panel.</td></tr>
              <tr><td><code>ADMIN_SESSION_TTL_SECONDS</code></td><td><code>28800</code></td><td>Admin session lifetime.</td></tr>
              <tr><td><code>UMAMI_SCRIPT_URL</code></td><td>—</td><td>Umami analytics script URL.</td></tr>
              <tr><td><code>UMAMI_WEBSITE_ID</code></td><td>—</td><td>Umami website ID.</td></tr>
              <tr><td><code>FONTS_MANIFEST</code></td><td><code>data/fonts/fonts.json</code></td><td>Path to the fonts attribution manifest (CLI/server).</td></tr>
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
