import { promises as fs } from 'fs';
import path from 'path';
import { batchTransfer } from '../helper/batchTransfer';
import { Config } from '../model/Config';
import { fromJSON } from '../model/Reward';

// script entry point
export default async () => {
  // cache names are based on contract address
  const cacheFileDir = path.join(process.cwd(), Config.get().rewardsJSONPath);

  const readJsonBlob = await fs.readFile(cacheFileDir);
  const rewards = fromJSON(readJsonBlob.toString());

  const res = await batchTransfer(rewards);
  const writeFileDir = path.join(process.cwd(), Config.get().resultJSONPath);
  const jsonBlob = JSON.stringify(res);
  console.log('write:', cacheFileDir, jsonBlob);

  await fs.writeFile(writeFileDir, jsonBlob);
};
