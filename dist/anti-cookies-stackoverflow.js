// ==UserScript==
// @name         Anti-Cookies StackOverflow
// @version      0.1
// @description  Remove cookies prompt for stackoverflow.com
// @author       ED
// @match        https://*.stackoverflow.com/
// @include      *://*.stackoverflow.com/*
// @include      *://stackoverflow.com/*
// @grant        none
// ==/UserScript==

(() => {
  const name = "StackOverflow";
  const label = `Anti-Cookies ${name}`;
  
  const max = 5; // number of retries
  const retryTime = 1; // in seconds
  const cicles = 1;
  const initialDelay = 0;
  const loop = false;
  const targets = [
    // Add here the css selectors of the elements to remove
    "div.z-nav-fixed.ps-fixed"
  ];
  const parentElements = [
    // add here other elements that may need to be unblocked
    // string or element
    "html",
    "body"
  ];
  
  const getLogger = logLvlFunc => msg => logLvlFunc(`${label}: ${msg}`);
  const log = getLogger(console.log);
  const warn = getLogger(console.warn);
  log(`Running`);

  const getElement = el => typeof el === "string"
    ? document.querySelector(el) ?? null
    : el;

  const setOverflowAuto = element => element.style.overflow = "auto";

  const unblockElement = el => {
    const element = getElement(el);

    if (element) {
      setOverflowAuto(element);
    }
  };

  const removeElement = selector => {
    const overlay = getElement(selector);
    if (!overlay) return false;
    overlay.parentElement.removeChild(overlay);
    return true;
  };

  const tryRemove = (remove, onFail, count = 0) => {
    if (count > max) {
      onFail();
      return;
    }
    remove(count);
  };

  const failMessage = selector => log(`Not found [${selector}]`);

  const shouldLoop = () => {
    if (loop) {
      warn("Looping is active");
      return true;
    }
    return false;
  };

  const restartCicle = (retryFunc, selector) => cicle => {
    if (shouldLoop() || cicle < cicles) {
      log(`Starting cicle ${cicle + 1} for [${selector}]`);
      retryFunc(0);
    }
  };

  const trackCicles = (retry, selector) => {
    let ci = 0;
    return _ => restartCicle(retry, selector)(++ci);
  };

  const getFunctionsForSelector = selector => {
    const onFail = () => {
      failMessage(selector);
      restartCicleIfNeeded();
    };
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
    const retry = count => setTimeout(() => 
      tryRemove(remove, onFail, count), retryTime * 1000);
    const restartCicleIfNeeded = trackCicles(retry, selector);

    return [ remove, onFail ];
  };

  const processTarget = selector => {
    log(`Trying to remove [${selector}]`);
    const [ remove, onFail ] = getFunctionsForSelector(selector);
    tryRemove(remove, onFail, 0);
  };

  const initRemoveProcess = () => {
    setTimeout(_ => 
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