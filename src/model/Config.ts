import fs from 'fs';

const PATH: fs.PathLike = 'config/config.json';

export class Config {
  private static instance: Config;

  public phrase: string;
  private constructor() {
    const jsonObj = JSON.parse(fs.readFileSync(PATH).toString());
    this.phrase = jsonObj['phrase'];
  }

  static get(): Config {
    if (!Config.instance) Config.instance = new Config();
    return Config.instance;
  }
}
