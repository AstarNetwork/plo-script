import { BigNumber } from 'bignumber.js';
import { Participant } from './Paritcipant';
import { SubscanApi } from './SubscanTypes';

export type Reward = {
  account_id: string;
  amount: BigNumber;
};

export type Parameter = {
  // started Crowdloan(Block)
  started: number;
  // auctionStarted[i] = i-th auction started block number.
  auctionsStarted: number[];
  // contributeCofficient[i] = Coefficient before i-th auction is started.
  contributeCofficient: number[];
  // supplid amount of this calc reward.
  supply: number;
};

// SDN_{a,b} = \frac{KSM_{a,b}C_a}{\sum_{i=0}^{n}{\sum_{j=0}^{m_i}KSM_{i,j}C_i}}\times6,750,000
export const SDNCrowdloanParameter: Parameter = {
  started: 0,
  // 1st end: https://kusama.subscan.io/auction/1
  // 2nd end: https://kusama.subscan.io/auction/2
  // 3rd end: https://kusama.subscan.io/auction/3 (won)
  auctionsStarted: [8023773, 8123989, 8224041],
  contributeCofficient: [6, 5, 4, 0], // same as C[i]
  supply: 15400000, // 22% of total supply
};

export const toJSON = (rs: Reward[]): string => {
  return JSON.stringify(
    rs.map((r: Reward) => {
      return {
        ...r,
        amount: r.amount.toString(),
      };
    }),
  );
};

export const fromJSON = (jsonBlob: string): Reward[] => {
  return (JSON.parse(jsonBlob) as Reward[]).map((r: Reward) => {
    return {
      ...r,
      amount: new BigNumber(r.amount),
    };
  });
};
