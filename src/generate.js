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
const isElement = item => !!~item.indexOf(jsFlag);
const removeFlag = item => item.substr(jsFlag.length);
const appendInclude = item => `// @include      ${item}`;
const wrap = item => `\"${item}\"`;
const shouldWrap = i => isElement(i) ? removeFlag(i) : wrap(i);
const getReplacement = (info, key) => info?.[key] ?? defaultInfo[key];
const getFunc = obj => key => getReplacement(obj, key);
const processIncludesFunc = func => key => func(key).map(appendInclude).join("\n");
const getElementsFunc = func => key => func(key).map(shouldWrap).join(",\n    ");
const getTextReplacer = configArr => (string, info) => {
  const get = getFunc(info);
  const getElements = getElementsFunc(get);
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

const processFile = info => {
  return [
    getReplacement(info, "NAME").toLowerCase(),
    replaceText(content, info)
  ];
};

const write = ([fileName, content]) => 
  writeFile(`${path}/${name}-${fileName}.js`, content);

await Promise.all(
  pagesInfo
    .map(processFile)
    .map(write)
);

console.log("Success!");