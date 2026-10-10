import type { Metadata } from 'next';
import ReadinessCheck from './ReadinessCheck';

export const metadata: Metadata = {
  title:
    'Kangaroo Readiness Check: 9 Questions to Find Your Child’s Level (Grades 3–4) - Great Seattle Life Hacks',
  description:
    'A free 9-question Math Kangaroo readiness check for grades 3–4: instant topic-by-topic strengths, a recommended practice path, and a printable 4-week plan.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/tools/kangaroo/readiness/',
  },
};

export default function KangarooReadinessPage() {
  return <ReadinessCheck />;
}
