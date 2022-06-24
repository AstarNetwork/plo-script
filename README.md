# Plasm/Shiden/Astar Reward Script

This is the repo that stores all the information regarding the Plasm/Shiden/Astar Network token distribution.
We will use this repository and script for future reward distributions too.

## Reward Types

- Lockdrop (1st & 2nd): Before the official launch of Plasm Network (a standalone Substrate blockchain before Astar Network), we used a lockdrop contract to distribute our genesis tokens. The 2nd lockdrop was used to distribute additional tokens after the genesis. The 2nd lockdrop is also known as the real-time lockdrop, as the rewards were distributed in real-time as the users locked their tokens. We achieved this with a combination of a custom pallet and a price oracle. The reward distributed through the lockdrop also determined the genesis reward for Astar Network.
- Kusama Crowdloan: During the Kusama parachain slot auction, we also participated in it to launch our sister canary network called the Shiden Network. The reward for this network was distributed via the Parachain Lease Offering (PLO) with our public crowdloan campaign.
- Polkadot Crowdloan: For the Polkadot parachain slot auction, we participated with the newly born Plasm Network, re-named to the Astar Network. This was our main goal from the beginning. Similar to Shiden Network's launch, we distributed the genesis reward via the PLO through a public crowdloan campaign and the account balance of Plasm Network at the time the auction has ended.

## Reward Scheme

### Plasm Network Lockdrop

This section will only cover the general distribution logic for Plasm Network.
For the full technical distribution formula, please refer to our old [whitepaper](https://github.com/AstarNetwork/plasmdocs/blob/master/wp/en.pdf).

Plasm Network had two lockdrops, one for the genesis token distribution, and a 2nd lockdrop for post-launch token distribution.
For both lockdrops, users would visit the [Lockdrop page](https://lockdrop.astar.network/#/lock-form) to lock and unlock their ETH.

The lockdrop contract was [audited by Quantstamp](https://github.com/AstarNetwork/lockdrop-ui/blob/master/eth-truffle/audit/quantstamp-audit.pdf).
You can find the contract source code at <https://github.com/AstarNetwork/lockdrop-ui/blob/master/eth-truffle/contracts/Lockdrop.sol>.

The lockdrop reward will depend on the amount of ETH the user locked, and the duration the locker chose.
Users can lock for 30 days, 100 days, 300 days, and 1000 days, and the reward multiplier will look like the following:

| Lock Duration (days) | Bonus Rate (multiplier) |
|----------------------|-------------------------|
| 30                   | 24                      |
| 100                  | 100                     |
| 300                  | 360                     |
| 1000                 | 1600                    |

The formula for calculating the reward PLM token is:

```text
lockdrop alpha * locked token amount (ex: ETH) * token USD rate * lock duration bonus => lockdrop reward PLM
```

Outside the general formula, there are a couple of parts that are different between the first and second lockdrop.

- The point when the USD exchange rate was calculated
- The referral program
- The lockdrop issue ratio (alpha value)

**1st Lockdrop**

- The lockdrop contract address: `0x458dabf1eff8fcdfbf0896a6bd1f457c01e2ffd6`
- Deployed at block: `9662816`
- Lockdrop period: around 2020-03-15 ~ 2020-04-14
- Total amount locked: `16,783.212512023` ETH

The first lockdrop reward was distributed as the genesis state for Plasm Network.
This means that the reward was calculated after the lockdrop was finished based on the locked contract event.

For the first lockdrop, there was a referral bonus called the 'Affiliate Program,' which provided a 1% bonus to the final reward to anyone who entered the lockdrop with a referral.

In order for people to be part of the affiliate program, they must first be a member of the Plasm Discord server, and they have to fill in a Google form with their Discord tag and the Ethereum address that is used to participate in the lockdrop.

You can learn more about the detailed instructions from [this Medium article](https://medium.com/astar-network/lockdrop-with-friends-the-plasm-network-affiliation-program-b385c1cd800d).

**2nd Lockdrop (real-time lockdrop)**

- The lockdrop contract address: `0xa4803f17607b7cdc3dc579083d9a14089e87502b`
- Deployed at block: `10714638`
- Lockdrop period: around 2020-08-31 ~ 2020-09-30
- Total amount locked: `137,252.997122413726123965` ETH



The alpha value is defined as a constant of `0.446981087`.

For example, if the user locks 

### Shiden PLO

### Astar PLO and Genesis Distribution
