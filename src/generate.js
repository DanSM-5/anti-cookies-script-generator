import { getFileString } from "./io/readFile.js";
import { writeFile } from "./io/writeFile.js";
import pagesInfo from "./data/pagesInfo.js";

const path = "./dist";
const name = "anti-cookies";
const file = `./src/template/${name}.js`;
const encoding = "utf8";

const content = await getFileString(file, encoding);
const replaceText = (string, info) => 
  string.replaceAll("{{NAME}}", info.NAME)
        .replaceAll("{{WEB_PAGE}}", info.WEB_PAGE)
        .replaceAll("{{MATCH}}", info.MATCH)
        .replaceAll("//{{INCLUDES}}//", info.INCLUDES.join("\n"))
        .replaceAll("//{{TARGETS}}//", info.TARGETS.join("\n    "));

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