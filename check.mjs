import fs from "node:fs";
import path from "node:path";
const root = path.join(import.meta.dirname, "public");
let count = 0;
for (const file of [
  "index.html",
  "menu/index.html",
  "company/index.html",
  "recruit/index.html",
]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (ids.length !== new Set(ids).size) throw Error("Duplicate ids: " + file);
  if ((html.match(/<h1\b/g) || []).length !== 1)
    throw Error("Expected one h1: " + file);
  if (!html.includes('content="noindex,nofollow"'))
    throw Error("Missing noindex: " + file);
  if (!html.includes("架空の店舗のデモサイト"))
    throw Error("Missing demo notice: " + file);
  if (/鉄板|TEPPAN|hero-steak|seasonal\.webp/.test(html))
    throw Error("Legacy content remains: " + file);
  for (const image of html.matchAll(/<img\b[^>]+>/g)) {
    for (const attribute of ["alt", "width", "height"])
      if (!image[0].includes(attribute + '="'))
        throw Error("Image missing " + attribute + ": " + file);
  }
  for (const source of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const item of source[1].split(",")) {
      const relative = item.trim().split(/\s+/)[0];
      if (
        !fs.existsSync(
          path.resolve(path.dirname(path.join(root, file)), relative),
        )
      )
        throw Error("Missing srcset: " + relative);
      count++;
    }
  }
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^https?:/.test(url))
      throw Error("Unexpected external request: " + url);
    const [reference, hash] = url.split("#");
    const relative = reference.split("?")[0];
    let target = relative
      ? path.resolve(path.dirname(path.join(root, file)), relative)
      : path.join(root, file);
    if (!target.startsWith(root + path.sep) && target !== root)
      throw Error("Out of public path");
    if (fs.statSync(target).isDirectory())
      target = path.join(target, "index.html");
    if (!fs.existsSync(target)) throw Error("Missing asset: " + target);
    if (hash && !fs.readFileSync(target, "utf8").includes(`id="${hash}"`))
      throw Error("Missing fragment: " + url);
    count++;
  }
  if (
    /mitsui|みつい|0112819321|tabelog|facebook\.com|instagram\.com/.test(html)
  )
    throw Error("Reference identity remains");
  console.log("OK", file);
}
console.log(`Validated ${count} references and page IDs.`);
