/**
 * Draw & Guess （你画我猜） word bank + pure game logic.
 *
 * Built-in bank: 5 themes x 28 bilingual (EN/中文） word pairs, all drawable
 * and grade-3 friendly. Families can add their own words on the page; custom
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
      w('animals', 'dog', '狗'),
      w('animals', 'cat', '猫'),
      w('animals', 'rabbit', '兔子'),
      w('animals', 'elephant', '大象'),
      w('animals', 'lion', '狮子'),
      w('animals', 'tiger', '老虎'),
      w('animals', 'monkey', '猴子'),
      w('animals', 'panda', '熊猫'),
      w('animals', 'pig', '猪'),
      w('animals', 'cow', '奶牛'),
      w('animals', 'horse', '马'),
      w('animals', 'sheep', '羊'),
      w('animals', 'chicken', '鸡'),
      w('animals', 'duck', '鸭子'),
      w('animals', 'fish', '鱼'),
      w('animals', 'bird', '鸟'),
      w('animals', 'frog', '青蛙'),
      w('animals', 'snake', '蛇'),
      w('animals', 'bear', '熊'),
      w('animals', 'giraffe', '长颈鹿'),
      w('animals', 'zebra', '斑马'),
      w('animals', 'penguin', '企鹅'),
      w('animals', 'owl', '猫头鹰'),
      w('animals', 'butterfly', '蝴蝶'),
      w('animals', 'bee', '蜜蜂'),
      w('animals', 'spider', '蜘蛛'),
      w('animals', 'turtle', '乌龟'),
      w('animals', 'mouse', '老鼠'),
    ],
  },
  {
    id: 'food',
    en: 'Food',
    zh: '食物',
    emoji: '🍎',
    words: [
      w('food', 'apple', '苹果'),
      w('food', 'banana', '香蕉'),
      w('food', 'orange', '橙子'),
      w('food', 'grapes', '葡萄'),
      w('food', 'strawberry', '草莓'),
      w('food', 'watermelon', '西瓜'),
      w('food', 'carrot', '胡萝卜'),
      w('food', 'corn', '玉米'),
      w('food', 'egg', '鸡蛋'),
      w('food', 'cake', '蛋糕'),
      w('food', 'pizza', '披萨'),
      w('food', 'hamburger', '汉堡包'),
      w('food', 'ice cream', '冰淇淋'),
      w('food', 'cookie', '饼干'),
      w('food', 'bread', '面包'),
      w('food', 'cheese', '奶酪'),
      w('food', 'milk', '牛奶'),
      w('food', 'rice', '米饭'),
      w('food', 'noodles', '面条'),
      w('food', 'dumpling', '饺子'),
      w('food', 'candy', '糖果'),
      w('food', 'popcorn', '爆米花'),
      w('food', 'lemon', '柠檬'),
      w('food', 'peach', '桃子'),
      w('food', 'pear', '梨'),
      w('food', 'pumpkin', '南瓜'),
      w('food', 'potato', '土豆'),
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
      w('everyday', 'hat', '帽子'),
      w('everyday', 'shoes', '鞋子'),
      w('everyday', 'socks', '袜子'),
      w('everyday', 'toothbrush', '牙刷'),
      w('everyday', 'cup', '杯子'),
      w('everyday', 'spoon', '勺子'),
      w('everyday', 'chair', '椅子'),
      w('everyday', 'table', '桌子'),
      w('everyday', 'bed', '床'),
      w('everyday', 'clock', '时钟'),
      w('everyday', 'phone', '手机'),
      w('everyday', 'balloon', '气球'),
      w('everyday', 'candle', '蜡烛'),
      w('everyday', 'scissors', '剪刀'),
      w('everyday', 'bicycle', '自行车'),
      w('everyday', 'car', '汽车'),
      w('everyday', 'bus', '公交车'),
      w('everyday', 'airplane', '飞机'),
      w('everyday', 'boat', '船'),
      w('everyday', 'house', '房子'),
      w('everyday', 'door', '门'),
      w('everyday', 'window', '窗户'),
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
      w('school', 'pencil', '铅笔'),
      w('school', 'pen', '钢笔'),
      w('school', 'ruler', '尺子'),
      w('school', 'eraser', '橡皮'),
      w('school', 'crayon', '蜡笔'),
      w('school', 'backpack', '书包'),
      w('school', 'book', '书'),
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
      w('school', 'star', '星星'),
      w('school', 'heart', '爱心'),
      w('school', 'sun', '太阳'),
      w('school', 'moon', '月亮'),
      w('school', 'cloud', '云'),
      w('school', 'rain', '雨'),
      w('school', 'snow', '雪'),
      w('school', 'rainbow', '彩虹'),
      w('school', 'tree', '树'),
      w('school', 'flower', '花'),
    ],
  },
  {
    id: 'actions',
    en: 'Actions',
    zh: '动作',
    emoji: '🏃',
    words: [
      w('actions', 'run', '跑步'),
      w('actions', 'jump', '跳'),
      w('actions', 'swim', '游泳'),
      w('actions', 'sing', '唱歌'),
      w('actions', 'dance', '跳舞'),
      w('actions', 'read', '读书'),
      w('actions', 'write', '写字'),
      w('actions', 'draw', '画画'),
      w('actions', 'cook', '做饭'),
      w('actions', 'eat', '吃饭'),
      w('actions', 'drink', '喝水'),
      w('actions', 'sleep', '睡觉'),
      w('actions', 'cry', '哭'),
      w('actions', 'laugh', '大笑'),
      w('actions', 'clap', '拍手'),
      w('actions', 'kick', '踢球'),
      w('actions', 'throw', '扔'),
      w('actions', 'catch', '接'),
      w('actions', 'climb', '爬'),
      w('actions', 'fly', '飞'),
      w('actions', 'ride a bike', '骑车'),
      w('actions', 'brush teeth', '刷牙'),
      w('actions', 'wash hands', '洗手'),
      w('actions', 'play guitar', '弹吉他'),
      w('actions', 'go fishing', '钓鱼'),
      w('actions', 'hug', '拥抱'),
      w('actions', 'wave', '挥手'),
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
