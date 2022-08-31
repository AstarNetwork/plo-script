# Plasm/Shiden/Astar Reward Script

This is the repo that stores all the information regarding the Plasm/Shiden/Astar Network token distribution.
We will use this repository and script for future reward distributions too.

## Reward Types

- Lockdrop (1st & 2nd): Before the official launch of Plasm Network (a standalone Substrate blockchain before Astar Network), we used a lockdrop contract to distribute our genesis tokens. The 2nd lockdrop was used to distribute additional tokens after the genesis. The 2nd lockdrop is also known as the real-time lockdrop, as the rewards were distributed in real-time as the users locked their tokens. We achieved this with a combination of a custom pallet and a price oracle. The reward distributed through the lockdrop also determined the genesis reward for Astar Network.
- Kusama Crowdloan: During the Kusama parachain slot auction, we also participated in it to launch our sister canary network called the Shiden Network. The reward for this network was distributed via the Parachain Lease Offering (PLO) with our public crowdloan campaign.
- Polkadot Crowdloan: For the Polkadot parachain slot auction, we participated with the newly born Plasm Network, re-named to the Astar Network. This was our main goal from the beginning. Similar to Shiden Network's launch, we distributed the genesis reward via the PLO through a public crowdloan campaign and the account balance of Plasm Network at the time the auction has ended.
- Investment and private sales: Outside of the public token distribution, we also had a private token sale for our investors. Note that depending on the type of investment, some investors participated in the lockdrop instead of direct token purchases.

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

The reward was distributed from the maximum supply of `500,000,000 PLM`.

**2nd Lockdrop (real-time lockdrop)**

- The lockdrop contract address: `0xa4803f17607b7cdc3dc579083d9a14089e87502b`
- Deployed at block: `10714638`
- Lockdrop period: around 2020-08-31 ~ 2020-09-30
- Total amount locked: `137,252.997122413726123965` ETH

The alpha value is defined as a constant of `0.446981087`.

The second lockdrop was done in real-time with the time of locking to the contract in Ethereum and the moment they claimed their rewards.
While the first lockdrop had a limited supply and the calculation was done after the lockdrop, the second lockdrop used real-time token prices for the calculation, and there was no limited supply for the distribution as the first one already had a fix supply.

For the user to claim their rewards, they must go through the following steps:

1. Lock ETH to the lockdrop contract on Ethereum.
2. Submit a reward request to the Plasm Network (This is where the price of the ETH is calculated).
3. Submit a claim request to receive the PLM tokens to their account (or another account).

We used an oracle provided by ChainLink to fetch the Ethereum price.
The implementation can be found from [this code](https://github.com/AstarNetwork/Astar/blob/19279a183aa6063dae41706fa171c6aa0310738d/frame/plasm-lockdrop/src/lib.rs#L380).

The full calculation for the rewards is as the following:

```txt
alpha * dollar rate of locked token priced * duration bonus * locked amount
```

For example, let's say a user locks 5 ETH for 300 days, and the price of ETH was around 200 USD at the time of request to claim.

We first convert 5 ETH into the PLM minimum denomination (1 ETH = 10^18 Wei, and 1 PLM = 10^15 'Wei', so we divide ETH Wei by 1000 so that 1 PLM = 1 ETH/1000), which will give us `5 * 10^15` in minimum denomination.

If we take the equation and plug it in with the example, we will get the following calculation.

```txt
0.446981087 * 200 * 360 * (5 * 10^15) = 160913191300000000000 => 160,913.1913 PLM
```

### Shiden PLO

[Kusama crowdloan reward rate per KSM]

[Kusama crowdloan early adopter bonus]

[Kusama crowdloan referral bonus]

### Astar PLO and Genesis Distribution

[Astar genesis from Plasm block snapshot]

[Polkadot crowdloan reward rate per DOT]

[Polkadot crowdloan early adopter bonus]

[Polkadot crowdloan Shiden supporter bonus]

[Polkadot crowdloan referral bonus]

## Investor Rewards
