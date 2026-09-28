import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  buildQuizJsonLd,
  findPracticeProblem,
  metaDescription,
  metaTitle,
  practiceProblemsForGrade,
} from '@/lib/practice-seo';
import {
  PracticeProblemView,
  type PracticeNavLink,
} from '../../_components/PracticeProblemView';

export const dynamicParams = false;

export function generateStaticParams() {
  return practiceProblemsForGrade('grade-3').map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = findPracticeProblem('grade-3', params.slug);
  if (!p) return {};
  return {
    title: `${metaTitle(p)} - Great Seattle Life Hacks`,
    description: metaDescription(p),
    alternates: { canonical: p.url },
  };
}

export default function Grade3ProblemPage({
  params,
}: {
  params: { slug: string };
}) {
  const problems = practiceProblemsForGrade('grade-3');
  const idx = problems.findIndex((p) => p.slug === params.slug);
  if (idx === -1) notFound();
  const p = problems[idx];
  const q = p.question;

  const nav = (j: number): PracticeNavLink | null =>
    j < 0 || j >= problems.length
      ? null
      : { title: problems[j].title, path: problems[j].path };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildQuizJsonLd(p)),
        }}
      />
      <PracticeProblemView
        problem={{
          gradeLabel: p.gradeLabel,
          title: p.title,
          category: q.category,
          points: q.points,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
        }}
        gradeIndexPath="/practice/kangaroo/grade-3/"
        prev={nav(idx - 1)}
        next={nav(idx + 1)}
      />
    </>
  );
}
