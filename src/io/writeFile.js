import * as fs from "fs";

const getCallback = (res, rej) => {
  return (err) => {
    if (err) rej({ message: "Error occured", error: err});
    res();
  };
};

export const writeFile = (file, content) => new Promise((res, rej) => {
  fs.writeFile(file, content, { flag: "w" }, getCallback(res, rej));
});