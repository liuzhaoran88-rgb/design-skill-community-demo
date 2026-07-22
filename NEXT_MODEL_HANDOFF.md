# Design Skill Community Demo Handoff

Last updated: 2026-07-22

## GitHub Links

- Repository branch: https://github.com/liuzhaoran88-rgb/design-skill-community-demo/tree/codex/community-handoff-20260722
- Live demo: https://liuzhaoran88-rgb.github.io/design-skill-community-demo/

## Project Purpose

This demo is a homepage prototype for a design and research productivity community. The core goal is to move from personal productivity to organizational productivity: make Skills, tools, design specs, knowledge, workbench cases, updates, and contributor records visible, traceable, and reusable.

## Main Files

- `index.html`: homepage structure and modal markup
- `styles.css`: visual system, layout, interactions
- `app.js`: page data, card rendering, modal behavior, tabs, links
- `assets/community-skills.json`: structured Skill/community data snapshot
- `assets/community-skills.js`: browser-friendly data mirror
- `community.yaml.example`: proposed community metadata contract
- `community-content-framework.html`: community content framework draft
- `community-architecture.html`: community architecture draft

## How To Run

From this folder:

```bash
node server.js
```

Then open:

```text
http://127.0.0.1:8765/index.html
```

The page also works by opening `index.html` directly, but local server mode is safer for assets.

## Current Homepage Structure

- Hero: Dong Design identity, community vision, orbit avatars, and a top-right global update timestamp.
- Hero stats sentence: `过去 7 天，有 xx 位设计师，贡献了 xx 项提效能力。`
- Weekly updates: now titled `本周更新`; should show recent Skill/tool/app updates with task-scene tabs. Each item should keep a `Skill` or `Tool` tag and link to the online Coding repository folder.
- `16.0设计规范md进展`: expresses weekly 16.0 design spec MD progress. It should focus on weekly new counts and category changes, not lifetime progress bars.
- `标杆案例`: currently a lightweight placeholder. Keep it soft and low-emphasis until the content strategy is finalized.
- `本月精选`: selected Skills/tools; current cards are partly placeholders and explicitly marked with `（占位）`.
- Community contribution dynamics: moved to the bottom. The ranking modules are hidden for now.
- Removed or hidden for now: real usage case floor, co-creation floor, old search box and top tabs, tool/designer influence ranking.

## Data Rules

- Use real data whenever possible. Do not display usage count or rating unless the source exists.
- Coding/GitHub repository is the source of truth. Community page is only the presentation layer.
- `community.yaml` is the structured metadata contract used to sync content into the community page.
- Contributions should record people who submitted PRs that were merged. Merging itself is not treated as an extra contribution.
- Usage feedback and real usage process should eventually come from Agent/Zero capabilities, then return to the repository as structured records before being shown in the community.

## Current Community Sync Thinking

The ideal weekly workflow:

1. Human chooses a sync range, such as “past 7 days”.
2. Tooling scans repository changes since the last sync.
3. AI extracts update summaries from `community.yaml`, markdown metadata, PR/issue/commit history, and folder changes.
4. Human operator reviews and adjusts the community presentation.
5. Approved content is published to the community page.

## Open Todos

- Define stable task-scene categories for Skills/tools. Suggested direction: classify by actual design task, not by asset type.
- Replace all placeholder cards in `本月精选` with confirmed repository content.
- Confirm whether `标杆案例` should represent vertical AI workbenches, complex productivity workspaces, or benchmark community cases.
- Build a weekly sync script that outputs changes since the last sync, including author, updated content, and online Coding links.
- Decide how Agent/Zero will produce feedback, issue drafts, usage summaries, and case summaries.
- Add validation for required `community.yaml` fields before content can be shown.
- Keep public demo assets relative so GitHub Pages can load avatars and images correctly.
