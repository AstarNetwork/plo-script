# PLO Scripts

This script calculates and distributes the compensation for Parachain Lease Offering in the Plasm network.

Parachain Lease Offering fees are distributed according to the logic of this script.

## Settings
- `config/config.json`: Specifies the mnemonic phrase of the user who will run the deployment and the file in which to save it.
- `config/subscan.json`: Set the parameters to use when hitting the Subscan API here, such as AuctionId, ParaId, fundId, etc.

## Execute
You can run the program in the following command format.
`yarn start -e <execute option> -c <chain option>`

### execute option
- `auction`: Aggregates the bids for Parachain Auction.
- `crowdloan`: Aggregate contributions to the Crowdloan; note that it is different in nature from bids.
- `rewards`: Calculate the reward to be distributed to each user based on the aggregate results of bids and contributions.
- `transfer`: Distribute the actual reward from the calculated reward. This transaction will be executed only once. Also, make sure that there is enough tokens in the specified mnemonic address to cover the total amount of rewards plus the cost of gas.

### chain option
Specifies the name of the relay chain. The following relay chains are supported.
- `kusama`
- `polkadot`
- `rococo`

## Project Structure

Everything that is directly related to the tool's functionality will be inside the `src/*` folder.
`yarn start` will execute `index.ts`, which contains what ever script you imported inside the `cli/` folder.

- `src/cli/`: The main tool logic. Everything you want to execute should be in here.
- `src/helper/`: All utility functions that is used throughout different cli functions should be placed here.
- `src/model/`: Data models used internally and from external APIs should be defined here.
- `src/type/`: This is a special folder that contains the global type declarations, for example, importing `.csv` files as string within TypeScript.
- `report/`: Cached data, account data, any fixed peace of data will be placed in here, and it is recommended that all local data read/writes within a cli function points their directory to this folder.
