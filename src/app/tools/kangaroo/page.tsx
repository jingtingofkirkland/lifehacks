import type { Metadata } from 'next';
import { KangarooPrep } from './KangarooPrep';

export const metadata: Metadata = {
  title: 'Math Kangaroo Prep for Kids (Grades 3–4) - Great Seattle Life Hacks',
  description:
    'Free Math Kangaroo-style practice for grades 3–4: a daily challenge problem, timed quizzes with explanations, and printable worksheets. Original problems written in the Kangaroo spirit.',
};

/**
 * Math Kangaroo prep hub (MVP): daily challenge, timed quiz and printable
 * worksheet for grades 3–4. All problems are original and written in the
 * Kangaroo style — the page carries a disclaimer to that effect.
 */
export default function KangarooPage() {
  return <KangarooPrep />;
}
