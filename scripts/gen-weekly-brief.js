#!/usr/bin/env node

/**
 * gen-weekly-brief.js — 增量周报草稿生成器
 *
 * 读旧/新两份 coding-community-snapshot.json，diff 出本周变化，
 * 套用 docs/daily-changes/ 现有 markdown 骨架输出一份「待审核草稿」。
 *
 * 铁律：只做数据拼装，不臆造使用次数 / 评分 / 头像（对齐 PROJECT_HANDOFF）。
 * 所有 editorial（Skill 的人话描述、推荐语）留占位，交人工填。
 *
 * 用法：
 *   node scripts/gen-weekly-brief.js <old.json|-> <new.json> [outFile]
 *   - old 传 "-" 或不存在的路径 → 视为首次，无环比。
 *   - outFile 省略 → 打印到 stdout。
 */

const fs = require("fs");
const path = require("path");

function readSnapshot(p) {
  if (!p || p === "-") return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (err) {
    return null;
  }
}

function shortHead(head) {
  return head ? head.slice(0, 8) : "(未知)";
}

// 从 SKILL.md 路径提取可读的 skill 目录名（倒数第二段）
function skillLabel(skillPath) {
  const parts = skillPath.split("/").filter(Boolean);
  // 去掉结尾 SKILL.md，取其父目录
  const idx = parts.lastIndexOf("SKILL.md");
  const folder = idx > 0 ? parts[idx - 1] : parts[parts.length - 1];
  return folder;
}

function delta(nv, ov) {
  if (ov == null || Number.isNaN(ov)) return "";
  const d = nv - ov;
  if (d === 0) return "（环比持平）";
  return d > 0 ? `（环比 +${d}）` : `（环比 ${d}）`;
}

const [, , oldPath, newPath, outFile] = process.argv;

if (!newPath) {
  console.error("用法: node scripts/gen-weekly-brief.js <old.json|-> <new.json> [outFile]");
  process.exit(1);
}

const next = readSnapshot(newPath);
if (!next) {
  console.error(`无法读取新快照: ${newPath}`);
  process.exit(1);
}
const prev = readSnapshot(oldPath);

const repo = next.source.repository;
const branch = next.source.branch;
const head = shortHead(next.source.head);
const weekStart = next.windows.week.start;
const weekEnd = next.windows.week.end;

const w = next.weekly;
const ds = w.design_system;
const pw = prev ? prev.weekly : null;

// 环比
const dContrib = pw ? delta(w.contributor_count, pw.contributor_count) : "";
const dSkill = pw ? delta(w.changed_skill_count, pw.changed_skill_count) : "";
const dMd = pw ? delta(ds.core_design_md_added, pw.design_system.core_design_md_added) : "";

// 分类明细（只列非零项）
const categoryLines = Object.entries(ds.categories)
  .filter(([, count]) => count > 0)
  .map(([name, count]) => `  - ${name}：${count} 份`)
  .join("\n");

// Skill 变更列表（机械提取目录名 + 完整路径，人话描述留占位）
const skillLines = (w.changed_skills || [])
  .map((p) => `  - \`${skillLabel(p)}\` — _（待人工补一句用途）_\n    <sub>${p}</sub>`)
  .join("\n");

// 新贡献者
const newContribLines = (w.new_contributors || []).length
  ? w.new_contributors.map((c) => `  - ${c.name}`).join("\n")
  : "  - （本周无新增贡献者）";

const lines = [];
lines.push(`# ${weekEnd} 社区 Demo 更新（自动草稿 · 待审核）`);
lines.push("");
lines.push(`> ⚠️ 本文件由 \`weekly-auto-sync.sh\` 自动生成，发布前请人工核对贡献者姓名、数字与头像。`);
lines.push("");
lines.push("## 数据概览");
lines.push("");
lines.push(`- 数据源：Coding \`${repo}\` 的 \`${branch}\` 分支，源提交 \`${head}\`。`);
lines.push(`- 快照窗口：${weekStart} 至 ${weekEnd}（最近 7 天）。`);
lines.push(`- 本周贡献者：**${w.contributor_count}** 位${dContrib}。`);
lines.push(`- 社区共建更新：**${w.non_merge_commit_count}** 次（已排除合并与自动化提交）。`);
lines.push(`- Skill 变更：**${w.changed_skill_count}** 项${dSkill}。`);
lines.push(`- 核心规范 MD 新增：**${ds.core_design_md_added}** 份${dMd}。`);
if (ds.excluded_design_md_added > 0) {
  lines.push(`- （另有 ${ds.excluded_design_md_added} 份非核心目录 design.md 未计入分类）。`);
}
lines.push("");
lines.push("### 核心规范 MD 分类明细");
lines.push("");
lines.push(categoryLines || "  - （本周无核心规范 MD 新增）");
lines.push("");
lines.push("### 新增贡献者");
lines.push("");
lines.push(newContribLines);
lines.push("");
lines.push("### 本周 Skill 变更");
lines.push("");
lines.push(skillLines || "  - （本周无 Skill 变更）");
lines.push("");
lines.push("## 待审核清单（发布前逐项确认）");
lines.push("");
lines.push("- [ ] 贡献者姓名与真实身份一致，无脏数据 / 机器人账号。");
lines.push("- [ ] 数字（贡献者数 / 提交数 / MD 数）与 coding 仓库 `git log` 可对上。");
lines.push("- [ ] 无真实头像的贡献者使用统一默认头像，未冒用他人照片。");
lines.push("- [ ] 上方 Skill 的「用途」占位已补成人话，或确认删除占位。");
lines.push("- [ ] 首页「本周更新」楼层预览无文字溢出 / 数据错位。");
lines.push("");
lines.push("## 刷新命令（复现本次数据）");
lines.push("");
lines.push("```bash");
lines.push(`node scripts/sync-coding-snapshot.js "/Users/liuzhaoran/Desktop/AI项目/2C-DesignWiki"`);
lines.push("```");
lines.push("");

const output = lines.join("\n");

if (outFile) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, output);
  console.log(`周报草稿已写入: ${outFile}`);
} else {
  process.stdout.write(output);
}
