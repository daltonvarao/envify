import appStateRepository from "../src/repositories/app-state.repository";
import appUrlRepository from "../src/repositories/app-urls.repository";
import appRepository from "../src/repositories/app.repository";

/**
 * @deprecated should be removed soon
 */
export async function migrateToApp() {
  const appState = await appStateRepository.findOne();

  if (appState.storedUrls?.length) {
    const app = await appRepository.create("app");

    for (const item of appState.storedUrls) {
      await appUrlRepository.create({
        appId: app.id,
        color: item.color,
        env: item.env,
        url: item.url,
      });
    }

    await appStateRepository.destroy();
  }
}
