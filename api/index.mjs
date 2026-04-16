import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDistPath = path.join(__dirname, '../dist/FreshCart/server/server.mjs');

export default async (req, res) => {
  const { reqHandler } = await import(serverDistPath);
  return reqHandler(req, res);
};
