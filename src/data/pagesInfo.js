export default [{
  NAME: "Wiki",
  WEB_PAGE: "Wiki pages",
  MATCH: "https://*.fandom.com/wiki/",
  INCLUDES: [
    "// @include      /^https:\/\/*\.fandom\.com",
    "// @include      https://*.fandom.com",
    "// @include      *://*.fandom.com",
    "// @include      *://*.fandom.com/*",
  ],
  TARGETS: [
    `"div[data-tracking-opt-in-overlay]",`,
  ]
}, {
  NAME: "Google",
  WEB_PAGE: "google.com",
  MATCH: "https://*.google.com/",
  INCLUDES: [
    "// @include      *://*.google.com/*",
  ],
  TARGETS: [
    `"#lb",`,
    `".Fgvgjc",`,
    `"#Sx9Kwc",`,
    `"#xe7COe",`,
  ]
}, {
  NAME: "Mega",
  WEB_PAGE: "mega.nz",
  MATCH: "https://*.mega.nz/*",
  INCLUDES: [],
  TARGETS: [
    `".fm-dialog-overlay",`,
    `".mega-dialog.cookie-dialog",`,
  ]
}, {
  NAME: "StackOverflow",
  WEB_PAGE: "stackoverflow.com",
  MATCH: "https://*.stackoverflow.com/",
  INCLUDES: [
    "// @include      *://*.stackoverflow.com/*",
    "// @include      *://stackoverflow.com/*",
  ],
  TARGETS: [
    `"div.z-nav-fixed.ps-fixed",`,
  ]
}];