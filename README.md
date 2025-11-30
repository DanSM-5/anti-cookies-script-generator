Anti-Cookies Script Generator
=======

This project generates scripts that are intended to be used in [Tampermonkey](https://www.tampermonkey.net)/[Violent Monkey](https://violentmonkey.github.io/) to remove the cookies prompt on the specified websites.

To generate a script this project uses the data from [`src/data/pagesInfo.js`](./src/data/pagesInfo.js).
The data is an array of objects where each object targets a specific website.
Each object contain specific metadata about a website to allow for cookies
popup removal. There are some exaples populated in the array but none of
those objects are required.
You can customize them or remove them as needed and only create the scripts that you need.

### Object format

Property | Type | Description | Default value
---------|------|-------------|--------------
NAME | `string` | Name of the script to be created. It will be appended as a postfix e.g. `anti-cookies-[custom name].js`. | `"script"`
WEB_PAGE | `string` | This property will be used in the description of the script for Tampermonkey. It does not impact the script in any way. | `"script"`
MATCH | `string` | The match will be used to match the specific web site where the script should run. This follows Tampermonkey's rules. Please refer to its documentation [here](https://www.tampermonkey.net/documentation.php#_match). | `"https://*"`
CICLES | `number` | Number of cicles to run. Useful for pages that will add a cookies prompt more than once. | `1` 
LOOP | `Boolean` | Flag to force an infinite number of cicles. **Use it with CAUTION**. | `false`
AUTHOR | `string` | Name for author field. You can add your name here. | `ED`
INCLUDES | `Array<string>` | Similar to `MATCH` this value helps to add pages where the script should run. Please check [here](https://www.tampermonkey.net/documentation.php#_include) for more information. | `[]`
MAX | `number` | Max number of tries before the script stops. This is useful as many websites do not show a coockies prompt right away. Be mindful about how many retries you need. | `5`
RETRY_TIME | `number` | Time in seconds between attempts. | `1`
TARGETS | `Array<string>` | Each targer should be a valid CSS selector that will be used to find the specific html element used for the cookie prompt to be removed. Each target will run independently of each other and each one will keep track of its own number of retry attempts. There is an special **"parent"** selector helper by adding the number of levels up for the parent followed by the caret symbol `^` before the selector. E.g. `"1^#popup"` to select the parent of the element with id `"#popup"`. A target can also be a HTML element like `document.body`. To do that you need to append `[JS]` before the element. E.g. `"[JS]document.body"`. | `[]`
PARENTS | `Array<string>` | Each element of the PARENTS array should be a valid CSS selector. These elements need to be unblocked for navigation (usually the body or html element). Websites may set `overflow: hidden` on these elements to prevent the user from navigating on their site. Elements on the parents array will be set to `overflow: auto`. You can target the parent element of a CSS selector by adding the number of levels up for the parent followed by the caret symbol `^` before the selector. E.g. `"1^#popup"` to select the parent of the element with id `"#popup"`. A target can also be a HTML element like `document.body`. To do that you need to append `[JS]` before the element. E.g. `"[JS]document.body"`. | ``[ `html`, `body` ]``
INITIAL_DELAY | `number` | Delay in seconds to start the script. Useful when cookies popups appear after some delay. | `0`

#### Example of object

```javascript
{
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
}
```

#### Script generated
The above object will produce the following script with the name `anti-cookies-google.js` under the `dist` folder.

```javascript
// ==UserScript==
// @name         Anti-Cookies Google
// @version      0.1
// @description  Remove cookies prompt for google.com
// @author       YOU
// @match        https://*.google.com/
// @include      *://*.google.com/*
// @grant        none
// ==/UserScript==

// @ts-check

(() => {
  const name = "Google";
  const label = `Anti-Cookies ${name}`;

  /** @ts-ignore It will be replaced by and actual number */
  const max = /** @type {number} */(5); // number of retries
  /** @ts-ignore It will be replaced by and actual number */
  const retryTime = /** @type {number} */ (1); // in seconds
  /** @ts-ignore It will be replaced by and actual number */
  const cicles = /** @type {number} */ (1);
  /** @ts-ignore It will be replaced by and actual number */
  const initialDelay = /** @type {number} */ (0);
  /** @ts-ignore It will be replaced by and actual number */
  const loop = /** @type {boolean} */(false);
  /** @type {(string|Element)[]} */
  const targets = [
    // Add here the css selectors of the elements to remove
    "#lb",
    ".Fgvgjc",
    "#Sx9Kwc",
    "#xe7COe"
  ];
  const parentElements = [
    // add here other elements that may need to be unblocked
    // string or element
    "html",
    "body"
  ];

  /**
   * @param {(...data: any[]) => void} logLvlFunc Function from `console` global (log, warn, error, info, debug)
   * @returns {(msg: string) => void} Log function for level
   */
  const getLogger = logLvlFunc => msg => logLvlFunc(`${label}: ${msg}`);
  const log = getLogger(console.log);
  const warn = getLogger(console.warn);
  const error = getLogger(console.error);
  log(`Running`);

  /**
   * @param {number} level Number of levels to find parent
   * @param {string} selector Element to get parent of
   */
  const getParentAt = (level, selector) => {
    try {
      let el = /** @type {HTMLElement|null|undefined} */(document.querySelector(selector) ?? null);
      if (el) {
        for (let i = 0; i < level; i++) {
          el = el?.parentElement;
        }
      }
      return el;
    } catch (error) {
      return null;
    }
  };

  // const isSelectingParent = item => item.includes("^");
  const isParentRegex = /^[0-9]+\^/
  /**
   * @param {string} item item to test
   * @returns {boolean} if selector is a parent selector
   */
  const isSelectingParent = item => isParentRegex.test(item)

  /**
   * @param {string} item item to find element
   * @returns {Element|null|undefined} Element if found
   */
  const getFromString = item => {
    if (isSelectingParent(item)) {
      const [ parentLevel, selector ] = item.split("^");
      return getParentAt(parseInt(parentLevel, 10), selector);
    }
    return document.querySelector(item);
  };

  /**
   * @param {string|Element} el element to find real HTML element
   * @returns {Element|null} Element if found
   */
  const getElement = el => typeof el === "string"
    ? getFromString(el) ?? null
    : el;

  /**
   * @param {Element} element element to find real HTML element
   */
  const setOverflowAuto = element => /** @type {HTMLElement} */(element).style.overflow = "auto";

  /**
   * Unblock parts that get overflow removed. Often times websites
   * sets overflow to `hiden` to prevent you from scrolling until
   * you accept the cookies. F*ck them!
   * @param {string|Element} el element to unblock
   */
  const unblockElement = el => {
    const element = getElement(el);
    if (element) {
      setOverflowAuto(element);
    }
  };

  /**
   * @param {Element} overlay element to remove
   */
  const safeRemove = overlay => {
    try {
      /** @type {HTMLElement} */(overlay).parentElement?.removeChild(overlay);
    } catch (e) {
      error("Unexpected error trying to remove element. Will be marked as completed.");
      console.error(e);
    }
  };

  /**
   * Attemps to remove the target element by selector
   * @param {string|Element} selector Element to remove
   * @returns {boolean} Whether element for selector was found
   */
  const removeElement = selector => {
    const overlay = getElement(selector);
    if (!overlay) return false;
    safeRemove(overlay);
    return true;
  };

  /**
   * @param {(count: number) => void} remove Remove function
   * @param {() => void} onFail On fail callback
   * @param {number} [count=0] Retry number
   */
  const tryRemove = (remove, onFail, count = 0) => {
    if (count > max) {
      onFail();
      return;
    }
    remove(count);
  };

  /**
   * @param {string|Element} selector Target element to log
   */
  const failMessage = selector => log(`Not found [${selector}]`);

  /** Helper to log when using `LOOP` value */
  const shouldLoop = () => {
    if (loop) {
      warn("Looping is active");
    }
    return loop;
  };

  /**
   * @param {(count: number) => void} retryFunc
   * @param {string|Element} selector target element
   * @param {number} cicle number of retries
   */
  const restartCicle = (retryFunc, selector, cicle) => {
    if (shouldLoop() || cicle < cicles) {
      log(`Starting cicle ${cicle + 1} for [${selector}]`);
      retryFunc(0);
    }
  };

  /**
   * @param {(count: number) => void} retry Retry function
   * @param {string|Element} selector Target selector
   */
  const trackCicles = (retry, selector) => {
    let cicle = 0; // start from 0
    return () => restartCicle(retry, selector, ++cicle);
  };

  /**
   * @param {string|Element} selector target element to build function for
   * @returns {[(count: number) => void, () => void]} Functions to remove target selector
   */
  const getFunctionsForSelector = selector => {
    const onFail = () => {
      failMessage(selector);
      restartCicleIfNeeded();
    };
    /** @param {number} count */
    const remove = count => {
      const success = removeElement(selector);
      if (success) {
        parentElements.forEach(unblockElement);
        log(`Target [${selector}] was removed`);
        restartCicleIfNeeded();
      } else {
        retry(count + 1);
      }
    };
    /** @param {number} count */
    const retry = count => window.setTimeout(() =>
      tryRemove(remove, onFail, count), retryTime * 1000);
    const restartCicleIfNeeded = trackCicles(retry, selector);

    return [ remove, onFail ];
  };

  /**
   * @param {string|Element} selector target element to remove
   */
  const processTarget = selector => {
    log(`Trying to remove [${selector}]`);
    const [ remove, onFail ] = getFunctionsForSelector(selector);
    tryRemove(remove, onFail, 0);
  };

  const initRemoveProcess = () => {
    setTimeout(() =>
      targets.forEach(processTarget),
      initialDelay * 1000
    );
  };

  if (loop) {
    warn("Loop is active, be careful!");
  }

  initRemoveProcess();
  log(`Ending ${label}`);
})();
```

The script is ready to be copied into Tampermonkey/Violent Monkey for use.
