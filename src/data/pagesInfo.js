// @ts-check

/**
 * @typedef {{ NAME?: string; WEB_PAGE?: string; MATCH?: string; INCLUDES?: string[]; TARGETS?: string[]; CICLES?: number; LOOP?: boolean; AUTHOR?: string; PARENTS?: string[]; MAX?: number; RETRY_TIME?: number; }} InfoPage
 */

/**
 * @type InfoPage[]
 */
const infoPages = [{
  NAME: "Wiki",
  WEB_PAGE: "Wiki pages",
  MATCH: "https://*.fandom.com/wiki/",
  INCLUDES: [
    "/^https:\/\/*\.fandom\.com",
    "https://*.fandom.com",
    "*://*.fandom.com",
    "*://*.fandom.com/*",
  ],
  TARGETS: [
    `div[data-tracking-opt-in-overlay]`,
  ],
}, {
  NAME: "Google",
  WEB_PAGE: "google.com",
  MATCH: "https://*.google.com/",
  INCLUDES: [
    "*://*.google.com/*",
  ],
  TARGETS: [
    `#lb`,
    `.Fgvgjc`,
    `#Sx9Kwc`,
    `#xe7COe`,
  ],
}, {
  NAME: "Mega",
  WEB_PAGE: "mega.nz",
  MATCH: "https://*.mega.nz/*",
  TARGETS: [
    `.fm-dialog-overlay`,
    `.mega-dialog.cookie-dialog`,
  ],
}, {
  NAME: "StackOverflow",
  WEB_PAGE: "stackoverflow.com",
  MATCH: "https://*.stackoverflow.com/",
  INCLUDES: [
    "*://*.stackoverflow.com/*",
    "*://stackoverflow.com/*",
  ],
  TARGETS: [
    `div.z-nav-fixed.ps-fixed`,
  ],
}, {
  NAME: "Reddit",
  WEB_PAGE: "reddit.com",
  MATCH: "https://*.reddit.com/",
  INCLUDES: [
    "*://*.reddit.com/*",
    "*://*.reddit.com/r/*",
  ],
  TARGETS: [
    `1^#POPUP_CONTAINER`,
    `1^._3q-XSJ2vokDQrvdG6mR__k`,
  ],
  PARENTS: [
    `html`, // css selector
    `[JS]document.body`, // element
  ],
  CICLES: 2,
  INITIAL_DELAY: 3,
},
{
  NAME: "xda-devs",
  MATCH: "*://*.xda-developers.com/",
  INCLUDES: [
    "*://*.xda-developers.com/*"
  ],
  TARGETS: [".qc-cmp-cleanslate.css-3n9te7"],
},
{
  NAME: "youtube",
  MATCH: "*://*.youtube.com/",
  INCLUDES: [
    "*://*.youtube.com/*"
  ],
  TARGETS: ["#lightbox #dialog", 'tp-yt-iron-overlay-backdrop'],
},
{
  NAME: "twitter",
  MATCH: "*://*.twitter.com/*",
  INCLUDES: [
    "*://*.twitter.com/*"
  ],
  TARGETS: ["#layers"],
}];

export default infoPages;
