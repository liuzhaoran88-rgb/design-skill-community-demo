#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const demoRoot = path.resolve(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(demoRoot, relativePath), "utf8"));
}

function readWindowAssignment(relativePath) {
  const text = fs.readFileSync(path.join(demoRoot, relativePath), "utf8");
  const match = text.match(/=\s*([\s\S]*);\s*$/);
  if (!match) throw new Error(`${relativePath} 不是有效的 window 数据文件`);
  return JSON.parse(match[1]);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

const snapshot = readJson("assets/coding-community-snapshot.json");
const snapshotJs = readWindowAssignment("assets/coding-community-snapshot.js");
const communitySkills = readJson("assets/community-skills.json");
const communitySkillsJs = readWindowAssignment("assets/community-skills.js");
const weeklyUpdates = readJson("assets/weekly-updates.json");
const weeklyUpdatesJs = readWindowAssignment("assets/weekly-updates.js");
const indexHtml = fs.readFileSync(path.join(demoRoot, "index.html"), "utf8");

assert(sameJson(snapshot, snapshotJs), "Coding snapshot 的 JSON 与 JS 不一致");
assert(sameJson(communitySkills, communitySkillsJs), "Community skills 的 JSON 与 JS 不一致");
assert(sameJson(weeklyUpdates, weeklyUpdatesJs), "Weekly updates 的 JSON 与 JS 不一致");

const weekly = snapshot.weekly;
assert(snapshot.source.branch === "main", "Coding snapshot 必须来自 main");
assert(Array.isArray(weekly.contributors), "贡献者列表缺失");
assert(weekly.contributor_count === weekly.contributors.length, "贡献者总数与列表长度不一致");
assert(
  weekly.non_merge_commit_count === weekly.contributors.reduce((sum, item) => sum + item.commits, 0),
  "贡献者提交数合计与社区共建更新总数不一致",
);
assert(
  !weekly.contributors.some((item) => /spec-bot|skip-ci/i.test(`${item.name} ${item.email}`)),
  "贡献者列表包含自动化账号",
);
assert(weekly.changed_skill_count === weekly.changed_skills.length, "Skill 变更总数与列表长度不一致");

const categories = weekly.design_system.categories;
const categoryTotal = Object.values(categories).reduce((sum, value) => sum + value, 0);
assert(categoryTotal === weekly.design_system.core_design_md_added, "核心规范分类合计与总数不一致");

assert(Array.isArray(communitySkills) && communitySkills.length > 0, "社区 Skill 数据不能为空");
assert(Array.isArray(weeklyUpdates.items), "本周更新列表缺失");
assert(weeklyUpdates.items.length > 0 && weeklyUpdates.items.length <= 6, "本周更新应展示 1–6 项");
assert(weeklyUpdates.schema_version === "1.1", "本周更新数据必须使用支持 Skill 弹层的 1.1 结构");
assert(
  new Set(weeklyUpdates.items.map((item) => item.id)).size === weeklyUpdates.items.length,
  "本周更新包含重复的 Skill id",
);
assert(
  weeklyUpdates.items.every((item) => weekly.changed_skills.includes(item.path)),
  "本周更新包含不在本周期变更列表中的 Skill",
);
assert(
  weeklyUpdates.items.every((item) => ["研究与分析", "体验与优化", "设计交付"].includes(item.scene)),
  "本周更新包含未知任务分类",
);
assert(
  weeklyUpdates.items.every((item) => item.title && item.summary && item.author && item.progress && item.url),
  "本周更新存在缺少标题、说明、作者、进展或链接的项目",
);
assert(
  weeklyUpdates.items.every((item) => (
    item.detail
    && item.detail.description
    && Array.isArray(item.detail.contributors)
    && item.detail.contributors.length > 0
    && Array.isArray(item.detail.preparation)
    && item.detail.preparation.length > 0
    && Array.isArray(item.detail.cases)
    && Array.isArray(item.detail.lifecycle)
    && item.detail.lifecycle.length > 0
    && item.detail.lifecycle.length <= 5
    && item.detail.source?.type === "skill-md"
    && item.detail.source?.path === item.path
    && item.detail.source?.url.includes("/blob/main/")
    && item.detail.source?.url.endsWith(encodeURIComponent(item.path))
    && item.detail.source?.prompt
  )),
  "本周更新存在无法打开完整 Skill 弹层的项目",
);
assert(
  weeklyUpdates.items.every((item) => item.detail.lifecycle.every((event) => (
    event.version && event.date && event.name && event.action && event.outcome
  ))),
  "本周更新的迭代记录存在缺失字段",
);
assert(
  weeklyUpdates.items.every((item) => item.detail.cases.every((itemCase) => (
    itemCase.title && itemCase.summary && itemCase.source && itemCase.result
  ))),
  "本周更新的真实案例存在缺失字段",
);

assert(indexHtml.includes("assets/weekly-updates.js?v="), "index.html 未加载 weekly-updates.js");
assert(indexHtml.includes("data-weekly-updates"), "index.html 缺少本周更新动态容器");
assert(!indexHtml.includes("07.18 至今"), "页面仍包含固定的 07.18 统计口径");

console.log(JSON.stringify({
  source_head: snapshot.source.head,
  period: snapshot.windows.week,
  contributors: weekly.contributor_count,
  updates: weekly.non_merge_commit_count,
  changed_skills: weekly.changed_skill_count,
  core_design_updates: weekly.design_system.core_design_md_added,
  weekly_cards: weeklyUpdates.items.length,
  community_skills: communitySkills.length,
}, null, 2));
