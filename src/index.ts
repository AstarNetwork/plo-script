#!/usr/bin/env ts-node
import * as scripts from './cli';
import * as yargs from 'yargs';

const argv = yargs.option('execute', {
  alias: 'e',
  choice: ['bids', 'contributes', 'sdn'],
  description: 'kind of execite script',
});

(async () => {
  const e = argv.argv.execute;
  switch (e) {
    case 'bids':
      await scripts.fetchAuctionEvents();
      break;
    case 'contributes':
      await scripts.fetchCrowdloanEvents();
      break;
    case 'sdn':
      await scripts.calcSDNRewards();
      break;
    default:
      await scripts.embeddedGenesis();
      break;
  }
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
