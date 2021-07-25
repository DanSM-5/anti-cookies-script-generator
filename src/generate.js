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
const replaceText = (string, info) => {
  const get = getFunc(info);
  const getElements = getElementsFunc(get);
  const processIncludes = processIncludesFunc(get);
  return string
    .replaceAll("{{NAME}}", get("NAME"))
    .replaceAll("{{WEB_PAGE}}", get("WEB_PAGE"))
    .replaceAll("{{MATCH}}", get("MATCH"))
    .replaceAll(`"{{MAX}}"`, get("MAX"))
    .replaceAll(`"{{CICLES}}"`, get("CICLES"))
    .replaceAll(`"{{INITIAL_DELAY}}"`, get("INITIAL_DELAY"))
    .replaceAll(`"{{RETRY_TIME}}"`, get("RETRY_TIME"))
    .replaceAll(`"{{LOOP}}"`, get("LOOP"))
    .replaceAll("//{{INCLUDES}}//", processIncludes("INCLUDES"))
    .replaceAll("//{{PARENTS}}//", getElements("PARENTS"))
    .replaceAll("//{{TARGETS}}//", getElements("TARGETS"));
};

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