import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Beast Academy 中文陪学 - Great Seattle Life Hacks',
  description:
    '给华人家长的 Beast Academy 中文陪学指南：按章节拆解核心概念、例题讲法、常见错误和可打印小练。',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/learn/beast-academy/',
  },
};

const ARTICLES = [
  {
    href: '/learn/beast-academy/ba4-ch9-integers/',
    emoji: '🌡️',
    title: 'BA4 第 9 章「整数」陪学指南',
    desc: '负数第一次登场：数轴、比大小、整数加法。3 个例题精讲 + 4 个常见错误 + 5 道可打印小练。',
    tag: 'Level 4 · Chapter 9',
  },
];

/**
 * Index for the Beast Academy Chinese companion series: short, original
 * Chinese-language guides that help parents coach kids through each chapter.
 */
export default function BeastAcademyIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground font-medium">
            Beast Academy 陪学
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Beast Academy 中文陪学</h1>
      <p className="text-muted-foreground mb-2 leading-relaxed">
        Chinese companion guides for parents whose kids are working through
        Beast Academy.
      </p>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        孩子在学 Beast Academy，家长想陪却不知道怎么讲？这个系列按章节用中文拆解：
        每章讲什么、例题怎么跟孩子讲、最容易错的地方在哪，再配几道可以打印的小练。
        内容为独立原创讲解，与 Art of Problem Solving / Beast Academy 无隶属关系。
      </p>

      <ul className="grid gap-4 mb-10">
        {ARTICLES.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className="block rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start gap-4">
                <p className="text-3xl" aria-hidden>
                  {a.emoji}
                </p>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    {a.tag}
                  </p>
                  <p className="font-semibold mb-1">{a.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {a.desc}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted-foreground leading-relaxed">
        更多章节陆续更新中。想每周收到新的陪学指南和免费练习单，去{' '}
        <Link href="/newsletter/" className="underline hover:no-underline">
          订阅每周练习单
        </Link>
        。
      </p>
    </div>
  );
}
