import { promises as fs } from 'fs';
import path from 'path';
import { fetchPlasmEvents, subscanEndpoints } from '../helper/plasmSubscan';
import { Config } from '../model/Config';
import { toJSON } from '../model/Paritcipant';
import { SubscanApi } from '../model/SubscanTypes';

// script entry point
export default async () => {
  // cache names are based on contract address
  const cacheFileDir = path.join(process.cwd(), Config.get().crowdloanJSONPath);
  const res = await fetchPlasmEvents(
    'parachain',
    'contributes',
    50,
    {
      fund_id: subscanEndpoints.fund_id,
    } as SubscanApi.EventContributesPayload,
    'single-page',
    process.env.DEBUG === 'true',
  );
  const jsonBlob = toJSON(res);
  console.log('write:', cacheFileDir, jsonBlob);

  await fs.writeFile(cacheFileDir, jsonBlob);
};
