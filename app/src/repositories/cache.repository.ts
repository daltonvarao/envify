import Storage from "./storage";

export class CacheRepository {
  private readonly storage = new Storage();

  async create(key: string): Promise<void> {
    const keys = await this.find();
    this.storage.save({ keys: [...keys, key] });
  }

  async find(): Promise<string[]> {
    const { keys } = await this.storage.find({ keys: [] });

    return keys;
  }

  async findOne(key: string): Promise<string | undefined> {
    const apps = await this.find();

    const app = apps.find((item) => item === key);

    return app;
  }

  async delete(key: string) {
    const apps = await this.find();

    await this.storage.save({ apps: [...apps.filter((item) => item !== key)] });
  }
}

const cacheRepository = new CacheRepository();

export default cacheRepository;
