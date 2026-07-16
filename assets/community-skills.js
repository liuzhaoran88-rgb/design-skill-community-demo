window.repoCommunitySkills = [
  {
    "schema_version": "1.0",
    "content_type": "skill",
    "id": "relay-to-design-md",
    "name": "Relay 转 Design Wiki",
    "summary": "给一个 Relay 设计稿链接，自动产出 design.md、分配 Wiki 路径、更新追溯索引，并生成交接摘要。",
    "category": "设计知识沉淀",
    "version": "1.0.0",
    "updated_at": "2026-07-08",
    "problem": "设计稿中的规范、结构和经验过去停留在画布里，难以沉淀成可被 AI 理解和复用的组织知识。",
    "scenarios": [
      "16.0 设计规范录入",
      "Relay 设计稿结构化沉淀",
      "Design Wiki 文档建设",
      "设计知识转 Markdown"
    ],
    "owner": {
      "name": "@ShuaiMXu",
      "role": "Skill 创建人"
    },
    "contributors": [
      {
        "name": "@liuzhaoran88-rgb",
        "contribution": "补充 outline confirmation gate，提升使用前确认体验"
      }
    ],
    "contributions": [
      {
        "name": "@ShuaiMXu",
        "avatar_name": "子然",
        "type": "共建",
        "version": "v0.5.1",
        "date": "2026-05-18",
        "pr": "#29",
        "pr_author": "@ShuaiMXu",
        "commit": "2099439",
        "summary": "抽 shared/references 共享真相源，减少跨 Skill 规则漂移。"
      },
      {
        "name": "@ShuaiMXu",
        "avatar_name": "子然",
        "type": "共建",
        "version": "v0.5.1",
        "date": "2026-05-18",
        "pr": "#32",
        "pr_author": "@ShuaiMXu",
        "commit": "5802414",
        "summary": "抽 naming-conflict-rules.md，并让 relay 上游消费。"
      },
      {
        "name": "@ShuaiMXu",
        "avatar_name": "子然",
        "type": "共建",
        "version": "v0.5.1",
        "date": "2026-05-18",
        "pr": "#26",
        "pr_author": "@ShuaiMXu",
        "issue": "#23, #25",
        "commit": "8db422f",
        "summary": "拆分 relay v0.5.1 bundle，并同步 spec-page v0.5 增量更新。"
      },
      {
        "name": "@ShuaiMXu",
        "avatar_name": "子然",
        "type": "维护",
        "version": "v0.5.1",
        "date": "2026-05-18",
        "pr": "#44",
        "pr_author": "@ShuaiMXu",
        "issue": "#41",
        "commit": "b13bd30",
        "summary": "按 Liu review 补齐 relay-to-design-md 的 4 处文档级修补。"
      },
      {
        "name": "@liuzhaoran88-rgb",
        "avatar_name": "林默",
        "type": "共建",
        "version": "v0.5.2",
        "date": "2026-05-19",
        "pr": "#48",
        "pr_author": "@liuzhaoran88-rgb",
        "commit": "2a3ad24",
        "summary": "加入 outline confirmation gate，让生成前先确认结构方向。"
      },
      {
        "name": "@ShuaiMXu",
        "avatar_name": "子然",
        "type": "共建",
        "version": "v0.5.2",
        "date": "2026-05-20",
        "pr": "#55",
        "pr_author": "@ShuaiMXu",
        "issue": "#54",
        "commit": "ca0dd93",
        "summary": "补充切图侦测，并自动登记 _assets-cdn.md。"
      },
      {
        "name": "@ShuaiMXu",
        "avatar_name": "子然",
        "type": "共建",
        "version": "v0.5.3",
        "date": "2026-05-20",
        "pr": "#58",
        "pr_author": "@ShuaiMXu",
        "issue": "#56",
        "commit": "ed8fea7",
        "summary": "加入稿件预检门，降低错误节点直接入库的风险。"
      },
      {
        "name": "@ShuaiMXu",
        "avatar_name": "子然",
        "type": "维护",
        "version": "v0.5.3",
        "date": "2026-05-20",
        "pr": "#59",
        "pr_author": "@ShuaiMXu",
        "issue": "#57",
        "commit": "99c2e6f",
        "summary": "修正 Step 4 契约块字段名，并关闭 issue #57。"
      }
    ],
    "usage": {
      "entry": "Agent / Zero MCP",
      "install": "unzip relay-to-design-md-v1.0.zip -d ~/.claude/skills/",
      "invoke": "用 relay-to-design-md skill，把这个 Relay 设计稿整理成 design.md：{Relay 链接}"
    },
    "cover": {
      "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
      "alt": "设计师用 Agent 把设计稿沉淀成文档",
      "icon": "book-open-check"
    },
    "package": {
      "file": "relay-to-design-md-v1.0.zip",
      "version": "v1.0",
      "updated": "07.08 更新",
      "size": "129KB",
      "prompt": "用 relay-to-design-md skill，把这个 Relay 设计稿整理成 design.md：{Relay 链接}"
    },
    "source": {
      "project": "16.0 设计系统升级",
      "background": "来源于 16.0 APP 大改版后的设计规范建设需求，用于把设计稿中的规范、结构和经验沉淀为 AI 可理解的 Wiki 文档。"
    },
    "relations": {
      "wiki": [
        "16.0 设计系统",
        "Design Wiki 仓库"
      ],
      "zones": [
        "设计规范",
        "设计知识"
      ],
      "related_skills": [
        "design-md-to-spec-page"
      ]
    },
    "feedback": {
      "issue_prompt": "帮我反馈这个问题",
      "suggestion_prompt": "帮我提一个优化建议",
      "contribution_prompt": "帮我把这次优化贡献回去"
    },
    "repo": {
      "name": "2C-DesignWiki",
      "path": ".agents/skills/relay-to-design-md",
      "community_yaml": ".agents/skills/relay-to-design-md/community.yaml"
    },
    "display": {
      "latest_contribution": "@ShuaiMXu · 修正 Step 4 契约块字段名，并关闭 issue #57。"
    }
  }
];
