import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { z } from 'zod';
import { generateAscii, listFonts, previewFont, animate } from './tools.js';

const PORT = Number(process.env.PORT ?? 3200);

const server = new McpServer({ name: 'ascii', version: '0.1.0' });

server.tool('generate_ascii', 'Generate ASCII/FIGlet art from text', { text: z.string(), font: z.string().optional(), width: z.number().optional() }, async ({ text, font, width }) => {
  const output = await generateAscii(text, font, width);
  return { content: [{ type: 'text' as const, text: output }] };
});

server.tool('list_fonts', 'List available fonts with attribution', {}, async () => {
  const fonts = await listFonts();
  return { content: [{ type: 'text' as const, text: JSON.stringify(fonts, null, 2) }] };
});

server.tool('preview_font', 'Preview a specific font', { font: z.string(), text: z.string() }, async ({ font, text }) => {
  const output = await previewFont(font, text);
  return { content: [{ type: 'text' as const, text: output }] };
});

server.tool('animate', 'Generate reveal animation frames', { text: z.string(), font: z.string().optional() }, async ({ text, font }) => {
  const { frames } = await animate(text, font);
  return { content: [{ type: 'text' as const, text: frames.join('\n\n') }] };
});

const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  const transport = new StreamableHTTPServerTransport();
  res.on('close', () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res);
});

httpServer.listen(PORT, () => console.log(`MCP server listening on ${PORT}`));
