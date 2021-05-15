import { promises as fs } from 'fs';
import path from 'path';
import { fetchPlasmEvents, subscanEndpoints } from '../helper/plasmSubscan';
import { toJSON } from '../model/Paritcipant';
import { SubscanApi } from '../model/SubscanTypes';

const ID_NAME = 'crowdloan';

// script entry point
export default async () => {
  // cache names are based on contract address
  const cacheFileDir = `${path.join(process.cwd(), 'report/')}cache-${ID_NAME}.json`;
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
