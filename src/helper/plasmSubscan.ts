import { SubscanApi } from '../model/SubscanTypes';
import { postJsonRequest } from './utils';
import { setTimeout as sleep } from 'timers/promises';
import { fromBids, fromContributes, Participant } from '../model/Paritcipant';
import { Config } from '../model/Config';
import subscanJson from '../../config/subscan.json';

export type Endpoint = {
  plasm: string;
  relay: string;
  auction_index: number;
  para_id: number;
  fund_id: string;
};

export const SUBSCAN_ENDPOINTS = subscanJson as { [key: string]: Endpoint };

export const eventConvert = {
  bids: fromBids,
  contributes: fromContributes,
} as { [key: string]: (event: SubscanApi.Event[]) => Participant[] };

export const subscanEndpoints = () => SUBSCAN_ENDPOINTS[Config.chainType];

export async function fetchPlasmEvents(
  module: SubscanApi.Module,
  query: SubscanApi.Query,
  displayRow: number,
  payload: SubscanApi.Payload,
  fetchType: 'all' | 'single-page',
  flush?: boolean,
): Promise<Participant[]> {
  const api = `${subscanEndpoints().relay}/${module}/${query}`;

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
    if (flush) console.log(`logs[page=${page}]:`, logs);
    if (logs.code !== 0) {
      throw new Error(logs.message);
    }
    return logs.data[query] || [];
  };

  let res = await fetchEventPage(api, query, payload);
  if (flush) console.log('res[page=0]:', res);
  console.info(`fetched res[page=0].`);
  if (fetchType === 'all') {
    let results: SubscanApi.Event[] = [];
    let page = 1;
    while (res.length) {
      await sleep(3000); // 3s sleep
      results = results.concat(res);
      res = await fetchEventPage(api, query, payload, page++);
      if (flush) console.log(`res[page=${page - 1}]:`, res);
      console.info(`fetched res[page=${page - 1}].`);
    }
    return eventConvert[query](results);
  }
  return eventConvert[query](res);
}
