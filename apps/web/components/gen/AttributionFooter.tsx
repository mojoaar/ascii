import { getFont } from '@ascii/core';

export default async function AttributionFooter({ font }: { font: string }) {
  const f = await getFont(font);
  if (!f) return null;
  return (
    <footer className="attribution">
      <span>Font: <strong>{f.name}</strong> — by {f.author}</span>
      {f.copyright ? <span>{f.copyright}</span> : null}
      <span>License: {f.license}</span>
    </footer>
  );
}
