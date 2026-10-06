import type { Metadata } from 'next';
import Link from 'next/link';
import { PrintButton } from '../beast-academy/_components/PrintButton';

export const metadata: Metadata = {
  title: '数学英文词卡（3–4 年级）：应用题里最常见的 40 个词 - Great Seattle Life Hacks',
  description:
    '给陪孩子读英文数学题的家长：40 个 3–4 年级应用题里最常见、最容易卡住的英文词——中文意思、地道例句和易错提示，中英对照、可打印。免费。',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/learn/math-word-cards/',
  },
};

type Word = {
  term: string;
  zh: string;
  ex: string;
  tip?: string;
};

const GROUPS: { title: string; words: Word[] }[] = [
  {
    title: '一、问总数：合起来有多少',
    words: [
      {
        term: 'altogether',
        zh: '一共、总共',
        ex: 'Jae has 5 red pens and 3 blue pens. How many pens does he have altogether?',
        tip: '看到 altogether，通常是把几部分合起来，多半是加法。',
      },
      {
        term: 'in all',
        zh: '总共、一共',
        ex: 'There are 4 rows with 6 chairs in each row. How many chairs are there in all?',
        tip: 'in all 只是在问总数；到底用加法还是乘法，要看题目给的是几部分还是每组多少。',
      },
      {
        term: 'total',
        zh: '总数；总的',
        ex: 'What is the total cost of the two books?',
      },
      {
        term: 'sum',
        zh: '和（加法的得数）',
        ex: 'What is the sum of 7 and 8?',
        tip: '问 sum 就是问加法算完的结果，不是让你再发明一个算式。',
      },
      {
        term: 'combined',
        zh: '合并的、加在一起的',
        ex: 'Their combined score is 42 points.',
      },
    ],
  },
  {
    title: '二、比多少：谁多、谁少、多多少',
    words: [
      {
        term: 'more than',
        zh: '比……多',
        ex: 'Ella has 4 more marbles than Zoe.',
        tip: '陷阱词：“A 比 B 多 4”要先找到 B 有多少，再加 4；不要看到数字就直接加。',
      },
      {
        term: 'fewer than',
        zh: '比……少（数量）',
        ex: 'There are 3 fewer red cars than blue cars.',
      },
      {
        term: 'less than',
        zh: '小于；比……少',
        ex: 'Pick a number that is less than 10.',
      },
      {
        term: 'greater than',
        zh: '大于',
        ex: 'Which of these numbers is greater than 50?',
      },
      {
        term: 'how many more ... than ...?',
        zh: '比……多多少？',
        ex: 'How many more boys than girls are in the class?',
        tip: '问“多多少”就是在比差，用减法：大数减小数。',
      },
      {
        term: 'as many as',
        zh: '和……一样多',
        ex: 'Tom caught as many fish as his dad.',
      },
      {
        term: 'difference',
        zh: '差（减法的得数）',
        ex: 'What is the difference between 13 and 6?',
        tip: 'difference between A and B 就是 A 与 B 的差，用大数减小数。',
      },
    ],
  },
  {
    title: '三、运算的零件与得数',
    words: [
      {
        term: 'product',
        zh: '积（乘法的得数）',
        ex: 'What is the product of 4 and 5?',
      },
      {
        term: 'quotient',
        zh: '商（除法的得数）',
        ex: 'What is the quotient when 24 is divided by 6?',
        tip: 'divided by 后面的数是除数：24 divided by 6 是 24 ÷ 6，别算反。',
      },
      {
        term: 'remainder',
        zh: '余数',
        ex: 'When 17 is divided by 5, what is the remainder?',
      },
      {
        term: 'addend',
        zh: '加数（被加起来的数）',
        ex: 'In 6 + 9 = 15, the addends are 6 and 9.',
      },
      {
        term: 'factor',
        zh: '因数',
        ex: '3 and 4 are factors of 12.',
      },
      {
        term: 'multiple',
        zh: '倍数',
        ex: '15 is a multiple of 5.',
        tip: 'multiple（倍数）和 factor（因数）正好是一对反义词，别混。',
      },
    ],
  },
  {
    title: '四、每份一份：分组与平均分',
    words: [
      {
        term: 'each',
        zh: '每（个、份、组）',
        ex: 'Each box holds 8 crayons. How many crayons are in 5 boxes?',
        tip: 'each 是隐藏的乘除法信号：先数清“每一份是多少、有几份”。',
      },
      {
        term: 'per',
        zh: '每……（per day = 每天）',
        ex: 'She practices piano for 30 minutes per day.',
      },
      {
        term: 'equal groups',
        zh: '相同的组、等份',
        ex: 'Divide 18 apples into equal groups of 3.',
      },
      {
        term: 'share equally',
        zh: '平均分',
        ex: 'Four friends share 20 stickers equally. How many stickers does each friend get?',
      },
      {
        term: 'groups of ...',
        zh: '每组……个',
        ex: 'He made 5 groups of 4.',
        tip: '“5 groups of 4”是 5 组、每组 4 个，一共 20，别读成 4 组每组 5 个。',
      },
      {
        term: 'divided by',
        zh: '除以',
        ex: 'What is 30 divided by 5?',
      },
    ],
  },
  {
    title: '五、剩下多少、还差多少',
    words: [
      {
        term: 'left',
        zh: '剩下的',
        ex: 'After giving 3 to his sister, how many does Ben have left?',
      },
      {
        term: 'left over',
        zh: '剩下、多出来',
        ex: 'We packed 4 boxes of 6 cupcakes. How many cupcakes are left over?',
        tip: 'left over 常和余数一起出现：分完之后多出来的那一点。',
      },
      {
        term: 'remaining',
        zh: '剩余的、剩下的',
        ex: 'What is the remaining length of the ribbon?',
      },
      {
        term: 'the rest',
        zh: '其余的、剩下的全部',
        ex: 'She ate 2 slices and saved the rest for later.',
      },
      {
        term: 'still needs',
        zh: '还差、还需要',
        ex: 'He has 7 points and still needs 5 more to win.',
        tip: '这类题问的是“还差多少到目标”：目标减已有。',
      },
    ],
  },
  {
    title: '六、倍与一半',
    words: [
      {
        term: 'twice as many',
        zh: '两倍之多',
        ex: 'Mia read twice as many pages as Leo.',
        tip: '先找“Leo 读了多少”，Mia 的是它的 2 倍。',
      },
      {
        term: 'double',
        zh: '两倍；翻倍、乘以 2',
        ex: 'Double 7 is 14.',
      },
      {
        term: 'half of',
        zh: '……的一半',
        ex: 'Half of 18 is 9.',
      },
      {
        term: 'quarter',
        zh: '四分之一；一刻钟',
        ex: 'A quarter of the class rides the bus.',
      },
    ],
  },
  {
    title: '七、数量单位与“大约”',
    words: [
      {
        term: 'dozen',
        zh: '一打 = 12 个',
        ex: 'Mom bought a dozen eggs and two dozen cookies.',
        tip: 'two dozen 是 2 × 12 = 24，不是 2 个。',
      },
      {
        term: 'pair',
        zh: '一双、一对 = 2 个',
        ex: 'One pair of shoes costs 25 dollars. How much do 3 pairs cost?',
      },
      {
        term: 'about',
        zh: '大约',
        ex: 'About how many people came to the school fair?',
        tip: '题目里有 about how many，多半是估算题，不用追求精确答案。',
      },
      {
        term: 'nearly / almost',
        zh: '差不多、将近',
        ex: 'The jar can hold nearly 100 marbles.',
      },
      {
        term: 'estimate',
        zh: '估计、估算',
        ex: 'Estimate the sum of 48 and 52.',
        tip: 'estimate 时先凑整再算，心算就能完成。',
      },
      {
        term: 'at least',
        zh: '至少、不低于',
        ex: 'You need at least 10 points to win a prize.',
      },
      {
        term: 'at most',
        zh: '至多、最多不超过',
        ex: 'Each box holds at most 8 books.',
      },
    ],
  },
];

const TOTAL_WORDS = GROUPS.reduce((n, g) => n + g.words.length, 0);

/**
 * Bilingual math word card (grades 3–4): the 40 English words that most
 * often block Chinese-speaking kids on word problems, with 中文释义，
 * one example sentence each, and parent tips. Original content, printable.
 * Companion to the Beast Academy 中文陪学 column.
 */
export default function MathWordCardsPage() {
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
          <li aria-current="page" className="text-foreground font-medium">
            数学英文词卡
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <h1 className="text-3xl font-bold">
          数学英文词卡：应用题里最常见的 {TOTAL_WORDS} 个词
        </h1>
        <PrintButton />
      </div>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        免费打印，中英对照。孩子做 Beast Academy、Math Kangaroo
        的英文应用题时，常常不是不会算，而是卡在题目里的一两个词上：
        altogether 是加还是乘？more than
        到底先找谁？这张卡把 3–4 年级最常见、最容易绊住人的{' '}
        {TOTAL_WORDS} 个词一次讲清：中文意思 + 一句地道例句 + 家长提示。
      </p>
      <p className="leading-relaxed mb-8">
        <strong>怎么用：</strong>
        先让孩子自己读题、圈出不认识的词，再一起在卡上查；查完让孩子用自己的话把题目复述一遍，能复述出来，题基本就会做了。打印出来贴在书桌边，效果最好。
      </p>

      {GROUPS.map((g) => (
        <section key={g.title} className="mb-10">
          <h2 className="text-xl font-bold mb-4">{g.title}</h2>
          <ul className="grid gap-3">
            {g.words.map((w) => (
              <li
                key={w.term}
                className="break-inside-avoid rounded-2xl border border-slate-300 dark:border-slate-700 print:border-slate-400 p-4"
              >
                <p className="mb-1">
                  <span className="text-lg font-bold print:text-black">
                    {w.term}
                  </span>
                  <span className="ml-2 font-semibold text-emerald-700 dark:text-emerald-300 print:text-black">
                    {w.zh}
                  </span>
                </p>
                <p className="text-[15px] leading-relaxed print:text-black">
                  {w.ex}
                </p>
                {w.tip && (
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed print:text-black">
                    💡 家长提示：{w.tip}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* CTA */}
      <div className="print:hidden grid gap-4 sm:grid-cols-2 mb-8">
        <div className="rounded-2xl border p-6 bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border-sky-200/60 dark:border-sky-800/40">
          <p className="font-bold text-lg mb-1">📬 免费拿更多打印资源</p>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            这张词卡是我们每周邮件的免费赠品之一。订阅后，每周五收到精选题目 +
            一份可打印练习单，新资源第一时间发你。免费，随时退订。
          </p>
          <Link
            href="/newsletter/"
            className="inline-block px-5 py-2.5 rounded-full bg-sky-600 text-white font-semibold hover:bg-sky-700"
          >
            订阅每周练习单 →
          </Link>
        </div>
        <div className="rounded-2xl border p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200/60 dark:border-emerald-800/40">
          <p className="font-bold text-lg mb-1">📖 配套：Beast Academy 中文陪学</p>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            词查完了，概念还没通？陪学专栏按章节用中文讲核心概念、常见坑，附原创小练（可打印）。
          </p>
          <Link
            href="/learn/beast-academy/"
            className="inline-block px-5 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            去看陪学专栏 →
          </Link>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        本词卡为本站原创整理的家长陪学材料，与 Art of Problem Solving、Beast
        Academy 及 Math Kangaroo
        没有隶属、合作或背书关系；相关名称为其所有者的商标，此处提及仅用于说明适用场景。
      </p>
    </div>
  );
}
