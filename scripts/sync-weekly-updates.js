#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(process.argv[2] || "/Users/liuzhaoran/Desktop/AI项目/2C-DesignWiki");
const demoRoot = path.resolve(__dirname, "..");
const snapshotPath = path.join(demoRoot, "assets", "coding-community-snapshot.json");
const overridesPath = path.join(demoRoot, "data", "weekly-update-overrides.json");
const outputJson = path.join(demoRoot, "assets", "weekly-updates.json");
const outputJs = path.join(demoRoot, "assets", "weekly-updates.js");
const git = "/Library/Developer/CommandLineTools/usr/bin/git";
const maxItems = 6;

function runGit(args) {
  return execFileSync(git, args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  }).trim();
}

function stripMarkdown(value = "") {
  return value
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unquote(value = "") {
  return value.trim().replace(/^["']|["']$/g, "");
}

function readableTitle(skillPath, content) {
  const frontmatterName = content.match(/^---[\s\S]*?^name:\s*(.+)$/m)?.[1];
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  const folder = path.basename(path.dirname(skillPath));
  return stripMarkdown(unquote(frontmatterName || heading || folder.replace(/[-_]+/g, " ")));
}

function readableSummary(content, title) {
  const frontmatterDescription = content.match(/^---[\s\S]*?^description:\s*(.+)$/m)?.[1];
  if (frontmatterDescription) return stripMarkdown(unquote(frontmatterDescription)).slice(0, 110);

  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/m, "");
  const paragraph = withoutFrontmatter
    .split(/\r?\n\r?\n/)
    .map(stripMarkdown)
    .find((value) => value.length >= 12 && value !== title && !/^(适用|触发|输入|输出|步骤|工作流)/.test(value));
  return (paragraph || `${title} 的可复用工作流程与交付说明。`).slice(0, 110);
}

function cleanSubject(subject = "", title = "") {
  const cleaned = subject
    .replace(/^(feat|fix|docs|chore|refactor|style|test)(\([^)]*\))?:\s*/i, "")
    .replace(/^更新\s*/u, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return `更新 ${title} 的流程与交付说明。`;
  return `${cleaned.replace(/[。.]?$/u, "")}。`.slice(0, 120);
}

function inferScene(skillPath, title, content) {
  const text = `${skillPath} ${title} ${content.slice(0, 1000)}`.toLowerCase();
  if (/review|audit|accessibility|heuristic|friendly|检查|评估|审查|优化/.test(text)) return "体验与优化";
  if (/research|analysis|market|brief|persona|survey|interview|竞品|研究|分析|洞察/.test(text)) return "研究与分析";
  return "设计交付";
}

function codingUrl(skillPath) {
  const directory = path.dirname(skillPath).split(path.sep).join("/");
  return `http://jagile.jd.com/codingRoot/JD-Design-Wiki/2C-DesignWiki/tree/main/${encodeURIComponent(directory)}`;
}

function skillId(skillPath) {
  const directory = path.dirname(skillPath);
  const folder = path.basename(directory);
  return /^skills?$/i.test(folder) ? path.basename(path.dirname(directory)) : folder;
}

function commitInfo(skillPath) {
  const raw = runGit(["log", "-1", "--format=%H%x00%aI%x00%an%x00%s", "--", skillPath]);
  const [commit, committedAt, author, subject] = raw.split("\0");
  return { commit, committed_at: committedAt, author, subject };
}

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
const overrides = fs.existsSync(overridesPath)
  ? JSON.parse(fs.readFileSync(overridesPath, "utf8"))
  : {};

const candidates = (snapshot.weekly.changed_skills || [])
  .filter((skillPath) => !skillPath.startsWith(".agents/"))
  .filter((skillPath) => fs.existsSync(path.join(repoRoot, skillPath)))
  .map((skillPath) => {
    const content = fs.readFileSync(path.join(repoRoot, skillPath), "utf8");
    const override = overrides[skillPath] || {};
    const title = override.title || readableTitle(skillPath, content);
    const commit = commitInfo(skillPath);
    return {
      id: skillId(skillPath),
      path: skillPath,
      title,
      scene: override.scene || inferScene(skillPath, title, content),
      summary: override.summary || readableSummary(content, title),
      author: commit.author || "待确认",
      progress: override.progress || cleanSubject(commit.subject, title),
      url: codingUrl(skillPath),
      is_tool: override.is_tool === true || /skills&tools|\/tools?\//i.test(skillPath),
      commit: commit.commit,
      committed_at: commit.committed_at,
      order: Number.isFinite(override.order) ? override.order : null,
    };
  });

const preferred = candidates
  .filter((item) => item.order !== null)
  .sort((a, b) => a.order - b.order);
const fallback = candidates
  .filter((item) => item.order === null)
  .sort((a, b) => b.committed_at.localeCompare(a.committed_at) || a.title.localeCompare(b.title, "zh-CN"));
const items = [...preferred, ...fallback]
  .slice(0, maxItems)
  .map(({ order, ...item }) => item);

const output = {
  schema_version: "1.0",
  generated_at: snapshot.generated_at,
  source: {
    repository: snapshot.source.repository,
    branch: snapshot.source.branch,
    head: snapshot.source.head,
  },
  period: snapshot.windows.week,
  items,
};

fs.writeFileSync(outputJson, `${JSON.stringify(output, null, 2)}\n`);
fs.writeFileSync(outputJs, `window.weeklyUpdates = ${JSON.stringify(output, null, 2)};\n`);

console.log(`Weekly updates: ${items.length} item(s).`);
console.log(outputJson);
console.log(outputJs);
