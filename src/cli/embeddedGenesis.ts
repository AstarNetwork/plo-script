import { promises as fs } from 'fs';
import path from 'path';

const ID_NAME = 'test';

// script entry point
export default async () => {
  // cache names are based on contract address
  const cacheFileDir = `${path.join(process.cwd(), 'report/')}cache-${ID_NAME.slice(0, 6)}.json`;
  const jsonBlob = JSON.stringify('{}');

  await fs.writeFile(cacheFileDir, jsonBlob);
};
