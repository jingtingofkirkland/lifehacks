import type { Metadata } from 'next';
import { GradeIndex } from '../_components/GradeIndex';
import { practiceProblemsForGrade } from '@/lib/practice-seo';

export const metadata: Metadata = {
  title: 'Grade 3 Math Kangaroo Practice Problems - Great Seattle Life Hacks',
  description: `16 free grade 3 Math Kangaroo-style practice problems with answers and step-by-step explanations. Multiple choice, printable, and original — written in the Kangaroo spirit.`,
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/practice/kangaroo/grade-3/',
  },
};

export default function Grade3IndexPage() {
  const problems = practiceProblemsForGrade('grade-3');
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'ItemList',
            name: 'Grade 3 Math Kangaroo Practice Problems',
            itemListElement: problems.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.title,
              url: p.url,
            })),
          }),
        }}
      />
      <GradeIndex grade="grade-3" />
    </>
  );
}
