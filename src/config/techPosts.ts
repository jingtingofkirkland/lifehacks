export interface TechPost {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  links?: {
    label: string;
    url: string;
  }[];
  highlights?: string[];
  // Large text content support - use contentPath to load from MD file
  contentPath?: string; // Path to MD file relative to /content/posts/
  // Optional second-language (English) version of the MD content.
  // When set, the article shows a 中文 / English toggle; when absent, nothing changes.
  contentPathEn?: string;
}

export const techPosts: TechPost[] = [
  {
    id: "meta-muse-agent-race",
    title: "Meta Muse 爆火：但「第一个会干活的个人 AI 助理」，真不是它",
    description: "Muse 靠免费和 WhatsApp 分发爆火，但能订餐、付款、代发消息的 AI 早在 2025 年 1 月就出现了。这一篇把 Muse、OpenAI Dots、Manus、Grok Bot、Gemini Spark 等 11 款能「干活」的个人 AI 助理同台对比：自主等级、权限设计、价格、可用性的坑，以及热度数据的水分。",
    category: "AI",
    date: "2026-10-05",
    contentPath: "meta-muse-agent-race.md",
    contentPathEn: "meta-muse-agent-race.en.md",
    highlights: [
      "Operator 2025 年 1 月就能自己下单，Muse 不是第一个",
      "22 天约 500 万下载（第三方估算）；周活数据来自内部泄露",
      "留存率未公布：火是真的试用热度，习惯未证",
      "11 款产品同台：自主等级、权限、价格、坑",
    ],
  },
  {
    id: "meta-muse-daily-tasks",
    title: "实测 Muse：日常差事与商家服务，到底走到哪一步",
    description: "订位、询价、清邮箱能干，账单议价还只是舞台故事；商家名单很长，真正跑通交易闭环的只有三条线。基于记者实测与内部报道的深度验货：10 个任务 31 次批准、Amazon 封杀、商家交易额与留存全部未公布。",
    category: "AI",
    date: "2026-10-05",
    contentPath: "meta-muse-daily-tasks.md",
    contentPathEn: "meta-muse-daily-tasks.en.md",
    highlights: [
      "实测切片：10 个任务 5 对 2 错 2 卡，31 次权限请求",
      "购物/订位有实测，账单议价仍是舞台宣称、未验证",
      "Amazon 9 月 20 日封杀；人工代打测试被曝光后回滚",
      "留存、任务完成率、商家交易额：全部未公布",
    ],
  },
  {
    id: "4680-cell-cn",
    title: "特斯拉4680电池：五年追梦路，干电极仍荆棘满途",
    description: "自2020年Battery Day高调亮相以来，4680圆柱电池一直是特斯拉垂直整合与成本革命的核心寄托。更大尺寸、更低成本、干电极工艺曾被宣传为「电池圣杯」，然而进入2026年，这项技术仍深陷「难产」泥沼。",
    category: "Tech",
    date: "2026-01-01",
    contentPath: "4086-cell-cn.md",
    highlights: [
      "干阳极已实现100%量产",
      "全干电极量产比例仍为0%",
      "德州工厂良率稳定在95%以上",
      "2026年有望推出四种变体",
    ],
  },
  {
    id: "transformer-architecture",
    title: "From Attention to Intelligence: A Deep Dive into Transformer Architecture",
    description: "The Transformer architecture has fundamentally reshaped AI. This article explains core concepts, training mechanics, emergent intelligence, and the philosophical limits of machine creativity.",
    category: "AI",
    date: "2025-12-21",
    contentPath: "transformer-architecture.md",
    links: [
      { label: "Attention Is All You Need (Paper)", url: "https://arxiv.org/abs/1706.03762" },
    ],
  },
  {
    id: "gen-ai",
    title: "Generative AI",
    description: "Generative AI creates new content including text, images, music, or video. Learn how AI is transforming the way we create and interact with technology.",
    category: "AI",
    date: "2024-01-15",
    links: [
      { label: "What is RAG?", url: "https://www.youtube.com/watch?v=T-D1OfcDW1M" },
      { label: "Setup Your Own Offline AI", url: "https://www.youtube.com/watch?v=JpQC0W91E6k" },
    ],
  },
  {
    id: "signals-gateway",
    title: "Meta Signals Gateway",
    description: "Signals Gateway by Meta is a Customer Data Platform (CDP) for collecting, managing, and distributing first-party data.",
    category: "Data",
    date: "2024-01-10",
    links: [
      { label: "Learn More", url: "https://www.facebook.com/business/m/signalsgateway/" },
    ],
    highlights: [
      "Centralized Data Management",
      "First-Party Data Tracking",
      "Easy Setup without coding",
      "GDPR Compliance built-in",
      "AI and Automation Support",
    ],
  },
  {
    id: "space-tech",
    title: "Space Technology",
    description: "Stay updated with the latest developments in space exploration, rocket technology, and satellite systems.",
    category: "Space",
    date: "2024-01-05",
    links: [
      { label: "SpaceX Falcon 9 Reuse Status", url: "/space" },
    ],
  },
];

export const techCategories = ["All", "AI", "Data", "Space", "Web", "Mobile"];
