#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(process.argv[2] || "/Users/liuzhaoran/Desktop/2C-DesignWiki");
const demoRoot = path.resolve(__dirname, "..");
const outputJson = path.join(demoRoot, "assets", "coding-community-snapshot.json");
const outputJs = path.join(demoRoot, "assets", "coding-community-snapshot.js");
const git = "/Library/Developer/CommandLineTools/usr/bin/git";
const coreCategories = [
  "场域特性规范",
  "基础组件库（功能型组件）",
  "品牌与运营规范",
  "业务组件库（业务型组件）",
  "多端多人群适配规范",
];

function runGit(args) {
  return execFileSync(git, args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
}

function lines(value) {
  return value ? value.split(/\r?\n/).filter(Boolean) : [];
}

function shanghaiDate(isoString) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(isoString));
}

function daysBefore(isoString, days) {
  const date = new Date(isoString);
  date.setUTCDate(date.getUTCDate() - days);
  return shanghaiDate(date);
}

function isHuman(email) {
  return email && !/spec-bot|skip-ci/i.test(email);
}

function authorsForRange(rangeArgs) {
  return lines(runGit(["log", ...rangeArgs, "--no-merges", "--format=%ae"]))
    .filter(isHuman);
}

function countValues(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()]
    .map(([email, commits]) => ({
      email,
      name: email.replace(/@jd\.com$/i, ""),
      commits,
    }))
    .sort((a, b) => b.commits - a.commits || a.name.localeCompare(b.name));
}

function changedFilesSince(date, pattern) {
  return [...new Set(
    lines(runGit([
      "-c",
      "core.quotepath=false",
      "log",
      `--since=${date} 00:00:00 +0800`,
      "--no-merges",
      "--name-only",
      "--format=",
      "--",
      pattern,
    ])),
  )].sort();
}

const head = runGit(["rev-parse", "HEAD"]);
const [headCommittedAt, headAuthor, headSubject] = lines(
  runGit(["log", "-1", "--format=%aI%n%an%n%s"]),
);
const endDate = shanghaiDate(headCommittedAt);
const weekStart = daysBefore(headCommittedAt, 6);
const monthStart = daysBefore(headCommittedAt, 29);
const sourceBranch = process.env.CODING_SOURCE_BRANCH
  || runGit(["branch", "--show-current"])
  || "main";
const weekBase = runGit([
  "rev-list",
  "-1",
  `--before=${weekStart} 00:00:00 +0800`,
  "HEAD",
]) || runGit(["rev-list", "--max-parents=0", "HEAD"]);

const weeklyAuthors = authorsForRange([
  `--since=${weekStart} 00:00:00 +0800`,
  `--until=${endDate} 23:59:59 +0800`,
]);
const monthlyAuthors = authorsForRange([
  `--since=${monthStart} 00:00:00 +0800`,
  `--until=${endDate} 23:59:59 +0800`,
]);
const priorAuthors = new Set(authorsForRange([weekBase]));
const newContributors = [...new Set(weeklyAuthors)]
  .filter((email) => !priorAuthors.has(email))
  .map((email) => ({
    email,
    name: email.replace(/@jd\.com$/i, ""),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const addedDesignFiles = lines(runGit([
  "-c",
  "core.quotepath=false",
  "diff",
  "--diff-filter=A",
  "--name-only",
  `${weekBase}..${head}`,
  "--",
  "jd-design-system-md-v16/foundations/**/design.md",
]));
const categoryCounts = Object.fromEntries(coreCategories.map((category) => [category, 0]));
addedDesignFiles.forEach((file) => {
  const category = file.split("/")[2];
  if (Object.prototype.hasOwnProperty.call(categoryCounts, category)) {
    categoryCounts[category] += 1;
  }
});

const changedSkills = changedFilesSince(endDate === weekStart ? endDate : weekStart, "**/SKILL.md");
const snapshot = {
  schema_version: "1.0",
  generated_at: new Date().toISOString(),
  source: {
    repository: "JD-Design-Wiki/2C-DesignWiki",
    branch: sourceBranch,
    head,
    committed_at: headCommittedAt,
    author: headAuthor,
    subject: headSubject,
  },
  windows: {
    week: { start: weekStart, end: endDate, base_commit: weekBase },
    month: { start: monthStart, end: endDate },
  },
  weekly: {
    contributor_count: new Set(weeklyAuthors).size,
    non_merge_commit_count: weeklyAuthors.length,
    contributors: countValues(weeklyAuthors),
    changed_skill_count: changedSkills.length,
    changed_skills: changedSkills,
    new_contributors: newContributors,
    design_system: {
      core_design_md_added: Object.values(categoryCounts).reduce((sum, count) => sum + count, 0),
      categories: categoryCounts,
      excluded_design_md_added: addedDesignFiles.length
        - Object.values(categoryCounts).reduce((sum, count) => sum + count, 0),
    },
  },
  monthly: {
    contributors: countValues(monthlyAuthors),
  },
};

fs.mkdirSync(path.dirname(outputJson), { recursive: true });
fs.writeFileSync(outputJson, `${JSON.stringify(snapshot, null, 2)}\n`);
fs.writeFileSync(outputJs, `window.codingCommunitySnapshot = ${JSON.stringify(snapshot, null, 2)};\n`);

console.log(`Coding snapshot: ${weekStart} to ${endDate}`);
console.log(`Source HEAD: ${head}`);
console.log(`Weekly contributors: ${snapshot.weekly.contributor_count}`);
console.log(`Changed skills: ${snapshot.weekly.changed_skill_count}`);
console.log(`Core design.md added: ${snapshot.weekly.design_system.core_design_md_added}`);
console.log(outputJson);
