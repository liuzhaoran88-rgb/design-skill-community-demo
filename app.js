const skills = {
  "spec-check": {
    title: "规范巡检",
    category: "设计走查",
    description: "快速检查设计稿中的间距、颜色与组件使用问题。",
    usage: "842",
    contributors: ["林默", "明越", "子然"],
    preparation: ["选择一个设计文件或页面", "确认使用的组件与规范版本", "运行后逐条确认建议"],
    lifecycle: [
      { version: "v0.1", date: "05.12", name: "林默", action: "从设计规范检查需求创建了 Skill。", outcome: "创建", avatar: "lina.jpg?v=202606221920" },
      { version: "v1.1", date: "05.28", name: "明越", action: "补充组件使用与间距检查规则。", outcome: "共建并合并", avatar: "ming.png?v=202606221920" },
      { version: "v1.3", date: "06.08", name: "阿雅", action: "在两个真实项目中验证，并补充 4 个案例。", outcome: "已验证", avatar: "aya.jpg?v=202606221920" },
      { version: "v1.4", date: "06.21", name: "柯南", action: "提交 8 条可采纳反馈，解决 3 个问题。", outcome: "已合并", avatar: "ke.jpg?v=202606221920" }
    ]
  },
  handoff: {
    title: "交付文档生成器",
    category: "交付协作",
    description: "从设计说明中整理研发需要的关键规则与状态。",
    usage: "516",
    contributors: ["明越", "子然", "乔可"],
    preparation: ["选择一个设计说明或页面", "确认目标平台与组件版本", "生成后核对关键状态与异常分支"],
    lifecycle: [
      { version: "v0.1", date: "05.16", name: "子然", action: "整理研发交付中重复出现的规则，创建了初始版本。", outcome: "创建", avatar: "zi.jpg?v=202606221920" },
      { version: "v1.1", date: "05.30", name: "乔可", action: "补齐异常状态与兼容性说明。", outcome: "共建并合并", avatar: "qiao.jpg?v=202606221920" },
      { version: "v1.2", date: "06.20", name: "明越", action: "在真实交付中验证，并新增 3 个状态示例。", outcome: "已验证", avatar: "ming.png?v=202606221920" }
    ]
  },
  insight: {
    title: "反馈洞察归纳器",
    category: "研究洞察",
    description: "把访谈纪要与用户反馈归纳为可行动的机会点。",
    usage: "128",
    contributors: ["阿雅", "知夏", "然然"],
    preparation: ["上传访谈纪要或结构化用户反馈", "确认需要观察的业务问题", "对输出机会点逐条补充证据"],
    lifecycle: [
      { version: "v0.1", date: "06.02", name: "阿雅", action: "提出反馈归纳需求，并建立初始分类框架。", outcome: "创建", avatar: "aya.jpg?v=202606221920" },
      { version: "v0.2", date: "06.10", name: "知夏", action: "补充反馈聚类规则与高频场景样本。", outcome: "共建并合并", avatar: "zoe.jpg?v=202606221920" },
      { version: "v0.3", date: "06.19", name: "然然", action: "新增 4 个访谈案例，等待下一轮项目验证。", outcome: "Beta 验证中", avatar: "ran.png?v=202606221920" }
    ]
  },
  "design-review": {
    title: "Design Review",
    category: "设计走查",
    badge: "仓库已收录",
    description: "基于 15.0 / 16.0 规范，对 Relay 设计稿或 design.md 进行 Token 合规与体验评判。",
    usage: "仓库已收录",
    contributors: ["xushuai.133"],
    preparationTitle: "适用场景",
    preparation: ["提供 Relay 设计稿链接或 design.md 路径", "用于设计走查、Token 合规检查与体验评判", "输出结构化问题清单、规范依据与修改建议"],
    lifecycleLabel: "1 条版本记录",
    lifecycle: [
      { version: "v0.8", date: "06.12", name: "xushuai.133", action: "接入设计评判标准为 Lens B，形成 Token 合规与设计评判双镜头。", outcome: "仓库提交", avatar: "xushuai.jpg?v=202607151830" }
    ]
  },
  "ruler-annotation": {
    title: "标尺标注",
    category: "设计交付",
    badge: "仓库已收录",
    description: "基于真实节点几何信息，为设计稿生成内容构成与间距尺寸标注。",
    usage: "仓库已收录",
    contributors: ["xushuai.133"],
    preparationTitle: "适用场景",
    preparation: ["提供 Relay、Zero 或 Figma 中的目标设计节点", "选择内容标注或结构标注模式", "标注必须读取真实节点边界，不使用截图估算"],
    lifecycleLabel: "2 条版本记录",
    lifecycle: [
      { version: "v0.3", date: "06.16", name: "xushuai.133", action: "拆分内容标注与结构标注，并补齐双色标尺与盒模型规则。", outcome: "仓库提交", avatar: "xushuai.jpg?v=202607151830" },
      { version: "v0.3", date: "06.17", name: "xushuai.133", action: "补充组件解剖双实例与盒模型标注约定。", outcome: "文档更新", avatar: "xushuai.jpg?v=202607151830" }
    ]
  },
  naming: {
    title: "组件命名助手",
    category: "设计走查",
    description: "按团队规则快速统一组件、图层与变量命名。",
    usage: "36",
    contributors: ["子然", "陈一"],
    preparation: ["选择需要整理的页面或组件库", "确认当前使用的命名规范", "检查建议后再批量应用"],
    lifecycle: [
      { version: "v0.1", date: "06.11", name: "陈一", action: "整理高频组件命名问题，创建了初始版本。", outcome: "创建", avatar: "chen.jpg?v=202606221920" },
      { version: "v0.2", date: "06.18", name: "子然", action: "补齐变量与状态命名规则，并合并到工具中。", outcome: "共建并合并", avatar: "zi.jpg?v=202606221920" }
    ]
  },
  "component-packager": {
    title: "组件封装助手",
    category: "设计系统",
    description: "基于设计稿识别组件结构、状态与可复用属性，生成封装建议。",
    usage: "72",
    contributors: ["陈一", "子然", "明越"],
    preparation: ["选择需要封装的设计稿节点", "确认组件库版本与命名规则", "生成后核对状态、属性和插槽建议"],
    lifecycle: [
      { version: "v0.1", date: "06.12", name: "陈一", action: "从组件封装交付需求中创建了初始 Skill。", outcome: "创建", avatar: "chen.jpg?v=202606221920" },
      { version: "v0.2", date: "06.18", name: "子然", action: "补充弹层、表单和列表的状态识别规则。", outcome: "共建并合并", avatar: "zi.jpg?v=202606221920" },
      { version: "v0.3", date: "06.23", name: "明越", action: "在真实设计稿中验证封装建议，并补齐属性命名示例。", outcome: "已验证", avatar: "ming.png?v=202606221920" }
    ]
  },
  "icon-generator": {
    title: "Icon 规范生成器",
    category: "设计系统",
    description: "基于 16.0 规范生成线性图标方案，并检查描边、圆角与视觉重心。",
    usage: "49",
    contributors: ["阿雅", "乔可", "林默"],
    preparation: ["输入图标语义和使用场景", "确认 16.0 图标规范与尺寸", "生成后检查识别度和视觉一致性"],
    lifecycle: [
      { version: "v0.1", date: "06.09", name: "阿雅", action: "提出基于规范快速生成 Icon 的需求。", outcome: "Idea", avatar: "aya.jpg?v=202606221920" },
      { version: "v0.2", date: "06.17", name: "乔可", action: "补充描边、圆角和安全区检查规则。", outcome: "共建并合并", avatar: "qiao.jpg?v=202606221920" },
      { version: "v0.3", date: "06.22", name: "林默", action: "验证 8 个真实图标场景，沉淀为 16.0 示例。", outcome: "已验证", avatar: "lina.jpg?v=202606221920" }
    ]
  },
  "copy-check": {
    title: "文案长度预检",
    category: "交付协作",
    description: "交付前识别可能出现截断、换行或溢出的页面文案。",
    usage: "54",
    contributors: ["明越", "乔可", "柯南", "阿雅"],
    preparation: ["选择需要检查的页面范围", "确认目标端与最小屏幕规格", "为关键文案补充预期状态"],
    lifecycle: [
      { version: "v0.1", date: "06.07", name: "阿雅", action: "提出多语言交付中的文案风险，并提交初始案例。", outcome: "Idea", avatar: "aya.jpg?v=202606221920" },
      { version: "v0.2", date: "06.16", name: "明越", action: "补充移动端溢出规则与交付场景。", outcome: "共建并合并", avatar: "ming.png?v=202606221920" },
      { version: "v0.3", date: "06.21", name: "柯南", action: "验证 3 个关键页面，并提交兼容性反馈。", outcome: "已验证", avatar: "ke.jpg?v=202606221920" }
    ]
  },
  "change-log": {
    title: "版本差异摘要",
    category: "交付协作",
    description: "将设计稿的版本变更整理成研发可以快速阅读的更新说明。",
    usage: "28",
    contributors: ["乔可", "明越"],
    preparation: ["选择需要对比的两个版本", "确认需要同步的开发范围", "核对自动提炼的变更说明"],
    lifecycle: [
      { version: "v0.1", date: "06.09", name: "乔可", action: "从研发同步需求中提炼出版本差异摘要的基本规则。", outcome: "创建", avatar: "qiao.jpg?v=202606221920" },
      { version: "v0.2", date: "06.20", name: "明越", action: "补充状态变更与异常分支的描述方式。", outcome: "共建并合并", avatar: "ming.png?v=202606221920" }
    ]
  },
  "vibe-ui-scaffold": {
    title: "UI 快速搭建",
    category: "Vibe Coding",
    description: "把一句产品想法拆成可运行的页面结构、组件和初始交互。",
    usage: "64",
    contributors: ["陈一", "子然", "明越"],
    preparation: ["描述页面目标和主要用户", "补充已有组件库或技术栈", "确认先做静态稿还是可交互版本"],
    lifecycle: [
      { version: "v0.1", date: "06.13", name: "陈一", action: "从日常原型搭建需求创建了初始模板。", outcome: "创建", avatar: "chen.jpg?v=202606221920" },
      { version: "v0.2", date: "06.19", name: "子然", action: "补充 React 与静态 HTML 两种输出分支。", outcome: "共建并合并", avatar: "zi.jpg?v=202606221920" },
      { version: "v0.3", date: "06.22", name: "明越", action: "在真实页面中验证布局规则，补充响应式检查项。", outcome: "已验证", avatar: "ming.png?v=202606221920" }
    ]
  },
  "vibe-component-wiring": {
    title: "组件接线助手",
    category: "Vibe Coding",
    description: "整理组件状态、事件、数据流和空/错/加载态，让页面从能看变成能用。",
    usage: "52",
    contributors: ["林默", "乔可", "柯南"],
    preparation: ["提供页面组件清单", "说明数据来源和交互事件", "标出必须覆盖的异常状态"],
    lifecycle: [
      { version: "v0.1", date: "06.10", name: "林默", action: "把状态接线经验整理成 Skill 初版。", outcome: "创建", avatar: "lina.jpg?v=202606221920" },
      { version: "v0.2", date: "06.17", name: "乔可", action: "加入空态、错误态和重试行为的检查规则。", outcome: "共建并合并", avatar: "qiao.jpg?v=202606221920" },
      { version: "v0.3", date: "06.22", name: "柯南", action: "提交 5 条真实接线反馈，已合并到最新版本。", outcome: "已合并", avatar: "ke.jpg?v=202606221920" }
    ]
  },
  "vibe-mock-data": {
    title: "Mock 数据生成器",
    category: "Vibe Coding",
    description: "根据页面字段和场景快速生成贴近真实业务的演示数据。",
    usage: "47",
    contributors: ["阿雅", "知夏"],
    preparation: ["贴出页面字段或接口样例", "说明业务场景和数据规模", "标出需要覆盖的边界数据"],
    lifecycle: [
      { version: "v0.1", date: "06.12", name: "阿雅", action: "提出真实演示数据需求，并补充样例字段。", outcome: "Idea", avatar: "aya.jpg?v=202606221920" },
      { version: "v0.2", date: "06.18", name: "知夏", action: "补齐边界值、空数据和异常数据生成规则。", outcome: "共建并合并", avatar: "zoe.jpg?v=202606221920" }
    ]
  },
  "vibe-prompt-tuner": {
    title: "Prompt 调参器",
    category: "Vibe Coding",
    description: "把模糊的编码需求整理成更清晰、可执行、可复用的 Agent 提示。",
    usage: "38",
    contributors: ["子然", "阿雅"],
    preparation: ["粘贴当前提示词或需求描述", "说明期望输出和约束", "补充失败样例或不满意结果"],
    lifecycle: [
      { version: "v0.1", date: "06.14", name: "子然", action: "整理常见 Vibe Coding 提示词问题，创建初始版本。", outcome: "创建", avatar: "zi.jpg?v=202606221920" },
      { version: "v0.2", date: "06.21", name: "阿雅", action: "补充失败样例归因和改写策略。", outcome: "已验证", avatar: "aya.jpg?v=202606221920" }
    ]
  },
  "vibe-bug-report": {
    title: "Bug 复现说明",
    category: "Vibe Coding",
    description: "把零散的问题描述整理成可复现步骤、预期结果和修复线索。",
    usage: "41",
    contributors: ["柯南", "乔可", "明越"],
    preparation: ["描述问题现象和触发路径", "提供截图、日志或控制台报错", "说明期望行为和影响范围"],
    lifecycle: [
      { version: "v0.1", date: "06.08", name: "柯南", action: "从日常调试记录中创建复现说明模板。", outcome: "创建", avatar: "ke.jpg?v=202606221920" },
      { version: "v0.2", date: "06.18", name: "乔可", action: "补充日志、截图和最小复现的结构化字段。", outcome: "共建并合并", avatar: "qiao.jpg?v=202606221920" },
      { version: "v0.3", date: "06.22", name: "明越", action: "验证 4 个真实 Bug，并补齐修复线索写法。", outcome: "已验证", avatar: "ming.png?v=202606221920" }
    ]
  },
  "vibe-pr-summary": {
    title: "PR 摘要生成器",
    category: "Vibe Coding",
    description: "把代码改动整理成清晰的 PR 摘要、风险点和验证清单。",
    usage: "59",
    contributors: ["林默", "陈一"],
    preparation: ["提供 diff、提交记录或改动说明", "说明本次改动目标", "补充已完成的验证方式"],
    lifecycle: [
      { version: "v0.1", date: "06.09", name: "林默", action: "整理发布前 PR 说明模板，创建初版 Skill。", outcome: "创建", avatar: "lina.jpg?v=202606221920" },
      { version: "v0.2", date: "06.20", name: "陈一", action: "补充风险点、回滚和验证清单输出。", outcome: "共建并合并", avatar: "chen.jpg?v=202606221920" }
    ]
  }
};

const skillCases = {
  "spec-check": [
    { title: "上线前检查移动端首页间距", summary: "AI 从一次真实使用中提炼：设计师在交付前批量检查 18 个页面，发现 6 处间距和颜色 token 偏差，并把修复建议同步给研发。", source: "AI 摘要 · 设计师已确认", result: "减少 1 轮视觉返工" },
    { title: "组件替换后的规范复查", summary: "团队在组件升级后用 Skill 复查按钮、卡片和弹层状态，补充了 4 条可复用检查规则。", source: "来自一次验证反馈", result: "贡献回 v1.4" }
  ],
  handoff: [
    { title: "把会员权益页整理成研发交付说明", summary: "AI 摘要显示：设计师把页面结构、状态说明和异常分支交给 Skill 整理，生成研发可直接阅读的 Markdown 交付稿。", source: "AI 摘要 · 设计师已确认", result: "交付说明压缩到 12 分钟" },
    { title: "补齐弹层状态和边界说明", summary: "在真实交付中，Skill 自动识别出缺少空态、失败态和加载态说明，并形成新的状态示例。", source: "来自交付协作记录", result: "合并至 v1.2" }
  ],
  insight: [
    { title: "把 24 条用户访谈整理成机会点", summary: "研究同学导入访谈纪要后，Skill 自动聚类痛点、证据和机会点，帮助团队更快进入方案讨论。", source: "AI 摘要 · 用研已确认", result: "沉淀 5 个机会点" },
    { title: "售后反馈归因分析", summary: "团队把客服反馈和开放题答案合并输入，Skill 提炼出高频阻塞点，并标注每条结论的证据来源。", source: "来自一次真实使用", result: "补充 4 个案例" }
  ],
  "design-review": [],
  "ruler-annotation": [],
  naming: [
    { title: "组件库图层命名批量统一", summary: "设计师选择 3 组组件页面后，Skill 识别出重复命名、业务语义缺失和状态后缀不一致问题。", source: "AI 摘要 · 设计师已确认", result: "统一 126 个图层" },
    { title: "变量命名迁移前检查", summary: "在变量体系升级前，Skill 生成新旧命名对照表，减少人工逐个核对的成本。", source: "来自组件库维护记录", result: "减少 1 次漏改" }
  ],
  "component-packager": [
    { title: "基于设计稿一键封装组件", summary: "设计师把弹层、表单和列表状态交给 Skill 识别，自动拆出组件结构、状态命名和可复用属性。", source: "AI 摘要 · 设计师已确认", result: "减少人工整理成本" },
    { title: "沉淀业务卡片的可复用属性", summary: "Skill 从真实业务卡片里识别出标题、标签、操作区和空状态插槽，生成组件封装建议。", source: "来自组件共建记录", result: "补齐属性命名示例" }
  ],
  "icon-generator": [
    { title: "自动基于 16.0 规范生成 Icon", summary: "设计师输入业务含义和使用位置后，Skill 按 16.0 规范生成线性图标方案，并检查描边、圆角和视觉重心。", source: "AI 摘要 · 来自真实使用", result: "生成 8 个图标初稿" },
    { title: "图标入库前的一致性检查", summary: "团队用 Skill 检查安全区、端点处理和视觉重心，把不符合规范的图标提前拦截。", source: "来自设计系统维护记录", result: "沉淀为 16.0 示例" }
  ],
  "copy-check": [
    { title: "交付前检查多语言文案溢出", summary: "设计师在移动端页面交付前运行 Skill，提前发现长文案、按钮文案和 Tab 文案的截断风险。", source: "AI 摘要 · 设计师已确认", result: "替换 9 条高风险文案" },
    { title: "小屏适配文案预检", summary: "团队把小屏规格作为约束输入后，Skill 标出 4 个最容易换行的标题和价格说明。", source: "来自兼容性反馈", result: "贡献回 v0.3" }
  ],
  "change-log": [
    { title: "把设计稿改版整理成研发更新说明", summary: "设计师对比两个版本后，Skill 自动归纳组件变化、状态变化和视觉微调，减少研发反复追问。", source: "AI 摘要 · 设计师已确认", result: "同步时间减少 30 分钟" },
    { title: "上线前补充变更风险", summary: "Skill 从版本差异里识别出影响埋点和接口字段的变化，并加入交付清单。", source: "来自研发协作记录", result: "补齐风险说明" }
  ],
  "vibe-ui-scaffold": [
    { title: "一句需求生成活动页初稿", summary: "设计师输入页面目标和用户路径后，Skill 自动拆出页面结构、主要组件和响应式布局。", source: "AI 摘要 · 已确认", result: "15 分钟得到可运行稿" },
    { title: "把低保真想法转成可交互 Demo", summary: "团队用 Skill 快速生成可点击页面，再根据真实体验补充状态和边界情况。", source: "来自 Vibe Coding 记录", result: "补充响应式规则" }
  ],
  "vibe-component-wiring": [
    { title: "把页面从能看接到能用", summary: "开发前用 Skill 梳理组件事件、数据流和加载状态，避免后续遗漏空态与错误态。", source: "AI 摘要 · 已确认", result: "补齐 5 个状态" },
    { title: "复杂筛选面板的状态接线", summary: "Skill 把筛选、重置、分页和接口失败串成清晰状态图，方便继续交给 Agent 实现。", source: "来自共建反馈", result: "合并至 v0.3" }
  ],
  "vibe-mock-data": [
    { title: "给数据看板生成演示数据", summary: "设计师输入字段和业务范围后，Skill 生成正常、空、异常和边界数据，帮助页面更早进入验证。", source: "AI 摘要 · 已确认", result: "覆盖 4 类数据状态" },
    { title: "补齐本地化演示样例", summary: "团队用 Skill 生成不同长度、不同币种和不同地区的数据，提前发现布局风险。", source: "来自真实使用", result: "补齐边界规则" }
  ],
  "vibe-prompt-tuner": [
    { title: "把模糊需求改成可执行提示", summary: "设计师把原始需求交给 Skill 整理后，输出目标、输入、约束和验收标准，Agent 执行更稳定。", source: "AI 摘要 · 已确认", result: "减少反复追问" },
    { title: "失败提示词复盘", summary: "团队把不满意的生成结果和原提示一起输入，Skill 归因失败原因并给出下一版提示。", source: "来自调参记录", result: "沉淀改写策略" }
  ],
  "vibe-bug-report": [
    { title: "把零散报错整理成复现说明", summary: "Skill 根据截图、路径和控制台信息生成复现步骤、预期结果和实际结果，方便定位问题。", source: "AI 摘要 · 已确认", result: "减少沟通来回" },
    { title: "补齐最小复现线索", summary: "团队用 Skill 从多条反馈中提炼共同触发条件，形成更清楚的修复输入。", source: "来自修复协作记录", result: "补充日志字段" }
  ],
  "vibe-pr-summary": [
    { title: "把代码改动整理成 PR 摘要", summary: "Skill 读取 diff 后自动整理改动概览、影响范围和验证清单，让 Review 更快聚焦风险。", source: "AI 摘要 · 已确认", result: "Review 时间缩短" },
    { title: "发布前风险点复核", summary: "团队在合并前用 Skill 补充回滚说明和验证路径，减少遗漏。", source: "来自发布协作记录", result: "补齐风险清单" }
  ]
};

const designerAvatars = {
  "@ShuaiMXu": "xushuai.jpg?v=202607151830",
  "ShuaiMXu": "xushuai.jpg?v=202607151830",
  "xushuai": "xushuai.jpg?v=202607151830",
  "xushuai.133": "xushuai.jpg?v=202607151830",
  "@liuzhaoran88-rgb": "liuzhaoran.jpg?v=202607091310",
  "liuzhaoran88-rgb": "liuzhaoran.jpg?v=202607091310",
  "liuzhaoran": "liuzhaoran.jpg?v=202607091310",
  "wangyutong.72": "wangyutong.jpg?v=202607091310",
  "wangyutong": "wangyutong.jpg?v=202607091310",
  "tonglingxi.1": "tonglingxi.jpg?v=202607091310",
  "tonglingxi": "tonglingxi.jpg?v=202607091310",
  "gaojiamin.10": "gaojiamin.jpg?v=202607091310",
  "gaojiamin": "gaojiamin.jpg?v=202607091310",
  "liuyewei.5": "liuyewei.jpg?v=202607091310",
  "liuyewei": "liuyewei.jpg?v=202607091310",
  "zhaiyouyi1": "zhaiyouyi.jpg?v=202607091310",
  "zhaiyouyi": "zhaiyouyi.jpg?v=202607091310",
  "zhangfengyi.687": "zhangfengyi.jpg?v=202607091310",
  "zhangfengyi": "zhangfengyi.jpg?v=202607091310",
  "林默": "lina.jpg?v=202606221920",
  "明越": "ming.png?v=202606221920",
  "子然": "zi.jpg?v=202606221920",
  "乔可": "qiao.jpg?v=202606221920",
  "阿雅": "aya.jpg?v=202606221920",
  "知夏": "zoe.jpg?v=202606221920",
  "然然": "ran.png?v=202606221920",
  "陈一": "chen.jpg?v=202606221920",
  "柯南": "ke.jpg?v=202606221920"
};

const pageLabels = { discover: "发现", requests: "共创需求", workspace: "我的工作台", collection: "我的收藏" };
const relayExampleLink = "[https://relay.jd.com/file/design?id=XXX&page_id=YYY&node_id=ZZZ](https://relay.jd.com/file/design?id=XXX&page_id=YYY&node_id=ZZZ)";
const skillPackages = {
  "spec-check": {
    skillName: "design-spec-check",
    file: "design-spec-check-v1.4.zip",
    version: "v1.4",
    updated: "06.21 更新",
    size: "690B",
    prompt: `用 design-spec-check skill，检查这个设计稿的间距、颜色与组件使用问题：\n${relayExampleLink}\n\n要求：按严重程度列出问题，给出规范依据和可执行修复建议。`
  },
  handoff: {
    skillName: "handoff-document-generator",
    file: "handoff-document-generator-v1.2.zip",
    version: "v1.2",
    updated: "06.20 更新",
    size: "728B",
    prompt: `用 handoff-document-generator skill，把这个设计稿整理成研发交付说明：\n${relayExampleLink}\n\n要求：白底文字转 Markdown 文字，灰底示例区转截图穿插。\n目标标题：“{标题}”。`
  },
  insight: {
    skillName: "feedback-insight-synthesizer",
    file: "feedback-insight-synthesizer-v0.3.zip",
    version: "v0.3",
    updated: "06.19 更新",
    size: "705B",
    prompt: "用 feedback-insight-synthesizer skill，归纳这组访谈纪要和用户反馈：\n[粘贴反馈内容或文档链接]\n\n要求：按主题、证据、机会点三层输出，并标出每个机会点的信心程度。"
  },
  "design-review": {
    skillName: "design-review",
    file: "design-review-v0.8.zip",
    version: "v0.8",
    updated: "06.12 更新",
    size: "27KB",
    prompt: `用 design-review skill，评审这个 Relay 设计稿或 design.md：\n${relayExampleLink}\n\n要求：分别检查 Token 合规与设计判断，输出问题、依据、严重程度和修改建议。`
  },
  "ruler-annotation": {
    skillName: "ruler-annotation",
    file: "ruler-annotation-v0.3.zip",
    version: "v0.3",
    updated: "06.17 更新",
    size: "27KB",
    prompt: `用 ruler-annotation skill，为这个设计稿生成标注：\n${relayExampleLink}\n\n要求：读取真实节点边界，分别输出内容构成标注与间距尺寸标注。`
  },
  naming: {
    skillName: "component-naming-assistant",
    file: "component-naming-assistant-v0.2.zip",
    version: "v0.2",
    updated: "06.18 更新",
    size: "698B",
    prompt: `用 component-naming-assistant skill，检查这个设计稿里的组件、图层和变量命名：\n${relayExampleLink}\n\n要求：保留业务语义，输出问题命名、建议命名和修改原因。`
  },
  "component-packager": {
    skillName: "component-packager",
    file: "component-packager-v0.3.zip",
    version: "v0.3",
    updated: "06.23 更新",
    size: "704B",
    prompt: `用 component-packager skill，基于这个设计稿一键生成组件封装建议：\n${relayExampleLink}\n\n要求：拆出组件结构、状态、属性、插槽和命名建议，并标注需要人工确认的边界。`
  },
  "icon-generator": {
    skillName: "icon-16-generator",
    file: "icon-16-generator-v0.3.zip",
    version: "v0.3",
    updated: "06.22 更新",
    size: "688B",
    prompt: "用 icon-16-generator skill，基于 16.0 规范生成这个图标方案：\n[输入图标语义、使用位置和尺寸]\n\n要求：给出线性图标方案，并检查描边、圆角、安全区和视觉重心。"
  },
  "copy-check": {
    skillName: "copy-length-precheck",
    file: "copy-length-precheck-v0.3.zip",
    version: "v0.3",
    updated: "06.21 更新",
    size: "679B",
    prompt: `用 copy-length-precheck skill，检查这个设计稿里的文案长度和溢出风险：\n${relayExampleLink}\n\n要求：覆盖移动端、小屏和本地化场景，给出高风险文案的替换建议。`
  },
  "change-log": {
    skillName: "version-diff-summary",
    file: "version-diff-summary-v0.2.zip",
    version: "v0.2",
    updated: "06.20 更新",
    size: "684B",
    prompt: `用 version-diff-summary skill，对比这个设计稿的两个版本，并生成研发更新说明：\n${relayExampleLink}\n\n要求：按页面、组件、交互状态分组，区分视觉微调和需求变化。`
  },
  "vibe-ui-scaffold": {
    skillName: "vibe-ui-scaffold",
    file: "vibe-ui-scaffold-v0.3.zip",
    version: "v0.3",
    updated: "06.22 更新",
    size: "709B",
    prompt: "用 vibe-ui-scaffold skill，把这个产品想法搭成一个可运行的前端页面：\n[粘贴需求描述]\n\n要求：优先复用现有组件风格，补齐响应式状态，并给出可继续迭代的文件结构。"
  },
  "vibe-component-wiring": {
    skillName: "vibe-component-wiring",
    file: "vibe-component-wiring-v0.3.zip",
    version: "v0.3",
    updated: "06.22 更新",
    size: "696B",
    prompt: "用 vibe-component-wiring skill，帮我把这个页面的组件状态、事件和数据流接顺：\n[粘贴组件结构或代码]\n\n要求：覆盖加载、空态、错误、成功和重试状态。"
  },
  "vibe-mock-data": {
    skillName: "vibe-mock-data",
    file: "vibe-mock-data-v0.2.zip",
    version: "v0.2",
    updated: "06.18 更新",
    size: "676B",
    prompt: "用 vibe-mock-data skill，根据这些字段生成一组可用于页面演示的 Mock 数据：\n[粘贴字段或接口样例]\n\n要求：包含正常数据、边界数据、空数据和异常数据。"
  },
  "vibe-prompt-tuner": {
    skillName: "vibe-prompt-tuner",
    file: "vibe-prompt-tuner-v0.2.zip",
    version: "v0.2",
    updated: "06.21 更新",
    size: "698B",
    prompt: "用 vibe-prompt-tuner skill，帮我优化这个 Vibe Coding 提示词：\n[粘贴当前提示词]\n\n要求：让目标、约束、输入、输出和验收标准更清楚。"
  },
  "vibe-bug-report": {
    skillName: "vibe-bug-report",
    file: "vibe-bug-report-v0.3.zip",
    version: "v0.3",
    updated: "06.22 更新",
    size: "683B",
    prompt: "用 vibe-bug-report skill，把这个问题整理成可复现的 Bug 说明：\n[粘贴问题现象、日志或截图描述]\n\n要求：输出复现步骤、预期结果、实际结果、可能原因和验证建议。"
  },
  "vibe-pr-summary": {
    skillName: "vibe-pr-summary",
    file: "vibe-pr-summary-v0.2.zip",
    version: "v0.2",
    updated: "06.20 更新",
    size: "656B",
    prompt: "用 vibe-pr-summary skill，根据这段 diff 或提交记录生成 PR 摘要：\n[粘贴 diff 或 commit log]\n\n要求：包含改动概览、影响范围、风险点和验证清单。"
  }
};

const repoCommunitySkills = Array.isArray(window.repoCommunitySkills) ? window.repoCommunitySkills : [];
const CODING_REPO_BASE = "http://jagile.jd.com/codingRoot/JD-Design-Wiki/2C-DesignWiki/tree/main/";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatRepoDate(value) {
  if (!value) return "仓库同步";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[2]}.${match[3]} 更新` : value;
}

function formatLifecycleDate(value) {
  if (!value) return "今天";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[2]}.${match[3]}` : value;
}

function getAvatarFor(name) {
  const normalized = String(name || "").trim();
  const noAt = normalized.replace(/^@/, "");
  return designerAvatars[normalized]
    ?? designerAvatars[noAt]
    ?? designerAvatars[`@${noAt}`]
    ?? designerAvatars["子然"]
    ?? designerAvatars["林默"];
}

function getMergedPrContributions(record) {
  return (record.contributions || []).filter((item) => item.pr);
}

function getContributionName(item, fallback = "仓库贡献者") {
  return item?.name || item?.pr_author || fallback;
}

function getRepoUsageCount(record) {
  return `${getMergedPrContributions(record).length} 个已合并 PR`;
}

function getRepoUsageLabel(record) {
  const mergedCount = getMergedPrContributions(record).length;
  return mergedCount ? `已合并 PR ${mergedCount}` : "仓库同步";
}

function getCodingUrlFromPath(path) {
  if (!path) return "";
  return `${CODING_REPO_BASE}${path.split("/").map((part) => encodeURIComponent(part)).join("%2F")}`;
}

function openSkillRepository(id) {
  const url = skills[id]?.detailUrl || skills[id]?.repoUrl || CODING_REPO_BASE;
  window.open(url, "_blank", "noopener,noreferrer");
}

function registerRepoSkill(record) {
  const ownerName = record.owner?.name || "仓库维护者";
  const contributorNames = [
    ownerName,
    ...(record.contributors || []).map((item) => item.name).filter(Boolean)
  ].filter((name, index, array) => name && array.indexOf(name) === index);
  const contributionEvents = record.contributions?.length
    ? record.contributions
    : [
        {
          version: record.package?.version || `v${record.version}`,
          date: record.updated_at,
          name: ownerName,
          avatar_name: "子然",
          summary: "补充 community.yaml，让 Skill 可以被社区识别和同步。",
          type: "社区化入库"
        }
      ];

  skills[record.id] = {
    title: record.name,
    category: record.category || "仓库同步",
    badge: "仓库同步",
    description: record.summary || record.problem,
    detailUrl: record.repo?.url || getCodingUrlFromPath(record.repo?.path),
    usage: getRepoUsageCount(record),
    contributors: contributorNames.length ? contributorNames : [ownerName],
    preparationTitle: "适用场景",
    preparation: record.scenarios?.length ? record.scenarios : [record.problem || record.summary],
    lifecycleLabel: record.contributions?.length ? `${record.contributions.length} 条 PR 记录` : `${contributionEvents.length} 条仓库记录`,
    lifecycle: contributionEvents.map((item) => ({
      version: item.version || record.package?.version || `v${record.version}`,
      date: formatLifecycleDate(item.date || record.updated_at),
      name: getContributionName(item, ownerName),
      action: item.pr
        ? `${item.pr} · ${item.summary || item.contribution || "完成一次仓库贡献。"}`
        : item.summary || item.contribution || "完成一次仓库贡献。",
      outcome: item.pr ? `${item.type || "贡献"} · 已合并 PR` : item.type || "贡献记录",
      avatar: getAvatarFor(item.name || item.pr_author || item.avatar_name || ownerName)
    }))
  };

  skillPackages[record.id] = {
    skillName: record.id,
    file: record.package?.file || `${record.id}.zip`,
    version: record.package?.version || `v${record.version}`,
    updated: record.package?.updated || formatRepoDate(record.updated_at),
    size: record.package?.size || "仓库同步",
    prompt: record.package?.prompt || record.usage?.invoke || `用 ${record.id} skill，完成这次设计任务：{任务说明}`
  };

  skillCases[record.id] = record.cases?.length
    ? record.cases.map((item) => ({
        title: item.title,
        summary: item.summary,
        source: item.source || "仓库记录 · community.yaml",
        result: item.result || "可被社区发现"
      }))
    : [];
}

function renderFeaturedRepoSkill(record) {
  const card = document.querySelector("#skill-grid .skill-card:first-child");
  if (!card || !record) return;
  // 专区里的 relay 条目：同步真实标题（选择器命中失败也不影响原卡）
  document.querySelectorAll(`.collection-item[data-skill="${record.id}"] .collection-item-title`).forEach((el) => {
    el.textContent = record.name;
  });
  const skillButton = card.querySelector(".cover-button");
  const coverImage = card.querySelector(".cover-button img");
  const coverOverlay = card.querySelector(".cover-overlay");
  const meta = card.querySelector(".card-meta");
  const title = card.querySelector("h3");
  const description = card.querySelector(".skill-card-body > p");
  const contribution = card.querySelector(".last-contribution");
  const usage = card.querySelector(".usage");
  const bookmark = card.querySelector("[data-bookmark]");
  const mergedPrContributions = getMergedPrContributions(record);
  const latest = mergedPrContributions[mergedPrContributions.length - 1] || record.contributions?.[record.contributions.length - 1];
  card.querySelector(".community-proof")?.remove();

  card.dataset.category = "review";
  card.dataset.skill = record.id;
  skillButton.dataset.openSkill = record.id;
  skillButton.setAttribute("aria-label", `查看 ${record.name} Skill 详情`);
  coverImage.src = record.cover?.image || coverImage.src;
  coverImage.alt = record.cover?.alt || record.name;
  coverOverlay.innerHTML = `<i data-lucide="${escapeHtml(record.cover?.icon || "book-open-check")}" aria-hidden="true"></i>`;
  meta.innerHTML = `<span>${escapeHtml(record.category || "Skill")}</span><span class="verified"><i data-lucide="badge-check" aria-hidden="true"></i> PR 已合并</span>`;
  title.textContent = record.name;
  description.textContent = record.summary;
  contribution.innerHTML = `
    <img class="avatar avatar-s photo-avatar" src="assets/avatars/${escapeHtml(getAvatarFor(getContributionName(latest, record.owner?.name) || latest?.avatar_name))}" alt="${escapeHtml(getContributionName(latest, record.owner?.name || ""))}" />
    <p>
      <span>${escapeHtml(latest?.pr ? `${latest.type || "贡献"} ${latest.pr}` : latest?.type || "最新贡献")} <time>${escapeHtml(formatLifecycleDate(latest?.date || record.updated_at))}</time></span>
      <strong>${escapeHtml(getContributionName(latest, record.owner?.name || "仓库维护者"))} · ${escapeHtml(latest?.summary || record.display?.latest_contribution || "完成仓库同步")}</strong>
    </p>
  `;
  usage.textContent = getRepoUsageLabel(record);
  if (bookmark) bookmark.setAttribute("aria-label", `收藏${record.name}`);
  renderIcons();
}

function initRepoCommunitySkills() {
  repoCommunitySkills.forEach(registerRepoSkill);
  renderFeaturedRepoSkill(repoCommunitySkills[0]);
}
const drawer = document.querySelector("#skill-drawer");
const modal = document.querySelector("#skill-modal");
const installModal = document.querySelector("#install-modal");
const philosophyModal = document.querySelector("#philosophy-modal");
const toast = document.querySelector("#toast");
let toastTimeout;
let activeSkillId = "spec-check";

function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }
}

function renderDongLogo() {
  const logo = document.querySelector("#dong-logo");
  const source = new Image();
  source.addEventListener("load", () => {
    const size = 512;
    const cropSize = Math.min(source.naturalWidth, source.naturalHeight) * 0.64;
    const cropX = (source.naturalWidth - cropSize) / 2;
    const cropY = source.naturalHeight * 0.18;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(source, cropX, cropY, cropSize, cropSize, 0, 0, size, size);

    const pixels = context.getImageData(0, 0, size, size);
    for (let index = 0; index < pixels.data.length; index += 4) {
      const red = pixels.data[index];
      const green = pixels.data[index + 1];
      const blue = pixels.data[index + 2];
      if (green > 115 && green > red * 1.35 && green > blue * 1.28) {
        pixels.data[index + 3] = 0;
      }
    }
    context.putImageData(pixels, 0, 0);
    logo.src = canvas.toDataURL("image/png");
    logo.classList.add("ready");
  });
  source.src = "assets/dong-design-logo-source.png";
}

function showToast(message) {
  document.querySelector("#toast-text").textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function getPackageUrl(packageInfo) {
  return `assets/packages/${packageInfo.file}`;
}

function getInstallCommand(packageInfo) {
  return `unzip ${packageInfo.file} -d ~/.claude/skills/`;
}

function getCaseOwner(skill, index) {
  const name = skill.contributors[index % skill.contributors.length] ?? "林默";
  return { name, avatar: getAvatarFor(name) };
}

function getSkillContributorAvatars(skill) {
  const lifecycleContributors = (skill.lifecycle || [])
    .map((event) => ({
      name: event.name,
      avatar: event.avatar || getAvatarFor(event.name)
    }))
    .filter((item) => item.name && item.avatar);
  const listedContributors = (skill.contributors || [])
    .map((name) => ({ name, avatar: getAvatarFor(name) }))
    .filter((item) => item.name && item.avatar);
  const contributors = lifecycleContributors.length ? lifecycleContributors : listedContributors;
  return contributors.filter((item, index, array) => array.findIndex((entry) => entry.name === item.name) === index);
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => copyTextFallback(text));
  }
  return Promise.resolve(copyTextFallback(text));
}

function copyTextFallback(text) {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  field.remove();
  return copied;
}

function downloadPackage(packageInfo) {
  const link = document.createElement("a");
  link.href = getPackageUrl(packageInfo);
  link.download = packageInfo.file;
  document.body.append(link);
  link.click();
  link.remove();
}

function renderInstallModal(id) {
  const skill = skills[id];
  const packageInfo = skillPackages[id];
  if (!skill || !packageInfo) return;
  const command = getInstallCommand(packageInfo);
  document.querySelector("#install-title").textContent = `安装 ${skill.title}`;
  document.querySelector("#install-package-name").textContent = packageInfo.file;
  document.querySelector("#install-package-meta").textContent = `最新版本 ${packageInfo.version} · ${packageInfo.updated} · ${packageInfo.size}`;
  document.querySelector("#install-command").textContent = command;
  document.querySelector("#install-prompt").textContent = packageInfo.prompt;
  const redownload = document.querySelector("#install-redownload");
  redownload.href = getPackageUrl(packageInfo);
  redownload.download = packageInfo.file;
}

function useSkill(id) {
  const packageInfo = skillPackages[id];
  if (!packageInfo) return;
  activeSkillId = id;
  renderInstallModal(id);
  drawer.close();
  installModal.showModal();
}

async function installAndCopy(id) {
  const packageInfo = skillPackages[id];
  if (!packageInfo) return;
  downloadPackage(packageInfo);
  const copied = await copyText(getInstallCommand(packageInfo));
  showToast(copied ? "安装包已下载，命令已复制" : "安装包已下载，请手动复制命令");
}

function changeView(view) {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === view);
  });
  window.location.hash = view;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openDrawer(id) {
  const skill = skills[id];
  if (!skill) return;
  activeSkillId = id;
  const packageInfo = skillPackages[id];
  document.querySelector("#drawer-title").textContent = skill.title;
  document.querySelector("#drawer-category").textContent = skill.category;
  const drawerBadge = document.querySelector(".drawer-label .verified");
  drawerBadge.innerHTML = `<i data-lucide="badge-check" aria-hidden="true"></i> ${escapeHtml(skill.badge || "已验证")}`;
  document.querySelector("#drawer-description").textContent = skill.description;
  document.querySelector("#drawer-preparation-title").textContent = skill.preparationTitle || "使用前准备";
  const contributorAvatars = getSkillContributorAvatars(skill);
  document.querySelector("#drawer-contributor-avatars").innerHTML = contributorAvatars.map((item) => `
    <img class="avatar drawer-stat-avatar photo-avatar" src="assets/avatars/${escapeHtml(item.avatar)}" alt="${escapeHtml(item.name)}" title="${escapeHtml(item.name)}" />
  `).join("");
  const cases = skillCases[id] ?? [];
  const caseSection = document.querySelector(".drawer-cases");
  caseSection.hidden = !cases.length;
  document.querySelector("#drawer-case-count").textContent = `${cases.length} 个案例`;
  document.querySelector("#drawer-case-list").innerHTML = cases.map((item, index) => {
    const owner = getCaseOwner(skill, index);
    return `
    <article class="drawer-case">
      <img class="avatar drawer-case-avatar photo-avatar" src="assets/avatars/${owner.avatar}" alt="${owner.name}" />
      <div>
        <span>${owner.name} · ${item.source}</span>
        <h4>${item.title}</h4>
        <p>${item.summary}</p>
      </div>
      <strong>${item.result}</strong>
    </article>
  `;
  }).join("");
  document.querySelector("#drawer-preparation").innerHTML = skill.preparation.map((item) => `<li>${item}</li>`).join("");
  if (packageInfo) {
    document.querySelector("#drawer-package-name").textContent = packageInfo.file;
    document.querySelector("#drawer-package-meta").textContent = `最新版本 ${packageInfo.version} · ${packageInfo.updated} · ${packageInfo.size}`;
    const download = document.querySelector("#drawer-package-download");
    download.href = getPackageUrl(packageInfo);
    download.download = packageInfo.file;
  }
  document.querySelector("#drawer-version-count").textContent = skill.lifecycleLabel || `${skill.lifecycle.length} 次改版`;
  document.querySelector("#drawer-lifecycle-list").innerHTML = skill.lifecycle.map((event, index) => `
    <article class="lifecycle-item">
      <div class="lifecycle-marker">
        <img class="avatar lifecycle-avatar photo-avatar" src="assets/avatars/${event.avatar}" alt="${event.name}" />
        ${index < skill.lifecycle.length - 1 ? '<span class="lifecycle-line" aria-hidden="true"></span>' : ''}
      </div>
      <div class="lifecycle-content">
        <div class="lifecycle-meta"><span>${event.version}</span><time>${event.date}</time></div>
        <p><strong>${event.name}</strong> · ${event.action}</p>
        <span class="lifecycle-outcome">${event.outcome}</span>
      </div>
    </article>
  `).join("");
  document.querySelector(".drawer-scroll").scrollTop = 0;
  drawer.showModal();
}

function applyCodingCommunitySnapshot() {
  const snapshot = window.codingCommunitySnapshot;
  if (!snapshot?.weekly || !snapshot?.windows?.week) return;

  const { weekly, windows } = snapshot;
  const monthDay = (windows.week.end || "").slice(5).replace("-", ".");

  document.querySelectorAll("[data-snapshot-updated]").forEach((element) => {
    element.textContent = `更新于 ${monthDay}`;
  });
  document.querySelectorAll("[data-weekly-contributors]").forEach((element) => {
    element.textContent = weekly.contributor_count;
  });
  document.querySelectorAll("[data-weekly-skills]").forEach((element) => {
    element.textContent = weekly.changed_skill_count;
  });

  const total = document.querySelector("[data-core-design-total]");
  if (total) total.textContent = weekly.design_system.core_design_md_added;

  document.querySelectorAll("[data-design-category]").forEach((element) => {
    const value = weekly.design_system.categories?.[element.dataset.designCategory];
    if (Number.isFinite(value)) element.textContent = value;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderIcons();
  renderDongLogo();
  initRepoCommunitySkills();
  applyCodingCommunitySnapshot();

  const weeklyUpdateTabs = [...document.querySelectorAll("[data-weekly-filter]")];
  const weeklyUpdateItems = [...document.querySelectorAll(".weekly-app-update")];
  const selectWeeklyUpdateTab = (selectedTab) => {
    const filter = selectedTab.dataset.weeklyFilter;

    weeklyUpdateTabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle("is-active", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    weeklyUpdateItems.forEach((item) => {
      const scene = item.querySelector("h3")?.dataset.scene;
      item.hidden = filter !== "all" && scene !== filter;
    });
  };

  weeklyUpdateTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectWeeklyUpdateTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = weeklyUpdateTabs.length - 1;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + weeklyUpdateTabs.length) % weeklyUpdateTabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % weeklyUpdateTabs.length;

      weeklyUpdateTabs[nextIndex].focus();
      selectWeeklyUpdateTab(weeklyUpdateTabs[nextIndex]);
    });
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => changeView(button.dataset.view));
  });

  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => changeView(button.dataset.viewTarget));
  });

  document.querySelectorAll("[data-bookmark]").forEach((button) => {
    button.addEventListener("click", () => {
      const active = button.classList.toggle("bookmarked");
      showToast(active ? "已加入你的收藏" : "已移出收藏");
    });
  });

  document.querySelectorAll("[data-open-skill]").forEach((button) => {
    button.addEventListener("click", () => openDrawer(button.dataset.openSkill));
  });

  document.querySelectorAll(".skill-card[data-skill]").forEach((card) => {
    card.setAttribute("role", "button");
    card.tabIndex = 0;
    card.addEventListener("click", (event) => {
      if (event.target.closest("button, a")) return;
      openDrawer(card.dataset.skill);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openDrawer(card.dataset.skill);
    });
  });

  document.querySelectorAll("[data-join-request]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(button.title === "认领需求" ? "已认领该需求" : "已加入共创项目");
    });
  });

  const domainLabels = { experience: "体验设计", marketing: "营销设计", brand: "品牌设计" };
  document.querySelectorAll(".collection-item.is-recruit").forEach((item) => {
    const trigger = () => showToast(`「${item.dataset.recruit || "该能力"}」正在招募共建，欢迎贡献`);
    item.addEventListener("click", trigger);
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      trigger();
    });
  });
  document.querySelectorAll("[data-collection]").forEach((button) => {
    button.addEventListener("click", () => showToast(`${domainLabels[button.dataset.collection] || "该场景"}场景能力清单整理中`));
  });

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => modal.showModal());
  });
  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => modal.close()));
  document.querySelectorAll("[data-close-drawer]").forEach((button) => button.addEventListener("click", () => drawer.close()));
  document.querySelectorAll("[data-close-install]").forEach((button) => button.addEventListener("click", () => installModal.close()));
  document.querySelectorAll("[data-open-philosophy]").forEach((button) => {
    button.addEventListener("click", () => philosophyModal.showModal());
  });
  document.querySelectorAll("[data-close-philosophy]").forEach((button) => {
    button.addEventListener("click", () => philosophyModal.close());
  });

  document.querySelector("#skill-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("#skill-name").value.trim();
    if (!name) return;
    modal.close();
    event.currentTarget.reset();
    showToast(`“${name}”已创建为草稿`);
  });

  document.querySelector("[data-open-repo-detail]").addEventListener("click", () => openSkillRepository(activeSkillId));
  document.querySelector("[data-run-skill]").addEventListener("click", () => useSkill(activeSkillId));
  document.querySelector("[data-install-copy]").addEventListener("click", () => installAndCopy(activeSkillId));
  document.querySelector("[data-copy-command]").addEventListener("click", async () => {
    const packageInfo = skillPackages[activeSkillId];
    const copied = packageInfo ? await copyText(getInstallCommand(packageInfo)) : false;
    showToast(copied ? "安装命令已复制" : "请手动复制安装命令");
  });
  document.querySelector("[data-copy-prompt]").addEventListener("click", async () => {
    const packageInfo = skillPackages[activeSkillId];
    const copied = packageInfo ? await copyText(packageInfo.prompt) : false;
    showToast(copied ? "调用范式已复制" : "请手动复制调用范式");
  });

  const initial = window.location.hash.replace("#", "");
  if (pageLabels[initial] && initial !== "discover") changeView(initial);
});
