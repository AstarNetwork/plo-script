import { AddressOrPair } from '@polkadot/api/types';
import { Keyring } from '@polkadot/api';
import { waitReady } from '@polkadot/wasm-crypto';
import BigNumber from 'bignumber.js';
import { ChainType } from '../model/ChainType';
import { Config } from '../model/Config';
import PlasmClient, { VestingConfig } from '../model/PlasmClient';
import { Reward } from '../model/Reward';
import { setTimeout as sleep } from 'timers/promises';
import { getVestingSchedule } from './utils';

const CHUNK = 100;
export const FIXED_DIGITS = 18;
const ONE_MONTH = 28 * 24 * 60 * 60;
const BLOCK_PER_SECOND = 12;
const ONE_MONTH_BLOCKS_PER_12_SECONDS = ONE_MONTH / BLOCK_PER_SECOND;
const TEN_MONTH_BLOCKS_PER_12_SECONDS = (10 * ONE_MONTH) / BLOCK_PER_SECOND;

const ONE_DAY_BLOCKS_PER_12_SECONDS = (24 * 60 * 60) / BLOCK_PER_SECOND;
const SHORT_VESTING_PERIOD = ONE_DAY_BLOCKS_PER_12_SECONDS / 2;

// 22 months
const ASTR_CROWDLOAN_REWARD_VESTING = ONE_MONTH_BLOCKS_PER_12_SECONDS * 22;
// 7 months
const LOCKDROP_REWARD_VESTING_TIER1 = ONE_MONTH_BLOCKS_PER_12_SECONDS * 7;
// 15 months
const LOCKDROP_REWARD_VESTING_TIER2 = ONE_MONTH_BLOCKS_PER_12_SECONDS * 15;

const ACTUAL_STARTING_BLOCK_SHIDEN = 200000;

// Jan 17th 2022
const ACTUAL_STARTING_BLOCK_ASTAR = 210541;
const SHORT_VESTING_START = 207800;

const astar10PercentDistribution = (reward: BigNumber) => {
  return {
    srcAddress: 'a77bQE6VsapT3FCnf5wQgGn55tYuLjS1v4KEz4FmFav7V1q',
    // todo: set the vesting duration here
    perBlock: reward.div(SHORT_VESTING_PERIOD),
    startingBlock: SHORT_VESTING_START, // now
  };
};

const astar90PercentDistribution = (reward: BigNumber) => {
  return {
    srcAddress: 'a77bQE6VsapT3FCnf5wQgGn55tYuLjS1v4KEz4FmFav7V1q',
    perBlock: reward.div(ASTR_CROWDLOAN_REWARD_VESTING),
    startingBlock: ACTUAL_STARTING_BLOCK_ASTAR,
  };
};

const lockdropTier1ShortVesting = (reward: BigNumber) => {
  return {
    srcAddress: 'b6pba6jZYphJro4v7xf8H93K8Xei4WtwtL2hAtawJcJnpAZ',
    perBlock: reward.div(SHORT_VESTING_PERIOD),
    startingBlock: SHORT_VESTING_START, // now
  };
};

const lockdropTier1LongVesting = (reward: BigNumber) => {
  return {
    srcAddress: 'b6pba6jZYphJro4v7xf8H93K8Xei4WtwtL2hAtawJcJnpAZ',
    perBlock: reward.div(LOCKDROP_REWARD_VESTING_TIER1),
    startingBlock: ACTUAL_STARTING_BLOCK_ASTAR, // now
  };
};

const lockdropTier2ShortVesting = (reward: BigNumber) => {
  return {
    srcAddress: 'b6pba6jZYphJro4v7xf8H93K8Xei4WtwtL2hAtawJcJnpAZ',
    perBlock: reward.div(SHORT_VESTING_PERIOD),
    startingBlock: SHORT_VESTING_START, // now
  };
};

const lockdropTier2LongVesting = (reward: BigNumber) => {
  return {
    srcAddress: 'b6pba6jZYphJro4v7xf8H93K8Xei4WtwtL2hAtawJcJnpAZ',
    perBlock: reward.div(LOCKDROP_REWARD_VESTING_TIER2),
    startingBlock: ACTUAL_STARTING_BLOCK_ASTAR, // now
  };
};

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
      return lockdropTier1ShortVesting(reward);
    default:
      return {
        srcAddress: 'ZAP5o2BjWAo5uoKDE6b6Xkk4Ju7k6bDu24LNjgZbfM3iyiR', // BOB
        perBlock: reward.div(LOCKDROP_REWARD_VESTING_TIER1),
        startingBlock: ACTUAL_STARTING_BLOCK_ASTAR,
      };
  }
};

const makeKeyring = (): AddressOrPair => {
  const keyring = new Keyring({ type: 'sr25519' });
  return keyring.addFromUri(Config.get().phrase);
};

export const batchTransfer = async (rewards: Reward[]) => {
  return await forceTransfer(rewards);
};

export const forceTransfer = async (rewards: Reward[]) => {
  await waitReady();
  console.log('forceTransfer!');
  const client = new PlasmClient(Config.chainType, makeKeyring());
  await client.setup();
  let nonce = (await client.nonce()) ?? 0;
  const ret = [];
  // Every CHUNK txs.
  for (let i = 0; i < rewards.length; i += CHUNK) {
    const chunk_rewards = rewards.slice(i, Math.min(i + CHUNK, rewards.length));

    const txs = chunk_rewards.map((reward) => {
      const config = makeVestedConfig(Config.chainType, reward.amount);
      // normal transfer
      return client.forceTransfer(config.srcAddress, reward.account_id, reward.amount);
    });

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

export const forceVestingTransfer = async (rewards: Reward[]) => {
  await waitReady();
  console.log('batchTransfer!');
  const client = new PlasmClient(Config.chainType, makeKeyring());
  await client.setup();
  let nonce = (await client.nonce()) ?? 0;
  const ret = [];
  // Every CHUNK txs.
  for (let i = 0; i < rewards.length; i += CHUNK) {
    const chunk_rewards = rewards.slice(i, Math.min(i + CHUNK, rewards.length));

    const txs = chunk_rewards.map((reward) => {
      const vestingConfig = makeVestedConfig(Config.chainType, reward.amount);
      return client.vestedTransfer(reward.account_id, reward.amount, vestingConfig);
    });
    const batchTx = client.sudo(client.batch(txs));
    const result = await client.signAndSend(batchTx, { nonce });
    const rewardData = chunk_rewards.map((reward) => [
      reward.account_id,
      reward.amount.toString(),
      getVestingSchedule(makeVestedConfig(Config.chainType, reward.amount), reward.amount),
    ]);

    ret.push({
      nonce,
      chunk: i / CHUNK,
      rewards: rewardData,
      hash: result.toString(),
    });

    console.log('batch result :', nonce, i / CHUNK, JSON.stringify(rewardData), result.toString());
    nonce += 1;
    //await sleep(15000); // 15s sleep
    await sleep(5000);
  }
  return ret;
};
