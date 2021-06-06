import fs from 'fs';
import { ChainType } from './ChainType';
import config from '../../config/config.json';
const PATH = 'config/config.json';

export class Config {
  private static instance: Config;
  public static chainType: ChainType = 'rococo';

  public phrase: string;
  public auctionJSONPath: string;
  public crowdloanJSONPath: string;
  public rewardsJSONPath: string;
  private constructor() {
    const jsonObj = JSON.parse(fs.readFileSync(PATH).toString());

    for (const key of Object.keys(this)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (this.hasOwnProperty(key) && typeof (this as any)[key] === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[key] = jsonObj[Config.chainType][key];
      }
    }
  }

  static setChain(chain: ChainType) {
    if (Config.chainType !== chain) {
      Config.chainType = chain;
      Config.instance = new Config();
    }
  }

  static get(): Config {
    if (!Config.instance) Config.instance = new Config();
    return Config.instance;
  }
}
