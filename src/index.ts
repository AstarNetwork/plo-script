#!/usr/bin/env ts-node

import * as scripts from './cli';
import * as yargs from 'yargs';

const argv = yargs.option('execute', {
    alias: 'e',
    choice: ['bids', 'contributes'],
    description: 'kind of execite script',
});

(async () => {
    const e = argv.argv.execute;
    switch (e) {
        case 'bids':
            scripts.fetchAuctionEvents();
        case 'contributes':
            scripts.fetchCrowdloanEvents();
        default:
            await scripts.embeddedGenesis();
    }
    process.exit(0);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
