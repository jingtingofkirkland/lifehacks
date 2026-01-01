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
}

export const techPosts: TechPost[] = [
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
