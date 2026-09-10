'use client';

import { useEffect, useState } from 'react';

export type Asset = {
  label: string;
  filename: string;
  os: string;
};

type Props = {
  version: string;
  releasePage: string;
  downloadBase: string;
  assets: Asset[];
  serverDetected: Asset;
};

function installCommand(os: string, filename: string, downloadBase: string) {
  const url = `${downloadBase}/${filename}`;
  if (os === 'Windows') {
    return `# PowerShell (run as Administrator)\nInvoke-WebRequest -Uri "${url}" -OutFile "ascii.exe"\nMove-Item .\\ascii.exe "$env:LOCALAPPDATA\\Microsoft\\WindowsApps\\ascii.exe"\n\n# Or with curl in WSL/Git Bash\ncurl -LO "${url}"`;
  }
  return `curl -LO "${url}"\nchmod +x "${filename}"\nmv "${filename}" /usr/local/bin/ascii`;
}

async function detectClient(assets: Asset[]): Promise<Asset> {
  if (typeof navigator === 'undefined') {
    return assets[0] as Asset;
  }

  const ua = navigator.userAgent.toLowerCase();
  let os: 'Windows' | 'macOS' | 'Linux' | null = null;

  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('macintosh') || ua.includes('mac os')) {
    os = 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  }

  if (!os) {
    return assets[0] as Asset;
  }

  let arch: 'arm64' | 'amd64' | null = null;

  try {
    // @ts-expect-error userAgentData is not typed in all browsers
    const uaData = navigator.userAgentData;
    if (uaData && typeof uaData.getHighEntropyValues === 'function') {
      const hints = await uaData.getHighEntropyValues(['architecture', 'bitness']);
      const value = String(hints.architecture ?? '').toLowerCase();
      if (value.includes('arm') || value === 'aarch64') {
        arch = 'arm64';
      } else if (value.includes('x86') || hints.bitness === '64') {
        arch = 'amd64';
      }
    }
  } catch {
    // ignore
  }

  if (!arch) {
    if (ua.includes('arm64') || ua.includes('aarch64')) {
      arch = 'arm64';
    } else if (os === 'macOS') {
      // Apple Silicon Macs were misreported as Intel for years; default to arm64
      // and let the user pick amd64 if they are truly on an older Intel Mac.
      arch = 'arm64';
    } else if (ua.includes('x86_64') || ua.includes('win64') || ua.includes('wow64')) {
      arch = 'amd64';
    }
  }

  const match = assets.find((a) => a.os === os && (arch ? a.filename.includes(arch) : true));
  return (match ?? assets.find((a) => a.os === os) ?? assets[0]) as Asset;
}

export default function DownloadSection({ version, releasePage, downloadBase, assets, serverDetected }: Props) {
  const [detected, setDetected] = useState<Asset>(serverDetected);

  useEffect(() => {
    detectClient(assets).then(setDetected).catch(() => setDetected(serverDetected));
  }, [assets, serverDetected]);

  return (
    <>
      <h1 id="cli">CLI</h1>
      <p>
        Pre-built binaries are available on the <a href={releasePage}>v{version} release page</a>. Checksums are published as <code>ascii-{version}.sha256</code>.
      </p>

      <h2>Recommended download</h2>
      <p>Detected from your browser: <strong>{detected.label}</strong></p>
      <div className="download-grid">
        <div className="download-card recommended">
          <span className="label">Recommended</span>
          <code>{detected.filename}</code>
          <a className="btn" href={`${downloadBase}/${detected.filename}`} download>
            Download
          </a>
        </div>
      </div>
      <pre className="code-block">
        <code className="language-bash">{installCommand(detected.os, detected.filename, downloadBase)}</code>
      </pre>

      <h2>All downloads</h2>
      <div className="download-grid">
        {assets.map((asset) => (
          <div key={asset.filename} className={`download-card${asset.filename === detected.filename ? ' recommended' : ''}`}>
            {asset.filename === detected.filename && <span className="label">Recommended</span>}
            <code>{asset.filename}</code>
            <a className="btn" href={`${downloadBase}/${asset.filename}`} download>
              Download
            </a>
          </div>
        ))}
      </div>

      <h2>Examples</h2>
      <pre className="code-block">
        <code className="language-bash">{`ascii "hello" --font Big\nascii --list\nascii "hello" --animate --color\nascii --version`}</code>
      </pre>
    </>
  );
}
