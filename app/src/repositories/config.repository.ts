import Storage from "./storage";

export type Config = {
  dontShowOnboard: boolean;
};

export class ConfigRepository {
  private readonly storage = new Storage();

  async create(config: Config): Promise<void> {
    await this.storage.save({ config });
  }

  async find(): Promise<Config> {
    const { config } = await this.storage.find({ config: {} });

    return config;
  }

  async update(config: Config): Promise<void> {
    await this.storage.save({
      config,
    });
  }
}

const configRepository = new ConfigRepository();

export default configRepository;
