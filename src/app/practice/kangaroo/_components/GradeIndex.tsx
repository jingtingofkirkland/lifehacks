/**
 * Server-rendered index of practice problems for one grade band.
 * Lists every problem as a crawlable link — this page is the discovery
 * hub that search engines (and parents) use to reach the 40 leaf pages.
 */
import Link from 'next/link';
import {
  gradeLabel,
  practiceProblemsForGrade,
  type PracticeGrade,
} from '@/lib/practice-seo';

export function GradeIndex({ grade }: { grade: PracticeGrade }) {
  const problems = practiceProblemsForGrade(grade);
  const label = gradeLabel(grade);
  const otherGrade: PracticeGrade = grade === 'grade-3' ? 'grade-4' : 'grade-3';
  const otherLabel = gradeLabel(otherGrade);

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
          <li>
            <Link href="/tools/kangaroo/" className="hover:underline">
              Kangaroo Prep
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground font-medium">
            {label} Practice Problems
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-3">
        {label} Math Kangaroo Practice Problems
      </h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        {problems.length} free {label.toLowerCase()} practice problems in the
        Math Kangaroo spirit — multiple choice, with answers and step-by-step
        explanations. Click any problem to solve it interactively, or try the{' '}
        <Link
          href="/tools/kangaroo/"
          className="text-emerald-700 dark:text-emerald-300 font-semibold hover:underline"
        >
          timed 8-question quiz
        </Link>
        . Looking for a different level? See{' '}
        <Link
          href={`/practice/kangaroo/${otherGrade}/`}
          className="text-emerald-700 dark:text-emerald-300 font-semibold hover:underline"
        >
          {otherLabel} practice problems
        </Link>
        .
      </p>

      <ul className="grid gap-3 mb-10">
        {problems.map((p) => (
          <li key={p.slug}>
            <Link
              href={p.path}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 shrink-0">
                {p.question.points} pts
              </span>
              <span className="font-semibold">{p.title}</span>
              <span className="ml-auto text-xs text-muted-foreground shrink-0">
                {p.question.category}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground leading-relaxed">
        All problems are original, written for Great Seattle Life Hacks in the
        Math Kangaroo spirit. They are not past contest questions and this
        site is not affiliated with or endorsed by Math Kangaroo.
      </p>
    </div>
  );
}
