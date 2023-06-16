import { AppURL } from "../src/components/UrlForm";
import appUrlRepository from "../src/repositories/app-urls.repository";

export async function createMarkupOnPage(tabId: number) {
  const tab = await getTab(tabId);

  if (tab) {
    const appUrl = await getAppUrl(tab.url!);

    if (!appUrl) {
      return removeMarkupFromPage(tabId);
    }

    await injectMarkuOnPage(tabId, appUrl);
    await setBadge(tabId, appUrl);

    if (appUrl.faviconUrl) {
      await changeFavicon(tabId, appUrl.faviconUrl);
    } else {
      await changeFavicon(tabId, appUrl.originalFaviconUrl);
    }
  }
}

function setFaviconOnPage(faviconUrl: string) {
  const favs = Array.from(
    document.querySelectorAll('link[rel="icon"]')
  ) as HTMLLinkElement[];

  if (favs.length) {
    favs.forEach((fav) => {
      const favicon = document.createElement("link");
      if (!faviconUrl) return;

      favicon.rel = "icon";
      favicon.href = faviconUrl;

      document.head.replaceChild(favicon, fav);
    });
  }
}

async function changeFavicon(tabId: number, faviconUrl: string) {
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: setFaviconOnPage,
    args: [faviconUrl],
  });
}

async function setBadge(tabId: number, appUrl: AppURL) {
  await chrome.action.setBadgeText({
    text: appUrl.env,
    tabId,
  });
  await chrome.action.setBadgeBackgroundColor({ color: appUrl.color });
}

async function injectMarkuOnPage(tabId: number, appUrl: AppURL) {
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: createMarkup,
    args: [appUrl],
  });
}

function createMarkup(appUrl: AppURL) {
  const element = document.createElement("div");

  element.id = "envify-markup";
  element.innerHTML = appUrl.env;
  element.style.background = appUrl.color.slice(0, 7) + "CC";

  const elementExists = document.getElementById("envify-markup");

  if (elementExists) {
    return document.body.replaceChild(element, elementExists);
  }

  document.body.appendChild(element);
}

async function removeMarkupFromPage(tabId: number) {
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: removeMarkup,
  });
}

function removeMarkup() {
  const elementExists = document.getElementById("envify-markup");

  if (elementExists) {
    document.body.removeChild(elementExists);
  }
}

function canAct(url: string): boolean {
  const allowedHostsPatterns = ["https://*/*", "http://*/*"];

  return allowedHostsPatterns.some((hostPattern) =>
    url.match(new RegExp(hostPattern))
  );
}

async function getTab(tabId: number) {
  const tab = await chrome.tabs.get(tabId);

  if (
    tab &&
    tab.url &&
    tab.active &&
    tab.status === "complete" &&
    canAct(tab.url!)
  ) {
    return tab;
  }
}

async function getAppUrl(url: string) {
  return appUrlRepository.findByUrl(url);
}
