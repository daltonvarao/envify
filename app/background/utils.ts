import { AppURL } from "../common/app-url.type";
import appUrlRepository from "../src/repositories/app-urls.repository";

export async function createMarkupOnPage(tabId: number) {
  const tab = await getTab(tabId);

  if (tab) {
    const appUrl = await getAppUrl(tab.url!);

    if (!appUrl) {
      await removeBadge(tabId);
      return removeMarkupFromPage(tabId);
    }

    await injectMarkuOnPage(tabId, appUrl);
    await setBadge(tabId, appUrl);
  }
}

async function setBadge(tabId: number, appUrl: AppURL) {
  await chrome.action.setBadgeText({
    text: appUrl.env,
    tabId,
  });
  await chrome.action.setBadgeBackgroundColor({ color: appUrl.color });
}

async function removeBadge(tabId: number) {
  await chrome.action.setBadgeText({
    text: "",
    tabId,
  });

  await chrome.action.setBadgeBackgroundColor({ color: "rgba(0,0,0,0)" });
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
