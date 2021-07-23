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
const replaceText = (string, info) => 
  string.replaceAll("{{NAME}}", getReplacement(info, "NAME"))
        .replaceAll("{{WEB_PAGE}}", getReplacement(info, "WEB_PAGE"))
        .replaceAll("{{MATCH}}", getReplacement(info, "MATCH"))
        .replaceAll(`"{{MAX}}"`, getReplacement(info, "MAX"))
        .replaceAll(`"{{RETRY_TIME}}"`, getReplacement(info, "RETRY_TIME"))
        .replaceAll("//{{INCLUDES}}//", getReplacement(info, "INCLUDES").join("\n"))
        .replaceAll("//{{PARENTS}}//", getReplacement(info, "PARENTS").join("\n    "))
        .replaceAll("//{{TARGETS}}//", getReplacement(info, "TARGETS").join("\n    "));

const processFile = info => {
  return [info.NAME.toLowerCase(), replaceText(content, info)];
};

const write = ([fileName, content]) => 
  writeFile(`${path}/${name}-${fileName}.js`, content);

await Promise.all(
  pagesInfo
    .map(processFile)
    .map(write)
);

console.log("Success!");