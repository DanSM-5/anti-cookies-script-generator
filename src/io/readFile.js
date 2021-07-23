import * as fs from "fs";

const getCallback = (res, rej) => {
  return (err, file) => {
    if (err) rej({ message: "Error occured", error: err});
    res(file);
  };
};

export const getFileString = (file, encoding) => new Promise((res, rej) => {
  fs.readFile(file, encoding, getCallback(res, rej));
});