import { promises as fs } from 'fs';
import path from 'path';
import calculator from '../helper/calculator';
import { toJSON } from '../model/Reward';

const ID_NAME = 'rewards';

// script entry point
export default async () => {
  // cache names are based on contract address
  const cacheFileDir = `${path.join(process.cwd(), 'report/')}cache-${ID_NAME}.json`;

  const res = await calculator(['report/cache-auction.json', 'report/cache-crowdloan.json'], 'kusama');
  console.log(res);
  const jsonBlob = toJSON(res);
  console.log(jsonBlob);

  await fs.writeFile(cacheFileDir, jsonBlob);
};
