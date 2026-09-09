import SiteHeader from '@/components/ui/SiteHeader';
import { SiteFooter } from '@/components/ui/SiteFooter';
import DocsHighlight from '@/components/docs/DocsHighlight';

export const dynamic = 'force-dynamic';

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

export default function DocsPage() {
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
          <Code>{`docker compose up -d\nopen http://localhost:3000`}</Code>
          <h2>Copying art</h2>
          <p>ASCII art only lines up in a monospace font. When you copy art, paste it into a monospace context — a code block, a terminal, or a text editor set to a monospace font — or the columns will misalign. Trailing whitespace is trimmed automatically.</p>

          <h1 id="api">API reference</h1>
          <Endpoint method="GET" path="/api/health" desc="Health check" />
          <Endpoint method="GET" path="/api/fonts" desc="List fonts with attribution" />
          <Endpoint method="GET" path="/api/fonts/:name" desc="Get one font" />
          <Endpoint method="POST" path="/api/generate" desc="Generate art from text" />
          <Endpoint method="POST" path="/api/animate" desc="Generate animation frames" />
          <h3>Example</h3>
          <Code>{`curl -X POST http://localhost:3000/api/generate \\\n  -H 'content-type: application/json' \\\n  -d '{"text":"hello","font":"Standard"}'`}</Code>

          <h1 id="cli">CLI</h1>
          <Code>{`ascii "hello" --font Big\nascii --list\nascii "hello" --animate --color`}</Code>

          <h1 id="mcp">MCP</h1>
          <p>Point your MCP client at <code>/mcp</code> (Streamable HTTP). Tools: <code>generate_ascii</code>, <code>list_fonts</code>, <code>preview_font</code>, <code>animate</code>.</p>

          <h1 id="operations">Operations</h1>
          <p>Set <code>ADMIN_TOKEN</code> to enable <a href="/admin">/admin</a>. Umami analytics enable when both <code>UMAMI_SCRIPT_URL</code> and <code>UMAMI_WEBSITE_ID</code> are set.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
