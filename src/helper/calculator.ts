import { promises as fs } from 'fs';
import BigNumber from 'bignumber.js';
import { fromJSON, Participant } from '../model/Paritcipant';
import { Parameter, Reward, SDNCrowdloanParameter } from '../model/Reward';
import { ChainType } from '../model/ChainType';
import { promiseMap } from './utils';

export const calcSDN = (participants: Participant[], param: Parameter): Reward[] => {
  // filter only contributes.
  participants = participants.filter((p: Participant) => p.how === 'contributes');

  // calc denominator.
  const totalDenominator = participants.reduce((sum: BigNumber, now: Participant) => {
    const index = param.auctionsStarted.findIndex((started: number) => now.blocknumber < started);
    const c = param.contributeCofficient[index];
    return sum.plus(now.amount.times(c));
  }, new BigNumber(0));

  // calc result of paticipants.
  return participants.map((p: Participant) => {
    const index = param.auctionsStarted.findIndex((started: number) => p.blocknumber < started);
    const c = param.contributeCofficient[index];
    return {
      account_id: p.account_id,
      amount: p.amount.times(c).div(totalDenominator).times(param.supply),
    } as Reward;
  });
};

export default async (pathes: string[], chain: ChainType): Promise<Reward[]> => {
  const particpants = (
    await promiseMap(
      pathes,
      async (path: string): Promise<Participant[]> => fromJSON((await fs.readFile(path)).toString()),
    )
  ).reduce((pre, now) => pre.concat(now), []);
  console.log(particpants);
  switch (chain) {
    case 'rococo':
      return calcSDN(particpants, SDNCrowdloanParameter);
    case 'kusama':
      return calcSDN(particpants, SDNCrowdloanParameter);
    case 'polkadot':
      return calcSDN(particpants, SDNCrowdloanParameter);
  }
};
