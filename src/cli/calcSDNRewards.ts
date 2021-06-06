import { promises as fs } from 'fs';
import path from 'path';
import calculator from '../helper/calculator';
import { Config } from '../model/Config';
import { toJSON } from '../model/Reward';

// script entry point
export default async () => {
  // cache names are based on contract address
  const cacheFileDir = path.join(process.cwd(), Config.get().rewardsJSONPath);

  const res = await calculator([Config.get().auctionJSONPath, Config.get().crowdloanJSONPath], Config.chainType);
  console.log(res);
  const jsonBlob = toJSON(res);
  console.log(jsonBlob);

  await fs.writeFile(cacheFileDir, jsonBlob);
};
