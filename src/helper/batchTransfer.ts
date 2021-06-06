import { AddressOrPair } from '@polkadot/api/types';
import Keyring from '@polkadot/keyring';
import BigNumber from 'bignumber.js';
import { ChainType } from '../model/ChainType';
import { Config } from '../model/Config';
import PlasmClient, { VestingConfig } from '../model/PlasmClient';
import { Reward } from '../model/Reward';

const makeVestedConfig = (chain: ChainType, reward: BigNumber): VestingConfig => {
  switch (chain) {
    case 'kusama':
      // https://github.com/PlasmNetwork/Plasm/blob/shiden/runtime/shiden-runtime/src/lib.rs#L89
      // 6 second average block time.
      // so 9 month = 3628800 blocks
      // 1 month = 403200 blocks
      return {
        preBlock: reward.div(3628800).toFixed().toString(),
        startingBlock: 3628800,
      };
  }

  return {
    preBlock: '0',
    startingBlock: 1,
  };
};

const makeKeyring = (): AddressOrPair => {
  const keyring = new Keyring({ type: 'sr25519' });
  return keyring.addFromUri(Config.get().phrase);
};

export const batchTransfer = async (rewards: Reward[]) => {
  const client = new PlasmClient(Config.chainType, makeKeyring());
  const txs = rewards.map((reward) =>
    client.vestedTransfer(reward.account_id, reward.amount, makeVestedConfig(Config.chainType, reward.amount)),
  );
  const batchTx = client.batch(txs);
  const result = await client.signAndSend(batchTx);
  console.log('finished batch result:', result);
};
