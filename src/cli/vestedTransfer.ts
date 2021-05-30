import { promises as fs } from 'fs';
import path from 'path';
import { batchTransfer } from '../helper/batchTransfer';
import calculator from '../helper/calculator';
import { ChainType } from '../model/ChainType';
import { fromJSON } from '../model/Reward';

const REWARD_JSON_PATH = 'report/cache-reward.json';

// script entry point
export default async (chain: ChainType) => {
  // cache names are based on contract address
  const cacheFileDir = path.join(process.cwd(), REWARD_JSON_PATH);

  const readJsonBlob = await fs.readFile(cacheFileDir);
  const rewards = fromJSON(readJsonBlob.toString());
  await batchTransfer(rewards, chain);
};
