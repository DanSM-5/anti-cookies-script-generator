// ==UserScript==
// @name         Anti-Cookies {{NAME}}
// @version      0.1
// @description  Remove cookies prompt for {{WEB_PAGE}}
// @author       ED
// @match        {{MATCH}}
//{{INCLUDES}}//
// @grant        none
// ==/UserScript==

(() => {
  const name = "{{NAME}}";
  const label = `Anti-Cookies ${name}`;
  console.log(`Running ${label}`);

  const max = 5; // number of retries
  const retryTime = 1; // in seconds
  const targets = [
    // Add here the css selectors of the elements to remove
    //{{TARGETS}}//
  ];

  const parentElements = [
    // add here other elements that may need to be unblocked
    // string or element
    document.documentElement,
    document.body,
  ];

  const setOverflowAuto = element => element.style.overflow = "auto";

  const unblockElement = el => {
    const element = typeof el === "string"
      ? document.querySelector(el) ?? null
      : el;

    if (element) {
      setOverflowAuto(element);
    }
  };

  const removeElement = selector => {
    const overlay = document.querySelector(selector);
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

  const onFailGenerator = selector => () => console.log(`Not found ${selector}`);

  const processTarget = selector => {
    console.log(`Trying to remove ${selector}`);
    const onFail = onFailGenerator(selector);
    const remove = count => {
      const success = removeElement(selector);
      if (success) {
        parentElements.forEach(unblockElement);
        console.log(`Target ${selector} was removed`);
      } else {
        setTimeout(() => tryRemove(remove, onFail, count + 1), retryTime * 1000);
      }
    };
    tryRemove(remove, onFail, 0);
  };

  const initRemoveProcess = () => {
    targets.forEach(processTarget);
  };

  initRemoveProcess();
  console.log(`Ending ${label}`);
})();