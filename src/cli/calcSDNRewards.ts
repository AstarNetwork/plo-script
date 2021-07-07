import BigNumber from 'bignumber.js';
import { promises as fs } from 'fs';
import path from 'path';
import calculator from '../helper/calculator';
import { Config } from '../model/Config';
import { Reward, toJSON } from '../model/Reward';

// script entry point
export default async () => {
  // cache names are based on contract address
  const cacheFileDir = path.join(process.cwd(), Config.get().rewardsJSONPath);

  const res = await calculator([Config.get().crowdloanJSONPath], Config.chainType);
  console.log(res);
  console.log(
    'sum:',
    res.reduce((sum: BigNumber, current: Reward) => (sum = sum.plus(current.amount)), new BigNumber(0)).toString(),
  );

  const jsonBlob = toJSON(res);
  // console.log(jsonBlob);

  await fs.writeFile(cacheFileDir, jsonBlob);
};
