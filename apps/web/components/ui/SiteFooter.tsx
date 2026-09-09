import pkg from '../../package.json';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>
        Built with ❤️ & 🤖 by{' '}
        <a href="https://johansen.foo" target="_blank" rel="noopener noreferrer">Morten Johansen</a>{' '}
        (<a href="https://github.com/mojoaar/ascii" target="_blank" rel="noopener noreferrer">v{pkg.version}</a>)
      </span>
      <span>press <kbd>?</kbd> for shortcuts</span>
    </footer>
  );
}
