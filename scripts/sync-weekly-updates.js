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
const maxLifecycleItems = 5;

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

function frontmatterValue(content, key) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter) return "";
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^${key}:`).test(line));
  if (start < 0) return "";

  const firstValue = lines[start].slice(lines[start].indexOf(":") + 1).trim();
  if (firstValue && !["|", ">", "|-", ">-"].includes(firstValue)) return unquote(firstValue);

  const values = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^[A-Za-z0-9_-]+:/.test(lines[index])) break;
    values.push(lines[index].trim());
  }
  return unquote(values.join(" ").replace(/\s+/g, " ").trim());
}

function readableTitle(skillPath, content) {
  const frontmatterName = frontmatterValue(content, "name");
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  const folder = path.basename(path.dirname(skillPath));
  return stripMarkdown(unquote(frontmatterName || heading || folder.replace(/[-_]+/g, " ")));
}

function readableSummary(content, title) {
  const frontmatterDescription = frontmatterValue(content, "description");
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

function codingFileUrl(skillPath) {
  return `http://jagile.jd.com/codingRoot/JD-Design-Wiki/2C-DesignWiki/blob/main/${encodeURIComponent(skillPath)}`;
}

function skillId(skillPath) {
  const directory = path.dirname(skillPath);
  const folder = path.basename(directory);
  return /^skills?$/i.test(folder) ? path.basename(path.dirname(directory)) : folder;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  return `${Math.round(bytes / 1024)}KB`;
}

function markdownHeadings(content) {
  const lines = content.split(/\r?\n/);
  return lines.flatMap((line, index) => {
    const match = line.match(/^(#{1,4})\s+(.+)$/);
    return match ? [{ index, level: match[1].length, title: stripMarkdown(match[2]) }] : [];
  });
}

function headingBlock(content, heading) {
  const lines = content.split(/\r?\n/);
  let end = lines.length;
  for (let index = heading.index + 1; index < lines.length; index += 1) {
    const next = lines[index].match(/^(#{1,4})\s+/);
    if (next && next[1].length <= heading.level) {
      end = index;
      break;
    }
  }
  return lines.slice(heading.index + 1, end).join("\n");
}

function cleanListItem(value = "") {
  return stripMarkdown(value)
    .replace(/^\[[ xX]\]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractListItems(markdown, max = 3) {
  const items = [];
  markdown.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*(?:[-*+]|\d+[.)])\s+(.+)$/);
    if (!match) return;
    const item = cleanListItem(match[1]);
    if (item.length < 6 || item.length > 120 || items.includes(item)) return;
    items.push(item);
  });
  return items.slice(0, max);
}

function extractPreparation(content, summary) {
  const headings = markdownHeadings(content);
  const priorityPatterns = [
    /使用前准备|开始前|输入要求|所需输入|输入材料/,
    /触发与适用|何时用|适用范围|适用场景/,
    /调用方式|使用方法|两种用法|怎么用/,
    /工作流程|执行流程|这个 Skill 做什么|核心原则/,
  ];

  for (const pattern of priorityPatterns) {
    const heading = headings.find((item) => pattern.test(item.title) && !/不适用|不使用|不用|边界/.test(item.title));
    if (!heading) continue;
    const items = extractListItems(headingBlock(content, heading));
    if (items.length) return items;
  }

  return summary ? [summary] : [];
}

function firstSummaryFromBlock(block) {
  const listItem = extractListItems(block, 1)[0];
  if (listItem) return listItem.slice(0, 180);
  const paragraph = block
    .split(/\r?\n\r?\n/)
    .map(stripMarkdown)
    .find((item) => item.length >= 12 && item.length <= 220);
  if (paragraph) return paragraph.slice(0, 180);
  return extractListItems(block, 1)[0] || "";
}

function extractCases(content) {
  const headings = markdownHeadings(content);
  const cases = [];

  headings
    .filter((heading) => /案例|示例|执行报告/.test(heading.title))
    .forEach((heading) => {
      const block = headingBlock(content, heading);
      const nestedHeadings = markdownHeadings(block)
        .filter((item) => item.level > heading.level)
        .slice(0, 2);

      if (nestedHeadings.length) {
        nestedHeadings.forEach((nested) => {
          const summary = firstSummaryFromBlock(headingBlock(block, nested));
          if (!summary) return;
          cases.push({
            title: nested.title,
            summary,
            source: `SKILL.md · ${heading.title}`,
            result: "文档示例",
          });
        });
        return;
      }

      const summary = firstSummaryFromBlock(block);
      if (summary) {
        cases.push({
          title: heading.title,
          summary,
          source: "SKILL.md",
          result: "文档示例",
        });
      }
    });

  return cases
    .filter((item, index, array) => array.findIndex((entry) => entry.title === item.title) === index)
    .slice(0, 2);
}

function commitHistory(skillPath) {
  const raw = runGit([
    "log",
    `-${maxLifecycleItems}`,
    "--format=%H%x00%aI%x00%an%x00%s%x1e",
    "--",
    skillPath,
  ]);

  return raw
    .split("\x1e")
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [commit, committedAt, author, subject] = record.split("\0");
      return { commit, committed_at: committedAt, author, subject };
    });
}

function detailRecord({ id, skillPath, content, title, summary, scene, url, history }) {
  const contributors = history
    .map((item) => item.author)
    .filter((name, index, array) => name && array.indexOf(name) === index);
  const sourcePath = path.join(repoRoot, skillPath);
  const latest = history[0];

  return {
    badge: "本周已更新",
    description: summary,
    contributors,
    preparation_title: "使用提示",
    preparation: extractPreparation(content, summary),
    cases: extractCases(content),
    lifecycle_label: `${history.length} 条仓库记录`,
    lifecycle: history.map((item, index) => ({
      version: item.commit.slice(0, 7),
      date: item.committed_at.slice(0, 10),
      name: item.author,
      action: cleanSubject(item.subject, title),
      outcome: index === 0 ? "本周更新" : "仓库提交",
    })),
    source: {
      type: "skill-md",
      name: path.basename(skillPath),
      path: skillPath,
      version: latest.commit.slice(0, 7),
      updated: latest.committed_at.slice(0, 10),
      size: formatBytes(fs.statSync(sourcePath).size),
      url: codingFileUrl(skillPath),
      prompt: `用 ${id} skill，${summary}`,
    },
    category: scene,
  };
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
    const id = skillId(skillPath);
    const scene = override.scene || inferScene(skillPath, title, content);
    const summary = override.summary || readableSummary(content, title);
    const url = codingUrl(skillPath);
    const history = commitHistory(skillPath);
    const commit = history[0];
    return {
      id,
      path: skillPath,
      title,
      scene,
      summary,
      author: commit.author || "待确认",
      progress: override.progress || cleanSubject(commit.subject, title),
      url,
      is_tool: override.is_tool === true || /skills&tools|\/tools?\//i.test(skillPath),
      commit: commit.commit,
      committed_at: commit.committed_at,
      detail: detailRecord({ id, skillPath, content, title, summary, scene, url, history }),
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
  schema_version: "1.1",
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
