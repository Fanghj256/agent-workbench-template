import { readFile } from 'node:fs/promises';
import { openChamberManifestSchema } from '../node_modules/@openchamber/sdk/dist/parse.js';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const oc = pkg.openchamber || {};
const manifest = {
  apiVersion: oc.apiVersion,
  engines: oc.engines,
  contributes: {
    ...(oc.contributes || {}),
    panel: {
      id: oc.id,
      name: oc.name,
      icon: oc.icon,
      ...(oc.contributes?.panel || {}),
    },
  },
};

const parsed = openChamberManifestSchema.parse(manifest);
console.log('manifest ok');
console.log(JSON.stringify(parsed, null, 2));
