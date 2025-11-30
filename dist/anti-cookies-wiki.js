// ==UserScript==
// @name         Anti-Cookies Wiki
// @version      0.1
// @description  Remove cookies prompt for Wiki pages
// @author       YOU
// @match        https://*.fandom.com/wiki/
// @include      /^https://*.fandom.com
// @include      https://*.fandom.com
// @include      *://*.fandom.com
// @include      *://*.fandom.com/*
// @grant        none
// ==/UserScript==

// @ts-check

(() => {
  const name = "Wiki";
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
    "div[data-tracking-opt-in-overlay]"
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
