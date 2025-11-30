// @ts-check

/**
 * @typedef {{ NAME: string; WEB_PAGE: string; MATCH: string; INCLUDES: string[]; TARGETS: string[]; CICLES: number; LOOP: boolean; AUTHOR: string; PARENTS: string[]; MAX: number; RETRY_TIME: number; INITIAL_DELAY: number }} InfoPage
 */

import { getFileString } from "./io/readFile.js";
import { writeFile } from "./io/writeFile.js";
import pagesInfo from "./data/pagesInfo.js";
import defaultInfo from "./data/defaultInfo.js";

const path = "./dist";
const name = "anti-cookies";
const file = `./src/template/${name}.js`;
const encoding = "utf8";
const jsFlag = "[JS]";

/* File process and replacement */
/** @param {string} item Item to test */
const isElement = item => item.startsWith(jsFlag);
/** @param {string} item Item to remove js flag */
const removeJSFlag = item => item.substring(jsFlag.length);
/** @param {string} item Item use to create a @include directive */
const appendInclude = item => `// @include      ${item}`;
/** @param {string} item Replacement item */
const wrap = item => `\"${item}\"`;
/** @param {string} i item */
const parseItem = i => isElement(i) ? removeJSFlag(i) : wrap(i);
/**
 * @template {keyof InfoPage} T
 * @param {InfoPage} info info object
 * @param {T} key key of the info object
 * @returns {InfoPage[T]}
 */
const getReplacement = (info, key) => info?.[key] ?? defaultInfo[key];
/**
 * @param {InfoPage} obj Info object
 * @returns {(key: (keyof InfoPage)) => InfoPage[key]}
 */
const getFunc = obj => key => getReplacement(obj, key);
/**
 * @param {(key:'INCLUDES') => InfoPage['INCLUDES']} func function
 * @returns {(key:'INCLUDES') => string} Replacement string for @include
 */
const processIncludesFunc = func => key => func(key).map(appendInclude).join("\n");
/**
 * @param {(key:'TARGETS'|'PARENTS') => InfoPage['TARGETS'|'PARENTS']} func function
 * @returns {(key:'TARGETS'|'PARENTS') => string} Replacement string for @include
 */
const getElementsFunc = func => key => func(key).map(parseItem).join(",\n    ");
/**
 * @param {[key: string, target: string, function: string][]} configArr Configuration array
 * @returns {(string: string, info: InfoPage) => string}
 */
const getTextReplacer = configArr => (string, info) => {
  const get = getFunc(info);
  // @ts-expect-error only 'PARENTS' and 'TARGETS' keys will use this function
  const getElements = getElementsFunc(get);
  // @ts-expect-error only 'INCLUDES' will use this function
  const processIncludes = processIncludesFunc(get);
  const handlers = { get, getElements, processIncludes };
  return configArr.reduce((txt, config) => {
    const [ key, target, func ] = config;
    return txt.replaceAll(target, handlers[func](key));
  }, string);
};

const replaceText = getTextReplacer([
  /* key | target | handler func */
  [ "NAME", "{{NAME}}", "get" ],
  [ "WEB_PAGE", "{{WEB_PAGE}}", "get" ],
  [ "MATCH", "{{MATCH}}", "get" ],
  [ "AUTHOR", "{{AUTHOR}}", "get" ],
  [ "MAX", `"{{MAX}}"`, "get" ],
  [ "CICLES", `"{{CICLES}}"`, "get" ],
  [ "INITIAL_DELAY", `"{{INITIAL_DELAY}}"`, "get" ],
  [ "RETRY_TIME", `"{{RETRY_TIME}}"`, "get" ],
  [ "LOOP", `"{{LOOP}}"`, "get" ],
  [ "INCLUDES", "//{{INCLUDES}}//", "processIncludes" ],
  [ "PARENTS", "//{{PARENTS}}//", "getElements" ],
  [ "TARGETS", "//{{TARGETS}}//", "getElements" ],
]);

const content = await getFileString(file, encoding);

/** @param {InfoPage} info object */
const processFile = info => {
  return new Promise((res, rej) => {
    try {
      const fileInfo = [
        getReplacement(info, "NAME").toLowerCase(),
        replaceText(content, info)
      ];
      res(fileInfo);
    } catch (error) {
      rej(error);
    }
  });
};

const write = ([fileName, content]) => 
  writeFile(`${path}/${name}-${fileName}.js`, content);

await Promise.all(pagesInfo.map(processFile))
  .then(fileInfo => Promise.all(fileInfo.map(write)))
  .then(_ => console.log("Success!"))
  .catch(err => console.error(err));
