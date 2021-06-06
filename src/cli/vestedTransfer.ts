import { promises as fs } from 'fs';
import path from 'path';
import { batchTransfer } from '../helper/batchTransfer';
import calculator from '../helper/calculator';
import { ChainType } from '../model/ChainType';
import { Config } from '../model/Config';
import { fromJSON } from '../model/Reward';

const REWARD_JSON_PATH = 'report/cache-reward.json';

// script entry point
export default async () => {
  // cache names are based on contract address
  const cacheFileDir = path.join(process.cwd(), Config.get().rewardsJSONPath);

  const readJsonBlob = await fs.readFile(cacheFileDir);
  const rewards = fromJSON(readJsonBlob.toString());
  await batchTransfer(rewards);
};
