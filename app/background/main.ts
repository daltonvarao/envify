import { migrateToApp } from "./migrate-to-app";
import { createMarkupOnPage } from "./utils";

chrome.storage.local.onChanged.addListener(async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  if (tab?.id) {
    await createMarkupOnPage(tab.id);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  await createMarkupOnPage(tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId) => {
  await createMarkupOnPage(tabId);
});

chrome.runtime.onInstalled.addListener(async (info) => {
  switch (info.reason) {
    case chrome.runtime.OnInstalledReason.UPDATE:
      await migrateToApp();
  }
});
