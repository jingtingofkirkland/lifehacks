/**
 * Draw & Guess （你画我猜） word bank + pure game logic.
 *
 * Built-in bank: 5 themes x 28 bilingual (EN/中文） word pairs. Difficulty
 * sits at "medium" for a GRADE-3 kid (user call, 2026-10-21), picked from
 * the circle of life a third-grader actually lives in: everyday words,
 * things around the house, games and play, school life, food, animals,
 * plants and nature scenes. Every word is known, seen and imaginable —
 * but none is a one-second freebie (no cat / dog / apple / sun), and
 * nothing is obscure or abstract either.
 * Families can add their own words on the page; custom
 * words and removed built-ins persist in localStorage and merge with the
 * built-in bank at draw time ("restore defaults" clears both lists).
 *
 * Everything in this file is pure and unit-tested (draw-guess.test.ts).
 */

export type ThemeId = 'animals' | 'food' | 'everyday' | 'school' | 'actions';
export type Lang = 'zh' | 'en';
export type ThemeChoice = ThemeId | 'all';

export interface WordEntry {
  id: string;
  en: string;
  zh: string;
}

export interface Theme {
  id: ThemeId;
  en: string;
  zh: string;
  emoji: string;
  words: WordEntry[];
}

/**
 * A family-added word: the main text plus an optional English gloss, so a
 * custom word shows bilingually on the reveal just like a built-in pair
 * (the local playtest version's word form asked for exactly this). Words
 * saved before the gloss existed simply have no `en` and fall back to
 * showing the same text for both languages.
 */
export interface CustomWord {
  id: string;
  theme: ThemeId;
  text: string;
  en?: string;
}

const w = (theme: ThemeId, en: string, zh: string): WordEntry => ({
  id: `${theme}:${en.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  en,
  zh,
});

export const WORD_BANK: Theme[] = [
  {
    id: 'animals',
    en: 'Animals',
    zh: '动物',
    emoji: '🐶',
    words: [
      w('animals', 'kangaroo', '袋鼠'),
      w('animals', 'koala', '考拉'),
      w('animals', 'dolphin', '海豚'),
      w('animals', 'elephant', '大象'),
      w('animals', 'lion', '狮子'),
      w('animals', 'tiger', '老虎'),
      w('animals', 'monkey', '猴子'),
      w('animals', 'panda', '熊猫'),
      w('animals', 'octopus', '章鱼'),
      w('animals', 'camel', '骆驼'),
      w('animals', 'horse', '马'),
      w('animals', 'snail', '蜗牛'),
      w('animals', 'ostrich', '鸵鸟'),
      w('animals', 'swan', '天鹅'),
      w('animals', 'shark', '鲨鱼'),
      w('animals', 'peacock', '孔雀'),
      w('animals', 'frog', '青蛙'),
      w('animals', 'snake', '蛇'),
      w('animals', 'bear', '熊'),
      w('animals', 'giraffe', '长颈鹿'),
      w('animals', 'zebra', '斑马'),
      w('animals', 'penguin', '企鹅'),
      w('animals', 'owl', '猫头鹰'),
      w('animals', 'butterfly', '蝴蝶'),
      w('animals', 'goldfish', '金鱼'),
      w('animals', 'spider', '蜘蛛'),
      w('animals', 'turtle', '乌龟'),
      w('animals', 'squirrel', '松鼠'),
    ],
  },
  {
    id: 'food',
    en: 'Food',
    zh: '食物',
    emoji: '🍎',
    words: [
      w('food', 'pineapple', '菠萝'),
      w('food', 'broccoli', '西兰花'),
      w('food', 'coconut', '椰子'),
      w('food', 'grapes', '葡萄'),
      w('food', 'strawberry', '草莓'),
      w('food', 'watermelon', '西瓜'),
      w('food', 'carrot', '胡萝卜'),
      w('food', 'corn', '玉米'),
      w('food', 'french fries', '薯条'),
      w('food', 'cake', '蛋糕'),
      w('food', 'pizza', '披萨'),
      w('food', 'hamburger', '汉堡包'),
      w('food', 'ice cream', '冰淇淋'),
      w('food', 'cookie', '饼干'),
      w('food', 'sandwich', '三明治'),
      w('food', 'cheese', '奶酪'),
      w('food', 'bubble tea', '珍珠奶茶'),
      w('food', 'sushi', '寿司'),
      w('food', 'noodles', '面条'),
      w('food', 'dumpling', '饺子'),
      w('food', 'lollipop', '棒棒糖'),
      w('food', 'popcorn', '爆米花'),
      w('food', 'chili pepper', '辣椒'),
      w('food', 'hot dog', '热狗'),
      w('food', 'eggplant', '茄子'),
      w('food', 'pumpkin', '南瓜'),
      w('food', 'mushroom', '蘑菇'),
      w('food', 'tomato', '番茄'),
    ],
  },
  {
    id: 'everyday',
    en: 'Everyday Things',
    zh: '日常用品',
    emoji: '🎈',
    words: [
      w('everyday', 'umbrella', '雨伞'),
      w('everyday', 'key', '钥匙'),
      w('everyday', 'glasses', '眼镜'),
      w('everyday', 'crown', '皇冠'),
      w('everyday', 'roller skates', '轮滑鞋'),
      w('everyday', 'gloves', '手套'),
      w('everyday', 'toothbrush', '牙刷'),
      w('everyday', 'teapot', '茶壶'),
      w('everyday', 'skateboard', '滑板'),
      w('everyday', 'sofa', '沙发'),
      w('everyday', 'bookshelf', '书架'),
      w('everyday', 'bathtub', '浴缸'),
      w('everyday', 'clock', '时钟'),
      w('everyday', 'camera', '照相机'),
      w('everyday', 'balloon', '气球'),
      w('everyday', 'candle', '蜡烛'),
      w('everyday', 'scissors', '剪刀'),
      w('everyday', 'bicycle', '自行车'),
      w('everyday', 'fire truck', '消防车'),
      w('everyday', 'bus', '公交车'),
      w('everyday', 'airplane', '飞机'),
      w('everyday', 'sailboat', '帆船'),
      w('everyday', 'refrigerator', '冰箱'),
      w('everyday', 'mailbox', '信箱'),
      w('everyday', 'washing machine', '洗衣机'),
      w('everyday', 'lamp', '台灯'),
      w('everyday', 'kite', '风筝'),
      w('everyday', 'ladder', '梯子'),
    ],
  },
  {
    id: 'school',
    en: 'School & Nature',
    zh: '学校与自然',
    emoji: '✏️',
    words: [
      w('school', 'microscope', '显微镜'),
      w('school', 'magnifying glass', '放大镜'),
      w('school', 'calculator', '计算器'),
      w('school', 'eraser', '橡皮'),
      w('school', 'crayon', '蜡笔'),
      w('school', 'backpack', '书包'),
      w('school', 'telescope', '望远镜'),
      w('school', 'notebook', '本子'),
      w('school', 'glue', '胶水'),
      w('school', 'map', '地图'),
      w('school', 'globe', '地球仪'),
      w('school', 'computer', '电脑'),
      w('school', 'blackboard', '黑板'),
      w('school', 'desk', '课桌'),
      w('school', 'bell', '铃铛'),
      w('school', 'flag', '旗子'),
      w('school', 'guitar', '吉他'),
      w('school', 'drum', '鼓'),
      w('school', 'rocket', '火箭'),
      w('school', 'astronaut', '宇航员'),
      w('school', 'volcano', '火山'),
      w('school', 'forest', '森林'),
      w('school', 'waterfall', '瀑布'),
      w('school', 'snowman', '雪人'),
      w('school', 'beach', '沙滩'),
      w('school', 'rainbow', '彩虹'),
      w('school', 'cactus', '仙人掌'),
      w('school', 'slide', '滑梯'),
    ],
  },
  {
    id: 'actions',
    en: 'Actions',
    zh: '动作',
    emoji: '🏃',
    words: [
      w('actions', 'play soccer', '踢足球'),
      w('actions', 'swing on a swing', '荡秋千'),
      w('actions', 'swim', '游泳'),
      w('actions', 'play the violin', '拉小提琴'),
      w('actions', 'dance', '跳舞'),
      w('actions', 'read', '读书'),
      w('actions', 'write', '写字'),
      w('actions', 'draw', '画画'),
      w('actions', 'cook', '做饭'),
      w('actions', 'play piano', '弹钢琴'),
      w('actions', 'play basketball', '打篮球'),
      w('actions', 'sleep', '睡觉'),
      w('actions', 'blow bubbles', '吹泡泡'),
      w('actions', 'ride a horse', '骑马'),
      w('actions', 'jump rope', '跳绳'),
      w('actions', 'fly a kite', '放风筝'),
      w('actions', 'do a magic trick', '变魔术'),
      w('actions', 'take photos', '拍照'),
      w('actions', 'climb', '爬'),
      w('actions', 'build a snowman', '堆雪人'),
      w('actions', 'ride a bike', '骑车'),
      w('actions', 'brush teeth', '刷牙'),
      w('actions', 'wash hands', '洗手'),
      w('actions', 'play guitar', '弹吉他'),
      w('actions', 'go fishing', '钓鱼'),
      w('actions', 'play hide and seek', '躲猫猫'),
      w('actions', 'water the flowers', '浇花'),
      w('actions', 'sneeze', '打喷嚏'),
    ],
  },
];

export const THEME_IDS: ThemeId[] = WORD_BANK.map((t) => t.id);

export function themeById(id: ThemeId): Theme {
  return WORD_BANK.find((t) => t.id === id) as Theme;
}

/**
 * Build the drawable pool for a theme choice: built-in words minus the
 * family's removed list, plus their custom words for the matching theme(s).
 */
export function mergePool(
  choice: ThemeChoice,
  custom: CustomWord[],
  removedIds: string[],
): WordEntry[] {
  const removed = new Set(removedIds);
  const themes = choice === 'all' ? WORD_BANK : [themeById(choice)];
  const pool: WordEntry[] = [];
  for (const theme of themes) {
    for (const entry of theme.words) {
      if (!removed.has(entry.id)) pool.push(entry);
    }
    for (const c of custom) {
      if (c.theme === theme.id)
        pool.push({ id: c.id, en: c.en ?? c.text, zh: c.text });
    }
  }
  return pool;
}

/** All words (built-in + custom) belonging to one theme, for the manager UI. */
export function themeWords(
  themeId: ThemeId,
  custom: CustomWord[],
  removedIds: string[],
): { builtin: WordEntry[]; custom: CustomWord[] } {
  const removed = new Set(removedIds);
  return {
    builtin: themeById(themeId).words.filter((entry) => !removed.has(entry.id)),
    custom: custom.filter((c) => c.theme === themeId),
  };
}

/**
 * Pick a random word from the pool, never repeating the previous word when
 * the pool has more than one entry. Returns null for an empty pool.
 */
export function pickWord(
  pool: WordEntry[],
  lastId: string | null,
  rng: () => number = Math.random,
): WordEntry | null {
  if (pool.length === 0) return null;
  const candidates =
    pool.length > 1 && lastId ? pool.filter((entry) => entry.id !== lastId) : pool;
  const idx = Math.min(candidates.length - 1, Math.floor(rng() * candidates.length));
  return candidates[idx];
}

/** Masked display for a word: one bullet per character, spaces kept. */
export function maskWord(text: string): string {
  return Array.from(text)
    .map((ch) => (ch === ' ' ? ' ' : '•'))
    .join('');
}

export function wordText(entry: WordEntry, lang: Lang): string {
  return lang === 'zh' ? entry.zh : entry.en;
}

/* ── localStorage persistence (keys + tolerant parsers) ────────────────── */

export const CUSTOM_WORDS_KEY = 'drawGuess.customWords.v1';
export const REMOVED_WORDS_KEY = 'drawGuess.removedWords.v1';
export const TALLY_KEY = 'drawGuess.tally.v1';

const THEME_ID_SET = new Set<string>(THEME_IDS);

export function parseCustomWords(raw: string | null): CustomWord[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const out: CustomWord[] = [];
    for (const item of data) {
      if (
        item &&
        typeof item === 'object' &&
        typeof (item as CustomWord).id === 'string' &&
        typeof (item as CustomWord).text === 'string' &&
        (item as CustomWord).text.trim() !== '' &&
        THEME_ID_SET.has((item as CustomWord).theme)
      ) {
        const entry: CustomWord = {
          id: (item as CustomWord).id,
          theme: (item as CustomWord).theme,
          text: (item as CustomWord).text,
        };
        const en = (item as CustomWord).en;
        if (typeof en === 'string' && en.trim() !== '') entry.en = en.trim();
        out.push(entry);
      }
    }
    return out;
  } catch {
    return [];
  }
}

export function parseRemovedIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

export function parseTally(raw: string | null): number {
  if (!raw) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function makeCustomWord(
  theme: ThemeId,
  text: string,
  en?: string,
): CustomWord {
  const trimmed = text.trim();
  const entry: CustomWord = {
    id: `custom:${theme}:${trimmed.toLowerCase()}`,
    theme,
    text: trimmed,
  };
  const gloss = en?.trim();
  if (gloss) entry.en = gloss;
  return entry;
}
