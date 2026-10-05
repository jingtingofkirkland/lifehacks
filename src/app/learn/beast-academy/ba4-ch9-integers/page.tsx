import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsletterForm } from '@/components/NewsletterForm';
import { PrintButton } from './PrintButton';

export const metadata: Metadata = {
  title: 'Beast Academy 4 第 9 章「整数」中文陪学指南 - Great Seattle Life Hacks',
  description:
    '给华人家长的 BA4 第 9 章 Integers（负数）中文讲解：数轴、比大小、整数加法，3 个例题精讲、常见错误和 5 道可打印小练。',
  alternates: {
    canonical:
      'https://lifehacks.zeey-app.net/learn/beast-academy/ba4-ch9-integers/',
  },
};

const ARTICLE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Beast Academy 4 第 9 章「整数」中文陪学指南',
  inLanguage: 'zh-CN',
  url: 'https://lifehacks.zeey-app.net/learn/beast-academy/ba4-ch9-integers/',
};

const KEY_IDEAS = [
  {
    emoji: '🌡️',
    title: '负数是“0 的另一边”',
    body: '负数不是“没有”，而是往反方向走的数。气温零下、地下楼层、欠的钱，都是生活里真实的负数。',
  },
  {
    emoji: '📏',
    title: '比大小看位置',
    body: '数轴上越往右越大。−3 在 −8 的右边，所以 −3 比 −8 大——哪怕 8 看起来比 3 “大”。',
  },
  {
    emoji: '🚶',
    title: '加法就是在数轴上走路',
    body: '加正数向右走，加负数向左走。先找到起点，再数步数，落点就是答案。',
  },
];

const EXAMPLES = [
  {
    title: '例 1：比大小 —— −8 和 −3，哪个大？',
    problem: '比较 −8 和 −3 的大小。',
    explain:
      '先别看数字，先定位：在数轴上，−8 在很左边，−3 离 0 更近、更靠右，所以 −3 更大。可以跟孩子打比方：欠 3 块钱和欠 8 块钱，哪个人的钱包更“满”？欠得少的更接近还清，当然是欠 3 块的处境更好。',
    script: '“你先在数轴上帮我找到这两个数。哪个更靠右？靠右的更大。”',
  },
  {
    title: '例 2：排序 —— 把 2、−4、0、−1、3 从小到大排',
    problem: '把 2、−4、0、−1、3 按从小到大的顺序排列。',
    explain:
      '不要凭感觉猜，先把每个数在数轴上点一个点：−4 最靠左，然后是 −1，然后 0，再然后 2，3 最靠右。顺序直接从图上读出来：−4 < −1 < 0 < 2 < 3。负数永远排在 0 左边，这是排序题最稳的检查方法。',
    script: '“排不出来的时候，先画数轴，把数字一个个‘放’上去，答案自己就出来了。”',
  },
  {
    title: '例 3：整数加法 —— −5 + 7 等于几？',
    problem: '计算 −5 + 7 和 4 + (−6)。',
    explain:
      '把加法变成走路：−5 + 7，就是站在 −5，向右走 7 步：−4、−3、−2、−1、0、1、2，落在 2。反过来，4 + (−6) 是站在 4，向左走 6 步：3、2、1、0、−1、−2，落在 −2。记住口诀：加正数向右，加负数向左。',
    script: '“加号后面是正数就向右走，是负数就向左走。先定方向，再数步数。”',
  },
];

const MISTAKES = [
  {
    mistake: '“−8 比 −3 大，因为 8 比 3 大。”',
    fix: '这是最常见的坑。换成温度讲：−8°C 和 −3°C 哪个更冷？孩子立刻能答 −8°C 更冷。更冷 = 更小。再回到数轴上确认位置。',
  },
  {
    mistake: '加负数时方向走反：5 + (−3) 往右边走。',
    fix: '把口诀练成本能：看到 “+ (−…)”，先在心里说一句“向左走”。也可以换个说法——加一个负数，就是把这个数减掉：5 + (−3) 和 5 − 3 是一回事。',
  },
  {
    mistake: '觉得“负数不存在”“5 减 8 算不了”。',
    fix: '用生活场景兜底：温度计能到零下，电梯有 B1 地下层，记账时花出去的钱记成负的。数不够减的时候，正好是负数出场的理由。',
  },
  {
    mistake: '把 0 当成正数或负数。',
    fix: '一句话定死：0 既不是正数，也不是负数，它是正负两边的分界线。',
  },
];

const PRACTICE = [
  {
    q: '−6 和 −2，哪个大？',
    a: '−2 更大（在数轴上更靠右）。',
  },
  {
    q: '把 3、−5、−1、0 从小到大排列。',
    a: '−5 < −1 < 0 < 3。',
  },
  {
    q: '计算：−4 + 6 = ?',
    a: '2（从 −4 向右走 6 步）。',
  },
  {
    q: '计算：5 + (−8) = ?',
    a: '−3（从 5 向左走 8 步）。',
  },
  {
    q: '早上气温是 −2°C，中午升高了 5°C，现在多少度？',
    a: '3°C（−2 + 5 = 3）。',
  },
];

/** Decorative number line from -6 to 6 with a few highlighted points. */
function NumberLine() {
  const points = Array.from({ length: 13 }, (_, i) => i - 6);
  return (
    <div
      className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 overflow-x-auto"
      role="img"
      aria-label="数轴示意图：从负六到正六，0 在正中间，负数在左边，正数在右边"
    >
      <div className="flex items-end justify-between min-w-[520px] px-1">
        {points.map((n) => (
          <div key={n} className="flex flex-col items-center gap-1">
            <span
              className={
                n === 0
                  ? 'text-sm font-bold text-foreground'
                  : n < 0
                    ? 'text-sm text-sky-600 dark:text-sky-400'
                    : 'text-sm text-rose-600 dark:text-rose-400'
              }
            >
              {n}
            </span>
            <span
              className={
                n === 0
                  ? 'block w-0.5 h-5 bg-foreground'
                  : 'block w-px h-3 bg-slate-400 dark:bg-slate-500'
              }
            />
          </div>
        ))}
      </div>
      <div className="min-w-[520px] h-0.5 bg-slate-300 dark:bg-slate-600 -mt-0.5" />
      <div className="min-w-[520px] flex justify-between text-xs text-muted-foreground mt-2 px-1">
        <span>← 越往左越小</span>
        <span>0 是分界线</span>
        <span>越往右越大 →</span>
      </div>
    </div>
  );
}

/**
 * Chinese companion guide for Beast Academy Level 4, Chapter 9 (Integers).
 * Original explanations and practice problems written for parents; not
 * affiliated with Art of Problem Solving.
 */
export default function Ba4Ch9IntegersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/learn/beast-academy/" className="hover:underline">
              Beast Academy 陪学
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground font-medium">
            BA4 第 9 章 整数
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-3">
        BA4 第 9 章「整数」中文陪学指南
      </h1>
      <p className="text-muted-foreground mb-2 leading-relaxed">
        A Chinese parent&apos;s companion to Beast Academy Level 4, Chapter 9:
        Integers — negative numbers, the number line, comparing and adding
        integers.
      </p>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        孩子做到负数这一章，家长最常卡住的是：概念都懂，但不知道怎么用孩子听得懂的话讲。
        这一篇用中文把 BA4 第 9 章的核心思路拆开，配 3 个例题精讲、常见错误清单，
        和 5 道可以打印下来做的小练。
      </p>

      <h2 className="text-xl font-bold mb-4">这一章到底在教什么</h2>
      <p className="leading-relaxed mb-4">
        第 9 章是孩子第一次正式遇到负数。表面上是“学几个新数”，实际上在打三个地基：
        负数在数轴上的位置、负数之间怎么比大小、以及整数加法怎么算。这一章过关的孩子，
        后面学坐标、方程都会轻松很多；卡在这里的孩子，往往是把负数当成“写错了的正数”在硬算。
      </p>
      <NumberLine />
      <ul className="grid gap-4 sm:grid-cols-3 my-8">
        {KEY_IDEAS.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="text-2xl mb-2" aria-hidden>
              {item.emoji}
            </p>
            <p className="font-semibold mb-1">{item.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.body}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mb-4">3 个例题精讲：这样讲孩子就懂</h2>
      <div className="grid gap-4 mb-10">
        {EXAMPLES.map((ex) => (
          <section
            key={ex.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <h3 className="font-semibold mb-2">{ex.title}</h3>
            <p className="text-sm font-medium mb-2">题目：{ex.problem}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {ex.explain}
            </p>
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">可以这样跟孩子说：</span>
              {ex.script}
            </p>
          </section>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">家长最常遇到的 4 个错误</h2>
      <div className="grid gap-4 mb-10">
        {MISTAKES.map((item) => (
          <section
            key={item.mistake}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="font-semibold mb-2">❌ {item.mistake}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ✅ {item.fix}
            </p>
          </section>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">迷你小练（5 题，可打印）</h2>
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-10">
        <ol className="list-decimal pl-5 space-y-3 leading-relaxed">
          {PRACTICE.map((p) => (
            <li key={p.q}>{p.q}</li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <PrintButton />
          <details>
            <summary className="cursor-pointer text-sm font-semibold hover:underline">
              做完再点开看答案
            </summary>
            <ol className="list-decimal pl-5 space-y-2 mt-3 text-sm text-muted-foreground leading-relaxed">
              {PRACTICE.map((p) => (
                <li key={p.q}>{p.a}</li>
              ))}
            </ol>
          </details>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          打印时答案默认收起，不会剧透；想核对时在网页上点开即可。
        </p>
      </section>

      <h2 className="text-xl font-bold mb-4">下一步练习</h2>
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <Link
          href="/tools/kangaroo/"
          className="block rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <p className="text-2xl mb-2" aria-hidden>
            🦘
          </p>
          <p className="font-semibold mb-1">免费袋鼠数学练习</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            三、四年级袋鼠风格练习题、计时测验和可打印练习单，负数打好基础之后正好换换脑子练思维题。
          </p>
        </Link>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-2xl mb-2" aria-hidden>
            ✉️
          </p>
          <p className="font-semibold mb-1">每周免费练习单</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            每周五一封：精选练习题 + 可打印 worksheet。免费订阅，不打扰，随时退订。
          </p>
        </div>
      </div>
      <NewsletterForm />
      <p className="text-xs text-muted-foreground mt-4 mb-10">
        也可以直接打开{' '}
        <Link href="/newsletter/" className="underline hover:no-underline">
          订阅页面
        </Link>{' '}
        了解每周练习单的内容。
      </p>

      <p className="text-xs text-muted-foreground leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-4">
        本站为独立陪学资料，与 Art of Problem Solving / Beast Academy
        无隶属关系；文中例题与练习均为原创，仅在主题范围上与课程对应。
      </p>
    </div>
  );
}
