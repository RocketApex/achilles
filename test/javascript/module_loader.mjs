import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../app/javascript/achilles");
const cache = new Map();

function encodeModule(source) {
  return `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
}

function modulePathFor(specifier) {
  if (!specifier.startsWith("achilles/")) {
    return specifier;
  }

  return resolve(root, `${specifier.slice("achilles/".length)}.js`);
}

export function achillesModule(path) {
  const absolutePath = path.startsWith("achilles/") ? modulePathFor(path) : resolve(root, path);

  if (cache.has(absolutePath)) {
    return cache.get(absolutePath);
  }

  let source = readFileSync(absolutePath, "utf8");
  source = source.replace(/from "([^"]+)"/g, (_match, specifier) => {
    if (!specifier.startsWith("achilles/")) {
      return `from "${specifier}"`;
    }

    return `from "${achillesModule(specifier)}"`;
  });

  const url = encodeModule(source);
  cache.set(absolutePath, url);

  return url;
}

export function importAchilles(path) {
  return import(achillesModule(path));
}
