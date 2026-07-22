#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(process.argv[2] || "/Users/liuzhaoran/Desktop/2C-DesignWiki");
const demoRoot = path.resolve(__dirname, "..");
const skillsRoot = path.join(repoRoot, ".agents", "skills");
const outputJson = path.join(demoRoot, "assets", "community-skills.json");
const outputJs = path.join(demoRoot, "assets", "community-skills.js");

function unquote(value = "") {
  return value.trim().replace(/^["']|["']$/g, "");
}

function parsePair(text, target) {
  const index = text.indexOf(":");
  if (index < 0) return;
  const key = text.slice(0, index).trim();
  const value = text.slice(index + 1).trim();
  target[key] = unquote(value);
}

function getScalar(text, key, fallback = "") {
  const pattern = new RegExp(`^${key}:\\s*(.+)$`, "m");
  const match = text.match(pattern);
  return match ? unquote(match[1]) : fallback;
}

function getBlock(text, key) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start < 0) return "";
  const indent = lines[start].match(/^\s*/)[0].length;
  const block = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) {
      block.push(line);
      continue;
    }
    const currentIndent = line.match(/^\s*/)[0].length;
    if (currentIndent <= indent) break;
    block.push(line.slice(indent + 2));
  }
  return block.join("\n");
}

function getArray(text, key) {
  return getBlock(text, key)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => unquote(line.slice(2)));
}

function getObject(text, key) {
  const result = {};
  getBlock(text, key)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => parsePair(line, result));
  return result;
}

function getObjectArray(text, key) {
  const block = getBlock(text, key);
  const items = [];
  let current = null;
  block.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;
    if (line.startsWith("- ")) {
      if (current) items.push(current);
      current = {};
      parsePair(line.slice(2), current);
      return;
    }
    if (current) parsePair(line, current);
  });
  if (current) items.push(current);
  return items;
}

function statPackageSize(file) {
  if (!file) return "待打包";
  const packagePath = path.join(demoRoot, "assets", "packages", file);
  if (!fs.existsSync(packagePath)) return "待打包";
  const bytes = fs.statSync(packagePath).size;
  if (bytes < 1024) return `${bytes}B`;
  return `${Math.round(bytes / 1024)}KB`;
}

function formatUsageDisplay(metrics) {
  if (metrics.usage_count) return `${metrics.usage_count} 次有效使用`;
  return metrics.usage || "仓库同步";
}

function buildRecord(skillDir) {
  const communityPath = path.join(skillDir, "community.yaml");
  if (!fs.existsSync(communityPath)) return null;

  const yaml = fs.readFileSync(communityPath, "utf8");
  const id = getScalar(yaml, "id", path.basename(skillDir));
  const owner = getObject(yaml, "owner");
  const packageInfo = getObject(yaml, "package");
  const usage = getObject(yaml, "usage");
  const source = getObject(yaml, "source");
  const validation = getObject(yaml, "validation");
  const cover = getObject(yaml, "cover");
  const metrics = getObject(yaml, "metrics");
  const contributions = getObjectArray(yaml, "contributions");
  const cases = getObjectArray(yaml, "cases");
  const relationsBlock = getBlock(yaml, "relations");

  packageInfo.size = packageInfo.size || statPackageSize(packageInfo.file);
  packageInfo.prompt = usage.invoke || `用 ${id} skill，完成这次设计任务：{任务说明}`;
  const latestContribution = contributions[contributions.length - 1];

  return {
    schema_version: getScalar(yaml, "schema_version", "1.0"),
    content_type: getScalar(yaml, "content_type", "skill"),
    id,
    name: getScalar(yaml, "name", id),
    summary: getScalar(yaml, "summary", ""),
    category: getScalar(yaml, "category", "Skill"),
    version: getScalar(yaml, "version", packageInfo.version || "v1.0"),
    updated_at: getScalar(yaml, "updated_at", ""),
    problem: getScalar(yaml, "problem", ""),
    scenarios: getArray(yaml, "scenarios"),
    owner,
    contributors: getObjectArray(yaml, "contributors"),
    contributions,
    usage,
    cover,
    metrics,
    package: packageInfo,
    validation: {
      ...validation,
      evidence: getArray(getBlock(yaml, "validation"), "evidence"),
    },
    source,
    cases,
    relations: {
      wiki: getArray(relationsBlock, "wiki"),
      zones: getArray(relationsBlock, "zones"),
      related_skills: getArray(relationsBlock, "related_skills"),
    },
    feedback: getObject(yaml, "feedback"),
    repo: {
      name: path.basename(repoRoot),
      path: path.relative(repoRoot, skillDir),
      community_yaml: path.relative(repoRoot, communityPath),
    },
    display: {
      usage: formatUsageDisplay(metrics),
      latest_contribution: latestContribution
        ? `${latestContribution.name} · ${latestContribution.summary}`
        : `${owner.name || "牵头人"} · 完成社区化协议录入`,
    },
  };
}

function sync() {
  if (!fs.existsSync(skillsRoot)) {
    throw new Error(`Skill directory not found: ${skillsRoot}`);
  }

  const records = fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => buildRecord(path.join(skillsRoot, entry.name)))
    .filter(Boolean);

  fs.mkdirSync(path.dirname(outputJson), { recursive: true });
  fs.writeFileSync(outputJson, `${JSON.stringify(records, null, 2)}\n`);
  fs.writeFileSync(outputJs, `window.repoCommunitySkills = ${JSON.stringify(records, null, 2)};\n`);

  console.log(`Synced ${records.length} community skill(s).`);
  console.log(outputJson);
  console.log(outputJs);
}

sync();
