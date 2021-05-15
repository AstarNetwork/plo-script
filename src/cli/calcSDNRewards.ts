import { promises as fs } from 'fs';
import path from 'path';
import calculator from '../helper/calculator';
import { ChainType } from '../model/ChainType';
import { toJSON } from '../model/Reward';

const ID_NAME = 'rewards';
const AUCTION_JSON_PATH = 'report/cache-auction.json';
const CROWD_LOAN_PATH = 'report/cache-crowdloan.json';
const CHAIN: ChainType = 'kusama';

// script entry point
export default async () => {
  // cache names are based on contract address
  const cacheFileDir = `${path.join(process.cwd(), 'report/')}cache-${ID_NAME}.json`;

  const res = await calculator([AUCTION_JSON_PATH, CROWD_LOAN_PATH], CHAIN);
  console.log(res);
  const jsonBlob = toJSON(res);
  console.log(jsonBlob);

  await fs.writeFile(cacheFileDir, jsonBlob);
};
