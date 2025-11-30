
/**
 * @type {{ NAME: string; WEB_PAGE: string; MATCH: string; INCLUDES: string[]; TARGETS: string[]; CICLES: number; LOOP: boolean; AUTHOR: string; PARENTS: string[]; MAX: number; RETRY_TIME: number; }} InfoPage
 */
export default {
  NAME: "script",
  WEB_PAGE: "script",
  MATCH: "https://*",
  MAX: 5,
  RETRY_TIME: 1,
  CICLES: 1,
  INCLUDES: [],
  TARGETS: [],
  PARENTS: [
    `html`,
    `body`,
  ],
  INITIAL_DELAY: 0,
  LOOP: false,
  AUTHOR: "YOU"
}
