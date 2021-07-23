import { getFileString } from "./io/readFile.js";
import { writeFile } from "./io/writeFile.js";
import pagesInfo from "./data/pagesInfo.js";
import defaultInfo from "./data/defaultInfo.js";

const path = "./dist";
const name = "anti-cookies";
const file = `./src/template/${name}.js`;
const encoding = "utf8";

const getReplacement = (info, key) => info?.[key] ?? defaultInfo[key];

const content = await getFileString(file, encoding);

const replaceText = (string, info) => {
  const get = key => getReplacement(info, key);
  return string
    .replaceAll("{{NAME}}", get("NAME"))
    .replaceAll("{{WEB_PAGE}}", get("WEB_PAGE"))
    .replaceAll("{{MATCH}}", get("MATCH"))
    .replaceAll(`"{{MAX}}"`, get("MAX"))
    .replaceAll(`"{{RETRY_TIME}}"`, get("RETRY_TIME"))
    .replaceAll("//{{INCLUDES}}//", get("INCLUDES").join("\n"))
    .replaceAll("//{{PARENTS}}//", get("PARENTS").join("\n    "))
    .replaceAll("//{{TARGETS}}//", get("TARGETS").join("\n    "));
};

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