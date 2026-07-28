#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const demoRoot = path.resolve(__dirname, "..");
const indexPath = path.join(demoRoot, "index.html");
const version = process.argv[2] || new Date().toISOString().replace(/\D/g, "").slice(0, 12);
const html = fs.readFileSync(indexPath, "utf8");
const next = html.replace(
  /(assets\/(?:community-skills|coding-community-snapshot|weekly-updates)\.js\?v=)\d+/g,
  `$1${version}`,
);

if (next === html) {
  throw new Error("没有找到可更新的数据资源缓存参数");
}

fs.writeFileSync(indexPath, next);
console.log(`Data cache version: ${version}`);
