import { v4 as uuid } from "uuid";
import appUrlRepository from "./app-urls.repository";
import Storage from "./storage";

export type IApp = {
  id: string;
  name: string;
};

export class AppRepository {
  private readonly storage = new Storage();

  async create(name: string): Promise<IApp> {
    const apps = await this.find();
    const app = { name, id: uuid() };
    await this.storage.save({ apps: [...apps, app] });
    return app;
  }

  async find(): Promise<IApp[]> {
    const { apps } = await this.storage.find({ apps: [] });

    return apps;
  }

  async findOne(id: string): Promise<IApp | undefined> {
    const apps = await this.find();

    const app = apps.find((item) => item.id === id);

    return app;
  }

  async update(data: IApp): Promise<void> {
    const apps = await this.find();

    const appIndex = apps.findIndex((item: IApp) => item.id === data.id);

    if (appIndex < 0) return;

    apps[appIndex] = {
      ...apps[appIndex],
      ...data,
    };

    await this.storage.save({
      apps,
    });
  }

  async delete(id: string) {
    const apps = await this.find();

    await appUrlRepository.deleteByAppId(id);
    await this.storage.save({ apps: [...apps.filter((app) => app.id !== id)] });
  }
}

const appRepository = new AppRepository();

export default appRepository;
