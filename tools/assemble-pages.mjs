// Puts the three builds into one static site: the shell at the root, each remote under remotes/<name>/,
// and a federation manifest that points at those folders. The remotes/ prefix keeps the folders from
// colliding with the shell's own routes (/watchlist, /orders), which must fall through to 404.html.
// Usage: node tools/assemble-pages.mjs <site-url>   e.g. https://tomavic.github.io/module-federation-space/
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const siteUrl = new URL(process.argv[2] ?? 'http://localhost:4300/');
const out = 'dist/pages';
const remotes = ['watchlist', 'orders'];

rmSync(out, { recursive: true, force: true });
cpSync('dist/apps/shell/browser', out, { recursive: true });
for (const remote of remotes)
  cpSync(`dist/apps/${remote}/browser`, `${out}/remotes/${remote}`, {
    recursive: true,
  });

writeFileSync(
  `${out}/federation.manifest.json`,
  JSON.stringify(
    Object.fromEntries(
      remotes.map((r) => [
        r,
        new URL(`remotes/${r}/remoteEntry.json`, siteUrl).href,
      ]),
    ),
    null,
    2,
  ),
);
const index = readFileSync(`${out}/index.html`, 'utf8').replace(
  /<base href="[^"]*"\s*\/?>/,
  `<base href="${siteUrl.pathname}">`,
);
writeFileSync(`${out}/index.html`, index);
writeFileSync(`${out}/404.html`, index); // GitHub Pages serves this for deep links such as /orders
console.log(`Assembled ${out} for ${siteUrl.href}`);
