import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, '../.next/prerender-manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('ERROR: .next/prerender-manifest.json not found. Did build complete?');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const routes = Object.keys(manifest.routes);

// Critical routes that MUST be prerendered for all locales
const criticalRoutes = [
  '/fi', '/sv', '/en',
  '/fi/kohteet', '/sv/kohteet', '/en/kohteet',
  '/fi/henkilosto', '/sv/henkilosto', '/en/henkilosto',
  '/fi/yhteystiedot', '/sv/yhteystiedot', '/en/yhteystiedot',
  '/fi/yritys', '/sv/yritys', '/en/yritys',
  '/fi/myymassa', '/sv/myymassa', '/en/myymassa',
  '/fi/kansainvalisesti', '/sv/kansainvalisesti', '/en/kansainvalisesti',
  '/fi/meille-toihin', '/sv/meille-toihin', '/en/meille-toihin'
];

const missing = criticalRoutes.filter(route => !routes.includes(route));

if (missing.length > 0) {
  console.error('\n❌ BUILD FAILED: Missing prerendered locale routes:\n');
  missing.forEach(route => console.error(`  - ${route}`));
  console.error('\n💡 Fix: Add generateStaticParams() to the corresponding page.tsx files\n');
  process.exit(1);
}

console.log('✅ All critical locale routes prerendered successfully');
console.log(`📊 Total prerendered routes: ${routes.length}`);

