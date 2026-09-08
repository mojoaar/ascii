import { generate, type Font } from '@ascii/core';

export default async function FontCard({ font }: { font: Font }) {
  const preview = await generate('Aa', { font: font.name, horizontalLayout: 'fitted' });
  return (
    <div className="font-card">
      <pre className="font-card-preview">{preview}</pre>
      <div className="font-card-meta">
        <strong>{font.name}</strong>
        <span>by {font.author}</span>
        <span>License: {font.license}</span>
        {font.copyright ? <span>{font.copyright}</span> : null}
        <span>Source: {font.source}</span>
      </div>
    </div>
  );
}
