export default [{
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
    `#POPUP_CONTAINER + div`,
    `#POPUP_CONTAINER`,
  ],
  PARENTS: [
    `html`, // css selector
    `[JS]document.body`, // element
  ],
  CICLES: 2,
  INITIAL_DELAY: 3,
}];