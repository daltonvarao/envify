import { v4 as uuid } from "uuid";
import { AppURL } from "../components/UrlForm";
import { blobToBase64 } from "../utils/file";
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

  async fetchAndUpdateAppUrlFavicon(data: AppURL) {
    const faviconUrl = await this.getFaviconBase64(data.url);
    if (faviconUrl) {
      data.originalFaviconUrl = faviconUrl;
      await this.update(data);
    }
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

  private async getFaviconBase64(url: string) {
    const favIconUrl = await this.getUrlIconFromPage(url);

    if (!favIconUrl) return;

    const blob = await fetch(favIconUrl).then((res) => res.blob());
    return blobToBase64(blob);
  }

  private async getUrlIconFromPage(url: string) {
    try {
      const htmlData = await fetch(url).then((res) => res.text());

      const parser = new DOMParser();
      const html = parser.parseFromString(htmlData, "text/html");

      const link = html.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) return;

      const linkHref = link.href;

      if (linkHref.includes(location.origin)) {
        const [, relativeHref] = linkHref.split(location.origin);

        if (!relativeHref) return;

        const normalizedUrl = url.endsWith("/")
          ? url.slice(0, url.length - 1)
          : url;

        return normalizedUrl.concat(relativeHref);
      }

      return linkHref;
    } catch (error) {
      return;
    }
  }
}

const appUrlRepository = new AppUrlRepository();

export default appUrlRepository;
