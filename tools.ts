import fse from "fs-extra";
const { stat, statSync } = fse;
import p from "path";
import { fileURLToPath } from "url";

export const paddingZeros = (number: number, length: number) =>
  `${number < 10 ** (length - 1) ? 0 : ""}${number}`;

export const padding = (
  string: string,
  length: number,
  alignment: "center" | "left" | "right" = "left"
) => {
  if (alignment === "center")
    return (
      " ".repeat(Math.ceil((length - string.length) / 2)) +
      string +
      " ".repeat(Math.floor((length - string.length) / 2))
    );
  else if (alignment === "left")
    return string + " ".repeat(length - string.length);
  else if (alignment === "right")
    return " ".repeat(length - string.length) + string;
};

export const fileExists = (path: string) => {
  try {
    return statSync(path).isFile();
  } catch (e) {
    return false;
  }
};
export const dirExists = (path: string) => {
  try {
    return statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
};
export const fileExistsAsync = (path: string) =>
  stat(path)
    .then(r => r.isFile())
    .catch(() => false);
export const dirExistsAsync = (path: string) =>
  stat(path)
    .then(r => r.isDirectory())
    .catch(() => false);

interface CompareObjectsSettings {
  arrayStrict?: boolean;
  deep?: boolean;
  missing?: "none" | "one-direction" | "both-directions";
}
export function compare(
  fullObj: Record<any, any>,
  partialObj: Record<any, any>,
  {
    arrayStrict = true,
    deep = true,
    missing = "one-direction"
  }: CompareObjectsSettings = {
    arrayStrict: true,
    deep: true,
    missing: "one-direction"
  }
): boolean {
  const fullE = Object.entries(fullObj);
  const partialE = Object.entries(partialObj);

  if (
    (missing === "one-direction" &&
      partialE.some(e => !fullE.map(f => f[0]).includes(e[0]))) ||
    (missing === "both-directions" && fullE.length !== partialE.length)
  )
    return false;

  return fullE.every(([key, value1]) => {
    if (missing && !(key in partialObj)) return true;
    const value2 = partialObj[key];

    if (typeof value1 !== typeof value2) return false;

    if (typeof value1 === "object") {
      if (Array.isArray(value1)) {
        if (arrayStrict)
          return value1.length !== value2.length
            ? false
            : value1.every(e => value2.includes(e));
        else return value1.some(e => value2.includes(e));
      } else return deep ? compare(value1, value2) : value1 === value2;
    } else if (typeof value1 === "function")
      return value1 === value2 || value1.toString() === value2.toString();
    else return value1 === value2;
  });
}

export function random(min: number = 0, max: number = 1) {
  return Math.random() * (max - min) + min;
}

export function isMain(meta: ImportMeta) {
  const metaPath = fileURLToPath(meta.url);
  const metaPathNoExtension = metaPath.slice(0, -p.extname(metaPath).length);
  return (
    process.argv[1] === metaPath || process.argv[1] === metaPathNoExtension
  );
}

export const ip = (ip: string) => ip.replace("::ffff:", "").replace("::1", "");
