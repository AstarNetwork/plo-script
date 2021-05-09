import { BigNumber } from 'bignumber.js';
import { SubscanApi } from './SubscanTypes';

export type Participant = {
  account_id: string;
  amount: BigNumber;
  timestamp: Date;
  how: SubscanApi.Query;
};

const blockTimestamp2Date = (blockTimestamp: number): Date => new Date(blockTimestamp * 1000);

export const fromBids = (events: SubscanApi.EventBids[]): Participant[] => {
  return events.map((e) => {
    return {
      account_id: e.bidder_account,
      amount: new BigNumber(e.amount),
      timestamp: blockTimestamp2Date(e.block_timestamp),
      how: 'bids',
    };
  });
};

export const fromContributes = (events: SubscanApi.EventContributes[]): Participant[] => {
  return events.map((e) => {
    return {
      account_id: e.who,
      amount: new BigNumber(e.contributed),
      timestamp: blockTimestamp2Date(e.block_timestamp),
      how: 'contributes',
    };
  });
};
