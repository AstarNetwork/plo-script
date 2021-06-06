import { ApiPromise, WsProvider } from '@polkadot/api';
import { ChainType } from './ChainType';
// import typeDefs from '@plasm/types';
import plasmDefinitions from '../type/types';
import { RegistryTypes, ISubmittableResult } from '@polkadot/types/types';
import BigNumber from 'bignumber.js';
import { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types';

const AUTO_CONNECT_MS = 10_000; // [ms]

const makeEndpoint = (chain: ChainType): string => {
  switch (chain) {
    case 'rococo':
      return 'wss://rpc.dusty.plasmnet.io/';
    case 'kusama':
      return 'wss://rpc.shiden.plasmnet.io/';
    case 'polkadot':
      return 'wss://rpc.plasmnet.io/';
  }
};

const makePlasmTypes = (chain: ChainType): RegistryTypes => {
  return Object.values(plasmDefinitions).reduce((res, types): object => ({ ...res, ...types }), {});
  // switch (chain) {
  //   case 'rococo':
  //     return typeDefs.dustyDefinitions;
  //   case 'kusama':
  //     return typeDefs.plasmCollatorDefinitions;
  //   case 'polkadot':
  //     return typeDefs.plasmDefinitions;
  // }
};

export type VestingConfig = {
  preBlock: string;
  startingBlock: number;
};

export default class PlasmClient {
  private _provider: WsProvider;
  private _account: AddressOrPair;
  private _api: ApiPromise | undefined;
  private _chain: ChainType;

  constructor(chain: ChainType, account: AddressOrPair) {
    this._provider = new WsProvider(makeEndpoint(chain), AUTO_CONNECT_MS);
    this._account = account;
  }

  public async setup() {
    const types = makePlasmTypes(this._chain);
    this._api = await ApiPromise.create({
      provider: this._provider,
      types: {
        ...types,
        Address: 'GenericAddress',
        Keys: 'SessionKeys4',
      },
    });
    return this._api.isReady;
  }

  public batch(txs: SubmittableExtrinsic<'promise', ISubmittableResult>[]) {
    const ret = this._api?.tx.utility.batchAll(txs);
    if (ret) return ret;
    throw 'Undefined batch all';
  }

  public vestedTransfer(
    address: string,
    balance: BigNumber,
    vestingConfig: VestingConfig,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    const ret = this._api?.tx.vesting.vestedTransfer(address, {
      locked: balance,
      perBlock: vestingConfig.preBlock,
      startingBlock: vestingConfig.startingBlock,
    });
    if (ret) return ret;
    throw 'Undefined vested transfe';
  }

  public async signAndSend(tx: SubmittableExtrinsic<'promise', ISubmittableResult>) {
    return await tx.signAndSend(this._account);
  }
}
