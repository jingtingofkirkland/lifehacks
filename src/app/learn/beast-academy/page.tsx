import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Beast Academy 中文陪学 - Great Seattle Life Hacks',
  description:
    '给陪孩子学 Beast Academy 的华人家长：按章节用中文讲清核心概念、常见坑，附原创小练（可打印）。第一篇：整数（负数、数轴与加法）。',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/learn/beast-academy/',
  },
};

const ARTICLES = [
  {
    href: '/learn/beast-academy/integers/',
    emoji: '🧭',
    title: '整数（Integers）：0 左边的新世界',
    body: '负数住在数轴哪边、两个负数谁大谁小、加法为什么是“在数轴上走路”——附温度、电梯、欠钱三个生活类比和 5 道原创小练。',
    meta: 'BA4 · 整数',
  },
];

/**
 * Index for the Beast Academy Chinese companion series: original
 * Chinese-language explainers that help parents follow along with the
 * chapters their kids are working through. First article: Integers.
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
            Beast Academy 中文陪学
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Beast Academy 中文陪学</h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        孩子在用 Beast Academy 学数学，家长想陪读、想知道这一章到底在讲什么？
        这个专栏按章节把核心概念用中文讲一遍：孩子在学什么、怎么跟孩子解释、
        哪些坑最容易踩，再附几道原创小练。讲解和题目都是我们自己写的，
        陪孩子过一遍就能上手。
      </p>

      <h2 className="text-xl font-bold mb-4">已发布</h2>
      <ul className="grid gap-4 mb-10">
        {ARTICLES.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className="block rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:border-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                {a.meta}
              </p>
              <p className="font-semibold mb-1">
                <span aria-hidden>{a.emoji} </span>
                {a.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {a.body}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
        更多章节陆续更新中。想第一时间收到新篇和每周练习单，
        可以<Link href="/newsletter/" className="text-emerald-700 dark:text-emerald-300 font-semibold hover:underline">免费订阅我们的每周邮件</Link>。
      </p>

      <p className="text-xs text-muted-foreground leading-relaxed">
        本专栏是独立编写的家长陪学材料，讲解与练习题均为原创，与 Art of
        Problem Solving 及 Beast Academy 没有隶属、合作或背书关系。
        Beast Academy 为其所有者的商标，此处提及仅用于说明陪学对象。
      </p>
    </div>
  );
}
