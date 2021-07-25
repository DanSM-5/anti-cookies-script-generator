Anti-Cookies Script Generator
=======

This project generates scripts that are intended to be used in **Tampermonkey** to remove the cookies prompt on the specified website.

To generate a script this project uses the information from the array on `src/data/pagesInfo.js`. The data is an array of objects where each object target a specific website. Each object contain specific data about a website to be targeted by a script. There are some exaples populated on the array as example but none of those objects are requires. You can customize them or remove them as needed and only create the scripts that you require.

### Object format

Property | Type | Description | Default value
---------|------|-------------|--------------
NAME | `String` | Name of the script to be created. It will be appended as a postfix e.g. `anti-cookies-[custom name].js`| `"script"`
WEB_PAGE | `String` | This property will be used in the description of the script for Tampermonkey. It does not impact the script in any way | `"script"`
MATCH | `String` | The match will be used to match the specific web site where the script should run. This follows Tampermonkey's rules. Please refer to its documentation [here](https://www.tampermonkey.net/documentation.php#_match). | `"https://*"`
CICLES | `Number` | Number of cicles to run. Useful for pages that will add a cookies prompt more than once | `1` 
LOOP | `Boolean` | Flag to force an infinite number of cicles. **Use it with CAUTION**. | `false`
INCLUDES | `Array<String>` | Similar to `MATCH` this value helps to add pages where the script should run. Please check [here](https://www.tampermonkey.net/documentation.php#_include) for more information. | `[]`
MAX | `Number` | Max number of tries before the script stops. This is useful as many websites do not show a coockies prompt right away. Be mindful about how many retries you need. | `5`
RETRY_TIME | `Number` | Time in seconds between attempts. | `1`
TARGETS | `Array<String>` | CSS selectors that will be used to find the specific html element used for the cookie prompt to be removed. Each target will run independently of each other with and each one will keep track of its own number of attempts. | `[]`
PARENTS | `Array<String>` | CSS selectors for elements that need to be unblocked for navigation. Websites usualy set `overflow: hidden` on these elements to prevent the user from moving on their site. Elements on the parents array will be set to `overflow: auto` | ``[ `html`, `body` ]``

#### Example of object

```
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
```
// ==UserScript==
// @name         Anti-Cookies Google
// @version      0.1
// @description  Remove cookies prompt for google.com
// @author       ED
// @match        https://*.google.com/
// @include      *://*.google.com/*
// @grant        none
// ==/UserScript==

(() => {
  const name = "Google";
  const label = `Anti-Cookies ${name}`;
  
  const max = 5; // number of retries
  const retryTime = 1; // in seconds
  const cicles = 1;
  const initialDelay = 0;
  const loop = false;
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

  const restartCicle = (retryFunc, selector, cicle) => {
    if (shouldLoop() || cicle < cicles) {
      log(`Starting cicle ${cicle + 1} for [${selector}]`);
      retryFunc(0);
    }
  };

  const trackCicles = (retry, selector) => {
    let cicle = 0; // start from 0
    return _ => restartCicle(retry, selector, ++cicle);
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
```
The script is ready to be copied into Tampermonkey for use.