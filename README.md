# Astar/Shiden Reward Script

This is the repo that stores all the information regarding the Astar/Shiden Network token distribution.
We will use this repository and script for future reward distributions too.

## Reward Types

- Lockdrop (1st & 2nd): Before the official launch of Plasm Network (a standalone Substrate blockchain before Astar Network), we used a lockdrop contract to distribute our genesis tokens. The 2nd lockdrop was used to distribute additional tokens after the genesis. The 2nd lockdrop is also known as the real-time lockdrop, as the rewards were distributed in real-time as the users locked their tokens. We achieved this with a combination of a custom pallet and a price oracle. The reward distributed through the lockdrop also determined the genesis reward for Astar Network.
- Kusama Crowdloan: