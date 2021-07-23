export default [{
  NAME: "Wiki",
  WEB_PAGE: "Wiki pages",
  MATCH: "https://*.fandom.com/wiki/",
  MAX: 5,
  RETRY_TIME: 1,
  INCLUDES: [
    "// @include      /^https:\/\/*\.fandom\.com",
    "// @include      https://*.fandom.com",
    "// @include      *://*.fandom.com",
    "// @include      *://*.fandom.com/*",
  ],
  TARGETS: [
    `"div[data-tracking-opt-in-overlay]"`,
  ],
  PARENTS: [
    `document.documentElement`,
    `document.body`,
  ],
}, {
  NAME: "Google",
  WEB_PAGE: "google.com",
  MATCH: "https://*.google.com/",
  MAX: 5,
  RETRY_TIME: 1,
  INCLUDES: [
    "// @include      *://*.google.com/*",
  ],
  TARGETS: [
    `"#lb"`,
    `".Fgvgjc"`,
    `"#Sx9Kwc"`,
    `"#xe7COe"`,
  ],
  PARENTS: [
    `document.documentElement`,
    `document.body`,
  ],
}, {
  NAME: "Mega",
  WEB_PAGE: "mega.nz",
  MATCH: "https://*.mega.nz/*",
  MAX: 5,
  RETRY_TIME: 1,
  INCLUDES: [],
  TARGETS: [
    `".fm-dialog-overlay"`,
    `".mega-dialog.cookie-dialog"`,
  ],
  PARENTS: [
    `document.documentElement`,
    `document.body`,
  ],
}, {
  NAME: "StackOverflow",
  WEB_PAGE: "stackoverflow.com",
  MATCH: "https://*.stackoverflow.com/",
  MAX: 5,
  RETRY_TIME: 1,
  INCLUDES: [
    "// @include      *://*.stackoverflow.com/*",
    "// @include      *://stackoverflow.com/*",
  ],
  TARGETS: [
    `"div.z-nav-fixed.ps-fixed"`,
  ],
  PARENTS: [
    `document.documentElement`,
    `document.body`,
  ],
}];