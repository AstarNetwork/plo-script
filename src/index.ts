#!/usr/bin/env ts-node
import * as scripts from './cli';
import * as yargs from 'yargs';
import { ChainType } from './model/ChainType';
import { Config } from './model/Config';

const argv = yargs
  .option('execute', {
    alias: 'e',
    choice: ['auction', 'crowdloan', 'reward', 'transfer'],
    description: 'kind of execite script',
  })
  .option('chain', {
    alias: 'c',
    choices: ['kusama', 'polkadot', 'rococo'],
    description: 'kind of network',
  });

(async () => {
  const chain = argv.argv.network as ChainType;
  // set global config.
  Config.setChain(chain);
  const e = argv.argv.execute;
  switch (e) {
    case 'auction':
      await scripts.fetchAuctionEvents();
      break;
    case 'crowdloan':
      await scripts.fetchCrowdloanEvents();
      break;
    case 'reward':
      switch (chain) {
        case 'kusama':
          await scripts.calcSDNRewards();
        default:
          break;
      }
      break;
    case 'transfer':
      await scripts.vestedTransfer();
    default:
      await scripts.embeddedGenesis();
      break;
  }
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
