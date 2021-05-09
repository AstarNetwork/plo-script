import fetch from 'node-fetch';
import { SubscanApi } from '../model/SubscanTypes';
import { postJsonRequest } from './utils';
import { setTimeout as sleep } from 'timers/promises';
import { fromBids, fromContributes, Participant } from '../model/Paritcipant';

export type Endpoint = {
    plasm: string;
    relay: string;
};

export const SUBSCAN_ENDPOINTS = {
    rococo: {
        plasm: 'https://dusty.subscan.io/api/scan',
        relay: 'https://rococo.api.subscan.io/api/scan',
    },
    kusama: {
        plasm: 'https://shiden.subscan.io/api/scan',
        relay: 'https://kusama.api.subscan.io/api/scan',
    },
    polkadot: {
        plasm: 'https://plasm.subscan.io/api/scan',
        relay: 'https://polkadot.api.subscan.io/api/scan',
    },
} as { [key: string]: Endpoint };

export const eventConvert = {
    bids: fromBids,
    contributes: fromContributes,
} as { [key: string]: (event: SubscanApi.Event[]) => Participant[] };

export const subscanEndpoints = SUBSCAN_ENDPOINTS[process.env.NETWORK ?? 'rococo'];

export async function fetchPlasmEvents(
    module: string,
    query: SubscanApi.Query,
    displayRow: number,
    payload: SubscanApi.Payload,
    fetchType: 'all' | 'single-page',
): Promise<Participant[]> {
    const api = `${subscanEndpoints.relay}/${module}/${query}`;

    const fetchEventPage = async (
        api: string,
        query: SubscanApi.Query,
        payload: SubscanApi.Payload,
        page = 0,
        row = displayRow,
    ): Promise<SubscanApi.Event[]> => {
        const apiParam = {
            row,
            page,
            ...payload,
        } as SubscanApi.Payload & SubscanApi.Pagination;
        const res = await postJsonRequest(api, apiParam);
        const logs: SubscanApi.Response = JSON.parse(res);
        if (logs.code !== 0) {
            throw new Error(logs.message);
        }
        return logs.data[query] || [];
    };

    let res = await fetchEventPage(api, query, payload);
    if (fetchType === 'all') {
        let results: SubscanApi.Event[] = [];
        let page = 1;
        while (res.length) {
            await sleep(3000); // 3s sleep
            results = results.concat(res);
            res = await fetchEventPage(api, query, payload, page++);
        }
        return eventConvert[query](results);
    }
    return eventConvert[query](res);
}
