import type { Metadata } from 'next';
import Link from 'next/link';
import { useId } from 'react';
import { PrintButton } from '../_components/PrintButton';

export const metadata: Metadata = {
  title: '整数（Integers）中文陪学：负数、数轴与加法 - Great Seattle Life Hacks',
  description:
    '给陪孩子学 Beast Academy 四年级的家长：用中文讲清整数这一章——负数住在数轴哪边、负数怎么比大小、加法为什么是“在数轴上走路”，附 5 道原创小练（可打印）。',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/learn/beast-academy/integers/',
  },
};

/**
 * A lightweight number-line diagram (inline SVG, no images).
 * Points sit on the axis; jumps draw an arc from one value to another to
 * show addition as movement along the line.
 */
function NumberLine({
  min,
  max,
  points = [],
  jumps = [],
}: {
  min: number;
  max: number;
  points?: { value: number; label: string; note?: string }[];
  jumps?: { from: number; to: number; label: string }[];
}) {
  const markerId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const W = 720;
  const PAD = 36;
  const step = (W - PAD * 2) / (max - min);
  const x = (v: number) => PAD + (v - min) * step;
  const AXIS_Y = 62;
  const ticks = [];
  for (let v = min; v <= max; v += 1) ticks.push(v);
  return (
    <svg
      viewBox={`0 0 ${W} 96`}
      role="img"
      aria-label={`数轴示意图，从 ${min} 到 ${max}`}
      className="w-full h-auto"
    >
      <defs>
        <marker
          id={`arrow-${markerId}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L7,3 L0,6 Z" className="fill-emerald-600" />
        </marker>
      </defs>
      {/* axis */}
      <line
        x1={8}
        y1={AXIS_Y}
        x2={W - 8}
        y2={AXIS_Y}
        className="stroke-slate-400 dark:stroke-slate-500"
        strokeWidth="2"
      />
      {/* ticks + numbers */}
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={x(v)}
            y1={AXIS_Y - 5}
            x2={x(v)}
            y2={AXIS_Y + 5}
            className="stroke-slate-400 dark:stroke-slate-500"
            strokeWidth="2"
          />
          <text
            x={x(v)}
            y={AXIS_Y + 24}
            textAnchor="middle"
            className="fill-slate-600 dark:fill-slate-300"
            fontSize="14"
            fontWeight={v === 0 ? 700 : 400}
          >
            {v}
          </text>
        </g>
      ))}
      {/* addition jumps */}
      {jumps.map((j, i) => {
        const x1 = x(j.from);
        const x2 = x(j.to);
        const mid = (x1 + x2) / 2;
        return (
          <g key={i}>
            <path
              d={`M ${x1} ${AXIS_Y - 10} Q ${mid} ${AXIS_Y - 52} ${x2} ${AXIS_Y - 10}`}
              fill="none"
              className="stroke-emerald-600"
              strokeWidth="2.5"
              markerEnd={`url(#arrow-${markerId})`}
            />
            <text
              x={mid}
              y={AXIS_Y - 46}
              textAnchor="middle"
              className="fill-emerald-700 dark:fill-emerald-300"
              fontSize="14"
              fontWeight="600"
            >
              {j.label}
            </text>
          </g>
        );
      })}
      {/* highlighted points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={x(p.value)}
            cy={AXIS_Y}
            r="7"
            className="fill-amber-400 stroke-amber-600"
            strokeWidth="2"
          />
          <text
            x={x(p.value)}
            y={AXIS_Y - 16}
            textAnchor="middle"
            className="fill-foreground"
            fontSize="15"
            fontWeight="700"
          >
            {p.label}
          </text>
          {p.note && (
            <text
              x={x(p.value)}
              y={AXIS_Y - 34}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400"
              fontSize="12"
            >
              {p.note}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

const PRACTICE: {
  q: string;
  answer: string;
  why: string;
}[] = [
  {
    q: '比大小：−9 和 −4，哪个更大？',
    answer: '−4 更大。',
    why: '数轴上 −4 在 −9 的右边，更靠右就更大。生活版：−4°C 比 −9°C 暖和，所以 −4 是“比较大”的那个温度。',
  },
  {
    q: '把这五个数从小到大排好：3、−7、−2、0、5。',
    answer: '−7 < −2 < 0 < 3 < 5',
    why: '先在心里把它们放到数轴上：负数全在 0 左边，其中 −7 最靠左；正数在 0 右边，3 在 5 前面。从左读到右就是答案。',
  },
  {
    q: '在数轴上算一算：(−7) + 5 = ？',
    answer: '−2',
    why: '从 −7 出发，加正数往右走 5 格：−6、−5、−4、−3、−2。还没走过 0，所以结果仍是负数。',
  },
  {
    q: '电梯题：小艾在大堂（记作 0）坐电梯先下到地下 3 层取快递，再上 4 层去教室。她最后在几层？',
    answer: '地上 1 层。',
    why: '地下 3 层记作 −3；再往上 4 层就是 (−3) + 4 = 1。数轴上从 −3 往右走 4 格，正好停在 1。',
  },
  {
    q: '温度题：清晨 −6°C，中午升了 8°C，中午多少度？晚上又降了 5°C，晚上多少度？',
    answer: '中午 2°C，晚上 −3°C。',
    why: '升温是往右走：(−6) + 8 = 2。降温是加上一个负数：2 + (−5) = −3，又回到零下了。',
  },
];

/**
 * Beast Academy companion, chapter: Integers (BA4 level).
 * Original Chinese-language explainer for parents — all explanations and
 * problems are written for this site; not affiliated with AoPS/BA.
 */
export default function IntegersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav
        aria-label="Breadcrumb"
        className="print:hidden text-sm text-muted-foreground mb-6"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/learn/beast-academy/" className="hover:underline">
              Beast Academy 中文陪学
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground font-medium">
            整数 Integers
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <h1 className="text-3xl font-bold">
          整数（Integers）：0 左边的新世界
        </h1>
        <PrintButton />
      </div>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        孩子在 Beast Academy 四年级第一次系统地学负数：它们住在数轴的哪一边、
        两个负数谁大谁小、带负号的加法怎么算。这一篇用中文把三个核心概念讲清，
        再配 5 道原创小练，陪孩子过一遍就能上手。
      </p>

      <h2 className="text-xl font-bold mb-4">这章孩子在学什么</h2>
      <ul className="grid gap-3 sm:grid-cols-2 mb-10">
        {[
          ['🧭 认识负数', '小于 0 的数（negative numbers），在数轴上排在 0 的左边。'],
          ['⚖️ 比大小、排顺序', '在数轴上比位置：越靠右的数越大，负数也不例外。'],
          ['🚶 整数加法', '把加法想成沿着数轴走路：加正数往右，加负数往左。'],
          ['🌡️ 生活里的负数', '气温、电梯的地下楼层、欠下的零花钱，都能用负数表示。'],
        ].map(([title, body]) => (
          <li
            key={title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="font-semibold mb-1">{title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {body}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mb-3">核心概念 1：负数住在 0 的左边</h2>
      <p className="leading-relaxed mb-4">
        把所有整数按顺序排成一条直线，就是<strong>数轴（number line）</strong>。
        0 站在中间：右边是正数（1、2、3…），越往右越大；左边是负数
        （−1、−2、−3…），越往左越小。还有一对特别的关系叫
        <strong>相反数（opposites）</strong>：+3 和 −3 离 0 一样远、方向相反，
        就像照镜子。
      </p>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-4">
        <NumberLine
          min={-6}
          max={6}
          points={[
            { value: -3, label: '−3', note: '离 0 三格' },
            { value: 3, label: '+3', note: '离 0 三格' },
          ]}
        />
      </div>
      <p className="leading-relaxed mb-10">
        <strong>陪孩子试一次：</strong>在数轴上找 −4——从 0 出发往左走 4 格。
        再问：−1 和 −4 谁离 0 达到更近？（−1，只隔 1 格。）这个“离 0 多远”
        的感觉，下一节比大小时马上要用。
      </p>

      <h2 className="text-xl font-bold mb-3">核心概念 2：比大小，看谁更靠右</h2>
      <p className="leading-relaxed mb-4">
        规则只有一句：<strong>数轴上越靠右的数越大</strong>。到了负数这边，
        孩子的直觉容易翻车——“5 比 3 大，所以 −5 比 −3 大”？恰恰相反：
        −5 在 −3 的左边，所以 <strong>−5 &lt; −3</strong>。
      </p>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-4">
        <NumberLine
          min={-7}
          max={2}
          points={[
            { value: -5, label: '−5', note: '更冷' },
            { value: -3, label: '−3', note: '没那么冷' },
          ]}
        />
      </div>
      <p className="leading-relaxed mb-4">
        两个生活类比，孩子一听就懂：
      </p>
      <ul className="list-disc pl-6 space-y-2 leading-relaxed mb-10">
        <li>
          <strong>气温：</strong>−5°C 比 −3°C 更冷。“更冷”就是温度更低、数更小。
        </li>
        <li>
          <strong>欠钱：</strong>欠 5 块钱记作 −5，欠 3 块记作 −3。欠得越多，
          手里其实越“穷”，数也越小。
        </li>
      </ul>

      <h2 className="text-xl font-bold mb-3">核心概念 3：加法就是在数轴上散步</h2>
      <p className="leading-relaxed mb-4">
        整数加法不用背规则，先让孩子<strong>走路</strong>：站在第一个数的位置，
        <strong>加正数往右走，加负数往左走</strong>，走的格数就是加的那个数。
        比如 (−4) + 6：从 −4 出发往右走 6 格，停在 2。
      </p>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-4">
        <NumberLine
          min={-6}
          max={4}
          jumps={[{ from: -4, to: 2, label: '+6，往右走 6 格' }]}
          points={[{ value: -4, label: '从 −4 出发' }]}
        />
      </div>
      <p className="leading-relaxed mb-4">
        反过来，(−2) + (−5)：站在 −2，加负数往左再走 5 格，停在 −7。
        两个负数相加，就是沿着同一个方向继续走，结果还是负数。
      </p>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
        <NumberLine
          min={-8}
          max={1}
          jumps={[{ from: -2, to: -7, label: '+（−5），往左走 5 格' }]}
          points={[{ value: -2, label: '从 −2 出发' }]}
        />
      </div>
      <p className="leading-relaxed mb-10">
        生活版算一遍：早上 −4°C，中午升了 6 度，就是 (−4) + 6 = 2°C；
        欠妈妈 3 块（−3），发了 3 块零花钱（+3），正好还清回到 0——
        这就是为什么一个数加上它的相反数等于 0。
      </p>

      <h2 className="text-xl font-bold mb-4">常见坑（家长先知道）</h2>
      <ul className="space-y-3 mb-10">
        {[
          [
            '把 −8 说得比 −3 大',
            '“8 比 3 大”只在正数那边成立。负数比的是位置：−8 更靠左，所以更小。拿温度想：−8°C 冻得多。',
          ],
          [
            '(−5) + 2 往左走',
            '加的数是正数就往右走，不管起点在哪。从 −5 往右 2 格是 −3。这个坑多半是把“题目里有负号”直接当成“往左”。',
          ],
          [
            '把 (−4) + (−4) 算成 0',
            '方向相同要继续走，到 −8。只有 +4 才能和 −4 抵消。先问“方向一样吗”，再算走多远。',
          ],
          [
            '把地下 1 层写成 0',
            '地面大堂才是 0，地下 1 层是 −1。下次坐电梯时让孩子对照按键念一遍，比讲十遍都管用。',
          ],
        ].map(([title, body]) => (
          <li
            key={title}
            className="rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-950/20 p-5"
          >
            <p className="font-semibold mb-1">⚠️ {title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {body}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mb-3">5 道原创小练</h2>
      <p className="text-muted-foreground leading-relaxed mb-5">
        先让孩子口头说思路，再点开对答案。点右上角的打印按钮，可以整页打印出来做。
      </p>
      <ol className="space-y-4 mb-10">
        {PRACTICE.map((p, i) => (
          <li
            key={i}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="font-semibold mb-1">
              {i + 1}. {p.q}
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                看答案与讲解
              </summary>
              <div className="mt-2 text-sm leading-relaxed">
                <p className="font-semibold">答案：{p.answer}</p>
                <p className="text-muted-foreground">{p.why}</p>
              </div>
            </details>
          </li>
        ))}
      </ol>

      {/* CTA */}
      <div className="print:hidden grid gap-4 sm:grid-cols-2 mb-8">
        <div className="rounded-2xl border p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200/60 dark:border-emerald-800/40">
          <p className="font-bold text-lg mb-1">🦘 2027 袋鼠数学家长作战室</p>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            报名截止、考点选择、20 周备考节奏和免费练习包——一次讲清，不错过报名窗口。
          </p>
          <Link
            href="/kangaroo-2027/"
            className="inline-block px-5 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            进入作战室 →
          </Link>
        </div>
        <div className="rounded-2xl border p-6 bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border-sky-200/60 dark:border-sky-800/40">
          <p className="font-bold text-lg mb-1">📬 每周练习单，免费订阅</p>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            每周五发一封：精选题目 + 一份可打印练习单 + 下周预告。免费，不打扰，随时退订。
          </p>
          <Link
            href="/newsletter/"
            className="inline-block px-5 py-2.5 rounded-full bg-sky-600 text-white font-semibold hover:bg-sky-700"
          >
            订阅练习单 →
          </Link>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        本页面是独立编写的家长陪学材料，讲解与练习题均为原创，与 Art of
        Problem Solving 及 Beast Academy 没有隶属、合作或背书关系。
        Beast Academy 为其所有者的商标，此处提及仅用于说明陪学对象。
      </p>
    </div>
  );
}
