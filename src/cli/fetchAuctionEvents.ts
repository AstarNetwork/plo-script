import fs from 'fs';
import path from 'path';
import { fetchPlasmEvents, subscanEndpoints } from '../helper/plasmSubscan';
import { SubscanApi } from '../model/SubscanTypes';

const ID_NAME = 'auction';

// script entry point
export default async () => {
    // cache names are based on contract address
    const cacheFileDir = `${path.join(process.cwd(), 'cache/')}cache-${ID_NAME.slice(0, 6)}.json`;
    const res = await fetchPlasmEvents(
        'parachain',
        'bids',
        50,
        {
            auction_index: subscanEndpoints.auction_index,
            para_id: subscanEndpoints.para_id,
        } as SubscanApi.EventBidsPayload,
        'single-page',
        process.env.DEBUG === 'true',
    );
    const jsonBlob = JSON.stringify(res);

    fs.writeFile(cacheFileDir, jsonBlob, function (err) {
        if (err) return console.error(err);
    });
};
