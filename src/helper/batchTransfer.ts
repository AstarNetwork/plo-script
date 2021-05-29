import { ChainType } from '../model/ChainType';
import PlasmClient, { VestingConfig } from '../model/PlasmClient';
import { Reward } from '../model/Reward';

const makeVestedConfig = (chain: ChainType): VestingConfig => {
  // TODO:
  return {
    preBlock: 0,
    startingBlock: 1,
  };
};

export const batchTransfer = async (rewards: Reward[], chain: ChainType) => {
  const client = new PlasmClient(chain, {});
  const vestedConfig = makeVestedConfig(chain);
  const txs = rewards.map((reward) => client.vestedTransfer(reward.account_id, reward.amount, vestedConfig));
  const batchTx = client.batch(txs);
  const result = await client.signAndSend(batchTx);
  console.log('finished batch result:', result);
};
