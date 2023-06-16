import { v4 as uuid } from "uuid";
import { AppURL } from "../components/UrlForm";
import Storage from "./storage";

class AppUrlRepository {
  private storage = new Storage();

  async find(appId: string): Promise<AppURL[]> {
    const appUrls = await this.findAll();

    return appUrls.filter((item: AppURL) => item.appId === appId);
  }

  async findByUrl(url: string): Promise<AppURL | undefined> {
    const appUrls = await this.findAll();

    const appUrl = appUrls.find((item: AppURL) => url.includes(item.url));

    return appUrl;
  }

  async findById(id: string): Promise<AppURL | undefined> {
    const appUrls = await this.findAll();

    const appUrl = appUrls.find((item: AppURL) => id.includes(item.id));

    return appUrl;
  }

  async create(data: AppURL): Promise<AppURL> {
    const appUrls = await this.findAll();

    const app = {
      ...data,
      id: uuid(),
    };

    await this.storage.save({
      appUrls: [...appUrls, app] as AppURL[],
    });

    return app;
  }

  async update(data: AppURL): Promise<void> {
    const appUrls = await this.findAll();

    const appUrlIndex = appUrls.findIndex(
      (item: AppURL) => item.id === data.id
    );

    if (appUrlIndex < 0) return;

    appUrls[appUrlIndex] = {
      ...appUrls[appUrlIndex],
      ...data,
    };

    await this.storage.save({
      appUrls,
    });
  }

  async delete(id: string): Promise<void> {
    const appUrls = await this.findAll();

    await this.storage.save({
      appUrls: [...appUrls.filter((item: AppURL) => item.id !== id)],
    });
  }

  async deleteByAppId(appId: string): Promise<void> {
    const appUrls = await this.findAll();

    await this.storage.save({
      appUrls: [...appUrls.filter((item: AppURL) => item.appId !== appId)],
    });
  }

  async findAll(): Promise<AppURL[]> {
    const { appUrls } = (await this.storage.find({ appUrls: [] })) as {
      appUrls: AppURL[];
    };

    return appUrls;
  }
}

const appUrlRepository = new AppUrlRepository();

export default appUrlRepository;
