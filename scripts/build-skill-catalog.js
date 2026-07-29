#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(process.argv[2] || "/Users/liuzhaoran/Desktop/AI项目/2C-DesignWiki");
const demoRoot = path.resolve(__dirname, "..");
const outputDir = path.resolve(process.argv[3] || path.join(demoRoot, "artifacts", "scenario-skill-catalog"));
const templatePath = path.join(demoRoot, "scripts", "templates", "scenario-skill-catalog.html");
const git = "/Library/Developer/CommandLineTools/usr/bin/git";

function runGit(args) {
  return execFileSync(git, args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  }).trim();
}

function stripMarkdown(value = "") {
  return String(value)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
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

function cleanTitle(value = "") {
  return stripMarkdown(value)
    .replace(/^[/:]\s*/, "")
    .replace(/\s+[·—|-]\s+.*$/u, "")
    .replace(/\s+Skill$/i, "")
    .trim();
}

function readableTitle(skillPath, content) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  const frontmatterName = frontmatterValue(content, "name");
  const folder = path.basename(path.dirname(skillPath));
  const headingTitle = cleanTitle(heading || "");
  if (headingTitle && headingTitle.length <= 42) return headingTitle;
  return cleanTitle(frontmatterName || folder.replace(/[-_]+/g, " "));
}

function readableSummary(content, title) {
  const frontmatterDescription = stripMarkdown(frontmatterValue(content, "description"));
  if (frontmatterDescription) return frontmatterDescription.slice(0, 180);

  const body = content.replace(/^---[\s\S]*?---\s*/m, "");
  const paragraph = body
    .split(/\r?\n\r?\n/)
    .map(stripMarkdown)
    .find((item) => item.length >= 18 && item !== title && !/^(使用|输入|输出|步骤|目录|流程)/.test(item));
  return (paragraph || `${title} 的可复用设计工作流。`).slice(0, 180);
}

function inferScene(skillPath, title, content) {
  const identity = `${skillPath} ${title}`.toLowerCase();
  const intro = content.slice(0, 1800).toLowerCase();
  if (/brand|icon|visual|banner|livestream|cover|品牌|图标|视觉|封面|营销/.test(identity)) return "品牌与营销";
  if (/research|analysis|market|survey|interview|persona|journey|insight|feedback|研究|分析|洞察|访谈|问卷|画像/.test(identity)) {
    return "研究与分析";
  }
  if (/review|audit|accessibility|heuristic|usability|check|advisor|评估|走查|审查|检查|可用性|优化|顾问/.test(identity)) {
    return "体验与优化";
  }
  if (/用户研究|市场分析|用户反馈|满意度|访谈|问卷|画像/.test(intro)) return "研究与分析";
  if (/设计评审|体验评估|可用性测试|规范检查|质量检查/.test(intro)) return "体验与优化";
  return "设计交付";
}

function domainLabel(skillPath) {
  if (skillPath.startsWith(".agents/skills/")) return "Agent 公共能力";
  if (skillPath.includes("/horizontal/user-research/")) return "横向 · 用户研究";
  if (skillPath.includes("/local-life/")) return "产品架构 · 本地生活";
  if (skillPath.includes("/comprehensive-business/")) return "产品架构 · 综合业务";
  if (skillPath.includes("/huangliu-design/")) return "产品架构 · 商详";
  if (skillPath.includes("/plus-and-new-channel/")) return "产品架构 · PLUS 与新品";
  if (skillPath.includes("/search-recommend-foundation/")) return "产品架构 · 搜推基础";
  return "设计系统";
}

function codingDirectoryUrl(skillPath) {
  const directory = path.dirname(skillPath).split(path.sep).join("/");
  return `http://jagile.jd.com/codingRoot/JD-Design-Wiki/2C-DesignWiki/tree/main/${encodeURIComponent(directory)}`;
}

function codingFileUrl(skillPath) {
  return `http://jagile.jd.com/codingRoot/JD-Design-Wiki/2C-DesignWiki/blob/main/${encodeURIComponent(skillPath)}`;
}

function gitHistory(skillPath) {
  const raw = runGit(["log", "-12", "--format=%H%x00%aI%x00%an%x00%s%x1e", "--", skillPath]);
  return raw
    .split("\x1e")
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [commit, committedAt, author, subject] = record.split("\0");
      return { commit, committed_at: committedAt, author, subject };
    });
}

function contentSignals(content) {
  const headings = [...content.matchAll(/^#{1,4}\s+(.+)$/gm)].map((match) => stripMarkdown(match[1]));
  const hasHeading = (pattern) => headings.some((heading) => pattern.test(heading));
  return {
    preparation: hasHeading(/使用前准备|开始前|输入|调用方式|何时用|触发与适用|适用场景/i),
    examples: hasHeading(/案例|示例|example|demo/i),
    validation: hasHeading(/校验|验证|测试|自检|checklist|验收/i),
    history: hasHeading(/版本历史|更新记录|迭代|changelog/i),
  };
}

function buildItem(skillPath) {
  const absolutePath = path.join(repoRoot, skillPath);
  const content = fs.readFileSync(absolutePath, "utf8");
  const title = readableTitle(skillPath, content);
  const description = readableSummary(content, title);
  const history = gitHistory(skillPath);
  const latest = history[0];
  const contributors = history
    .map((item) => item.author)
    .filter((name, index, array) => name && array.indexOf(name) === index);
  const signals = contentSignals(content);
  const readinessChecks = {
    description: description.length >= 18,
    preparation: signals.preparation,
    examples: signals.examples,
    validation: signals.validation,
    maintained: history.length >= 2 || signals.history,
  };
  const readiness = Object.values(readinessChecks).filter(Boolean).length;
  const ageDays = Math.max(0, Math.floor((Date.now() - new Date(latest.committed_at).getTime()) / 86400000));

  return {
    id: cleanTitle(frontmatterValue(content, "name")) || path.basename(path.dirname(skillPath)),
    path: skillPath,
    title,
    description,
    scene: inferScene(skillPath, title, content),
    domain: domainLabel(skillPath),
    owner: latest.author,
    contributors,
    contributor_count: contributors.length,
    commit_count: Number(runGit(["rev-list", "--count", "HEAD", "--", skillPath])),
    latest_commit: latest.commit,
    latest_subject: latest.subject,
    updated_at: latest.committed_at,
    age_days: ageDays,
    recent: ageDays <= 90,
    readiness,
    readiness_total: Object.keys(readinessChecks).length,
    readiness_checks: readinessChecks,
    directory_url: codingDirectoryUrl(skillPath),
    skill_md_url: codingFileUrl(skillPath),
    alternate_paths: [],
  };
}

function canonicalPriority(item) {
  if (item.path.startsWith(".agents/skills/")) return 3;
  if (item.path.includes("/_skills/")) return 2;
  return 1;
}

function deduplicateItems(items) {
  const groups = new Map();
  items.forEach((item) => {
    const key = item.id.toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });

  return [...groups.values()].map((group) => {
    const ordered = [...group].sort((left, right) => (
      canonicalPriority(right) - canonicalPriority(left)
      || right.readiness - left.readiness
      || right.updated_at.localeCompare(left.updated_at)
      || left.path.length - right.path.length
    ));
    const canonical = ordered[0];
    canonical.alternate_paths = ordered.slice(1).map((item) => item.path);
    canonical.source_count = ordered.length;
    return canonical;
  });
}

function safeInlineJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/-->/g, "--\\>");
}

function main() {
  const head = runGit(["rev-parse", "HEAD"]);
  const headCommittedAt = runGit(["show", "-s", "--format=%cI", "HEAD"]);
  const skillPaths = runGit(["ls-files"])
    .split(/\r?\n/)
    .filter((file) => /(^|\/)skill\.md$/i.test(file))
    .sort((left, right) => left.localeCompare(right, "zh-CN"));

  if (!skillPaths.length) throw new Error("Coding main 中没有找到 SKILL.md");

  const items = deduplicateItems(skillPaths.map(buildItem))
    .sort((left, right) => (
      right.readiness - left.readiness
      || right.updated_at.localeCompare(left.updated_at)
      || left.title.localeCompare(right.title, "zh-CN")
    ));
  const sceneCounts = items.reduce((result, item) => {
    result[item.scene] = (result[item.scene] || 0) + 1;
    return result;
  }, {});

  const output = {
    schema_version: "1.0",
    generated_at: new Date().toISOString(),
    source: {
      repository: "JD-Design-Wiki/2C-DesignWiki",
      branch: "main",
      head,
      head_committed_at: headCommittedAt,
    },
    scanned_files: skillPaths.length,
    total: items.length,
    scenes: sceneCounts,
    items,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "catalog.json"), `${JSON.stringify(output, null, 2)}\n`);

  const template = fs.readFileSync(templatePath, "utf8");
  const html = template
    .replace("__CATALOG_DATA__", safeInlineJson(output))
    .replaceAll("__GENERATED_AT__", output.generated_at)
    .replaceAll("__SOURCE_HEAD__", head);
  fs.writeFileSync(path.join(outputDir, "index.html"), html);

  console.log(JSON.stringify({
    output: path.join(outputDir, "index.html"),
    source_head: head,
    generated_at: output.generated_at,
    total: output.total,
    scenes: output.scenes,
  }, null, 2));
}

main();
