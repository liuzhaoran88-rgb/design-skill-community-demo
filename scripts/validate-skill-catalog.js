#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const catalogDir = path.resolve(process.argv[2] || path.join(__dirname, "..", "artifacts", "scenario-skill-catalog"));
const catalogPath = path.join(catalogDir, "catalog.json");
const pagePath = path.join(catalogDir, "index.html");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const html = fs.readFileSync(pagePath, "utf8");

assert(catalog.schema_version === "1.0", "候选目录结构版本错误");
assert(catalog.source.branch === "main", "候选目录必须来自 Coding main");
assert(/^[a-f0-9]{40}$/.test(catalog.source.head), "Coding source HEAD 缺失");
assert(Array.isArray(catalog.items) && catalog.items.length > 0, "候选目录为空");
assert(catalog.total === catalog.items.length, "候选总数与列表不一致");
assert(new Set(catalog.items.map((item) => item.path)).size === catalog.total, "候选目录包含重复路径");
assert(new Set(catalog.items.map((item) => item.id.toLowerCase())).size === catalog.total, "候选目录包含重复 Skill id");
assert(catalog.scanned_files >= catalog.total, "扫描文件数不能少于去重后的 Skill 数");
assert(
  catalog.items.every((item) => (
    item.title
    && item.description
    && item.owner
    && item.updated_at
    && item.directory_url.includes("/tree/main/")
    && item.skill_md_url.includes("/blob/main/")
    && item.skill_md_url.endsWith(encodeURIComponent(item.path))
    && Number.isInteger(item.readiness)
    && item.readiness >= 0
    && item.readiness <= item.readiness_total
  )),
  "候选 Skill 存在缺失字段或无效链接",
);
assert(!html.includes("__CATALOG_DATA__"), "选品页面仍有数据占位符");
assert(html.includes(catalog.source.head), "选品页面没有记录 Coding source HEAD");
assert(html.includes("导出推荐配置"), "选品页面缺少导出操作");

console.log(JSON.stringify({
  source_head: catalog.source.head,
  generated_at: catalog.generated_at,
  total: catalog.total,
  scenes: catalog.scenes,
}, null, 2));
