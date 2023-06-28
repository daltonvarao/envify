import { v4 as uuid } from "uuid";
import Storage from "./storage";

export type AppState = {
  appState: {
    storedUrls: StoredUrl[];
  };
};

export type StoredUrl = {
  url: string;
  env: string;
  color: string;
  id: string;
};

class AppStateRepository {
  private readonly storage = new Storage();

  async findOne() {
    const { appState } = (await this.storage.find({
      appState: {},
    })) as AppState;

    return appState;
  }

  async destroy() {
    await this.storage.delete("appState");
  }

  /**
   * @deprecated only for test - should be removed soon
   */
  async mock() {
    const appState: AppState = {
      appState: {
        storedUrls: [
          {
            color: "#00daad",
            env: "dev",
            url: "http://localhost:3035",
            id: uuid(),
          },
          {
            color: "#0253ff",
            env: "dev",
            url: "http://localhost:3036",
            id: uuid(),
          },
        ],
      },
    };

    await this.storage.save(appState);
  }
}

const appStateRepository = new AppStateRepository();

/**
 * @deprecated only for recovery - should be removed on v0.5.0
 */
export default appStateRepository;
