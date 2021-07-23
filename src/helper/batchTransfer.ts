import { AddressOrPair } from '@polkadot/api/types';
import { Keyring } from '@polkadot/api';
import { waitReady } from '@polkadot/wasm-crypto';
import BigNumber from 'bignumber.js';
import { ChainType } from '../model/ChainType';
import { Config } from '../model/Config';
import PlasmClient, { VestingConfig } from '../model/PlasmClient';
import { Reward } from '../model/Reward';
import { setTimeout as sleep } from 'timers/promises';

const CHUNK = 100;

const makeVestedConfig = (chain: ChainType, reward: BigNumber): VestingConfig => {
  switch (chain) {
    case 'kusama':
      // https://github.com/PlasmNetwork/Plasm/blob/shiden/runtime/shiden-runtime/src/lib.rs#L89
      // 6 second average block time.
      // so 9 month = 3628800 blocks
      // 1 month = 403200 blocks
      return {
        srcAddress: 'aXNWfAMUV3YjRoGgceJJpieqzteL4jUWR7LM4xZfHfCGDfQ',
        perBlock: reward.div(3628800).toFixed(18).toString(),
        startingBlock: 3628800,
      };
    default:
      return {
        srcAddress: 'aEuGkN4A4oUQaWKqfTTR42EcpxvsjEYfESWgUy6fhcrYzgU', // ALICE_STASH
        perBlock: reward.div(3628800).toFixed(15).toString(),
        startingBlock: 3628800,
      };
  }
};

const makeKeyring = (): AddressOrPair => {
  const keyring = new Keyring({ type: 'sr25519' });
  return keyring.addFromUri(Config.get().phrase);
};

export const batchTransfer = async (rewards: Reward[]) => {
  await waitReady();
  console.log('batchTransfer!');
  const client = new PlasmClient(Config.chainType, makeKeyring());
  await client.setup();
  let nonce = (await client.nonce()) ?? 0;
  // Every CHUNK txs.
  for (let i = 0; i < rewards.length; i += CHUNK) {
    const chunk_rewards = rewards.slice(i, Math.min(i + CHUNK, rewards.length));
    const txs = chunk_rewards.map((reward) =>
      client.vestedTransfer(reward.account_id, reward.amount, makeVestedConfig(Config.chainType, reward.amount)),
    );
    const batchTx = client.sudo(client.batch(txs));
    const result = await client.signAndSend(batchTx, { nonce });
    console.log(
      'batch result :',
      nonce,
      i / CHUNK,
      chunk_rewards.map((reward) => [reward.account_id, reward.amount.toString()]),
      result.toString(),
    );
    nonce += 1;
    await sleep(10000); // 10s sleep
  }
};
