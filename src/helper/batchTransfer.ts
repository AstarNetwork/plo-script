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
export const FIXED_DIGITS = 18;
const ONE_MONTH = 28 * 24 * 60 * 60;
const BLOCK_PER_SECOND = 12;
const ONE_MONTH_BLOCKS_PER_12_SECONDS = ONE_MONTH / BLOCK_PER_SECOND;
const TEN_MONTH_BLOCKS_PER_12_SECONDS = (10 * ONE_MONTH) / BLOCK_PER_SECOND;
const ACTUAL_STARTING_BLOCK_SHIDEN = 200000;

const makeVestedConfig = (chain: ChainType, reward: BigNumber): VestingConfig => {
  switch (chain) {
    case 'kusama':
      // https://github.com/PlasmNetwork/Plasm/blob/shiden/runtime/shiden-runtime/src/lib.rs#L89
      // 12 second average block time.
      // so 10 month = 2016000 blocks
      // 1 month = 201600 blocks
      // actual = 200000 block.
      return {
        srcAddress: 'aXNWfAMUV3YjRoGgceJJpieqzteL4jUWR7LM4xZfHfCGDfQ',
        perBlock: reward.div(TEN_MONTH_BLOCKS_PER_12_SECONDS),
        startingBlock: ACTUAL_STARTING_BLOCK_SHIDEN,
      };
    case 'shibuya':
      return {
        srcAddress: 'aXNWfAMUV3YjRoGgceJJpieqzteL4jUWR7LM4xZfHfCGDfQ',
        perBlock: reward.div(TEN_MONTH_BLOCKS_PER_12_SECONDS),
        startingBlock: ONE_MONTH_BLOCKS_PER_12_SECONDS,
      };
    case 'polkadot':
      return {
        srcAddress: 'aXNWfAMUV3YjRoGgceJJpieqzteL4jUWR7LM4xZfHfCGDfQ',
        perBlock: reward.div(TEN_MONTH_BLOCKS_PER_12_SECONDS),
        startingBlock: ONE_MONTH_BLOCKS_PER_12_SECONDS,
      };
    default:
      return {
        srcAddress: 'aEuGkN4A4oUQaWKqfTTR42EcpxvsjEYfESWgUy6fhcrYzgU', // ALICE_STASH
        perBlock: reward.div(TEN_MONTH_BLOCKS_PER_12_SECONDS),
        startingBlock: ONE_MONTH_BLOCKS_PER_12_SECONDS,
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
  const ret = [];
  // Every CHUNK txs.
  for (let i = 0; i < rewards.length; i += CHUNK) {
    const chunk_rewards = rewards.slice(i, Math.min(i + CHUNK, rewards.length));
    const txs = chunk_rewards.map((reward) =>
      client.vestedTransfer(reward.account_id, reward.amount, makeVestedConfig(Config.chainType, reward.amount)),
    );
    const batchTx = client.sudo(client.batch(txs));
    const result = await client.signAndSend(batchTx, { nonce });
    ret.push({
      nonce,
      chunk: i / CHUNK,
      rewards: chunk_rewards.map((reward) => [reward.account_id, reward.amount.toString()]),
      hash: result.toString(),
    });
    console.log(
      'batch result :',
      nonce,
      i / CHUNK,
      chunk_rewards.map((reward) => [reward.account_id, reward.amount.toString()]),
      result.toString(),
    );
    nonce += 1;
    await sleep(15000); // 15s sleep
  }
  return ret;
};
