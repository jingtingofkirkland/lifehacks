import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title:
    'Math Kangaroo 2027 Washington (WA) War Room: Dates, Centers & Invitation Codes - Great Seattle Life Hacks',
  description:
    'A Washington-state guide to Math Kangaroo 2027 for parents: key deadlines and fees, how WA centers and invitation codes actually work, Eastside center options, pitfalls to avoid, and free local prep.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/kangaroo-2027-wa/',
  },
};

const KEY_DATES = [
  {
    label: 'Registration opened',
    value: 'September 15, 2026',
    note: 'Student registration for the 2027 season is open now at proctored centers.',
  },
  {
    label: 'Regular registration deadline',
    value: 'December 31, 2026',
    note: 'Register by then to pay the regular $20 fee. Roughly 12 weeks left from mid-October.',
  },
  {
    label: 'Late registration deadline',
    value: 'February 1, 2027',
    note: 'The late window (Jan 1 – Feb 1) costs $35 per student, seats permitting.',
  },
  {
    label: 'Competition day',
    value: 'Thursday, March 18, 2027',
    note: 'One day only — there is no make-up date. Put it on the family calendar now.',
  },
];

const WA_STEPS = [
  {
    title: "First: is your child's school a center?",
    body: 'Many WA elementary schools host their own center. If yours does, ask the school office, PTA, or math club for the Center Invitation Code — school centers are private and only enroll their own students. Some do not even appear on the public registration page, so not seeing your school listed does not mean it is not running one.',
  },
  {
    title: 'No school center? Pick a public WA center',
    body: 'Public centers accept students from any school, and only in-the-classroom centers can be public. You must register at a center in the state where you live, so WA families register at WA centers. The Eastside has plenty (see below) — choose by drive time, because competition day is a school-day afternoon for most families.',
  },
  {
    title: 'Pay and save the confirmation',
    body: '$20 per student through December 31, 2026 ($35 January 1 – February 1). Registration is at your child\'s actual grade level — competing at a lower grade is not allowed. There are no cancellations or refunds, and special accommodations must be requested at enrollment, so double-check the center and grade before you pay.',
  },
];

const EASTSIDE_CENTERS = [
  'Jing Mei Elementary School — Bellevue',
  'Enatai Elementary School — Bellevue',
  'Somerset Elementary — Bellevue',
  'Woodridge Elementary School — Bellevue',
  'AoPS Academy Bellevue — Bellevue',
  'RSM Bellevue & RSM Factoria — Bellevue',
  'Think Academy Bellevue — Bellevue',
  'Mathnasium of Bellevue & Eastgate — Bellevue',
  'Medina Elementary School — Medina',
  'Lakeview Elementary School — Kirkland',
  'Alexander Graham Bell Elementary School — Kirkland',
  'Carl Sandburg Elementary School — Kirkland',
  'International Community School — Kirkland',
  'Mathnasium of Kirkland — Kirkland',
  'Samantha Smith Elementary — Sammamish',
  'Elizabeth Blackwell Elementary — Sammamish',
  'Mathnasium of Sammamish — Sammamish',
  'Kumon of Redmond — Redmond',
  'Prime Factor at Overlake — Redmond',
  'Mathnasium of Redmond — Redmond',
  'Meridian Park Elementary — Shoreline',
  'Math Kangaroo Kenmore — Kenmore',
];

const PITFALLS = [
  {
    title: 'Waiting on a school code that never comes',
    body: 'If your school runs an invitation-only center, you cannot register there without the code, and codes are shared inside the school community only. Ask once, early. If there is no school center (or no code by November), switch to a public center while seats remain instead of riding the wait-and-see train into the $35 window.',
  },
  {
    title: 'Assuming popular Eastside centers will have seats in December',
    body: 'Math Kangaroo itself warns that in some areas demand is greater than center capacity — the Eastside is exactly such an area. The regular window closes December 31, but a full center is full whenever it fills. Families who register in October keep their first-choice location.',
  },
  {
    title: 'Registering at the wrong grade level',
    body: 'Kids compete at their actual school grade level; playing down a level is not allowed. This trips up families of advanced students in both directions — register the grade your child is enrolled in, not the math level they work at.',
  },
  {
    title: 'Double-booking competition Thursday',
    body: 'The 2027 contest is Thursday, March 18, 2027, and there is no make-up date for any reason. An absent student still receives the gift, ribbon, and booklet, but no score. Check school and activity calendars before you pay — fees are non-refundable.',
  },
  {
    title: 'Overlooking the kindergarten fine print',
    body: 'Kindergarteners are welcome, but they take the Grade 1 test and must be able to read and answer independently. If your kindergartener is not reading independently yet, a low-pressure practice year (daily problems at home) beats a frustrating contest morning.',
  },
];

const FAQS = [
  {
    q: 'Our school is not listed as a center. Can my child still compete?',
    a: 'Yes. Register at any public WA center — your child does not need to attend that school. Alternatively, Washington schools can still apply to host their own center for free by December 15, 2026 (a center needs at least 10 students), and parents are allowed to help run it. Ask your PTA whether hosting is on the table for next season.',
  },
  {
    q: 'What exactly is an invitation code, and where do I get one?',
    a: 'Private centers enroll only their own students. The Center Manager gives enrolled families a confidential Invitation Code to enter on the registration page, and families are asked not to share it outside their school community. If your school is a center, the code comes from the school — front office, PTA, or math club coordinator — not from Math Kangaroo\'s public website.',
  },
  {
    q: 'Can we register at a center just across the state line?',
    a: 'No. Math Kangaroo asks students to register at a center in the state where they reside, so Washington families use WA centers. With dozens of centers across the Puget Sound area, there is almost certainly one within a reasonable drive.',
  },
  {
    q: 'Is there an online option for WA families?',
    a: 'Some centers run proctored online testing (at the center, or center-managed at home) with official scores and rankings. There is also a self-proctored virtual option that gives a real score and a ranking range, but no gifts, awards, or official ranking. Availability changes during the season, so check the official registration page for what is open right now.',
  },
  {
    q: 'What does competition day look like for grades 3–4?',
    a: 'A 75-minute multiple-choice test: 24 questions for grades 1–4 (30 for grades 5–12), worth 3, 4, or 5 points, with no penalty for wrong answers. Every registered student gets a mathematical gift and a participation ribbon on the day. Centers confirm exact arrival times and what to bring by email in early 2027.',
  },
  {
    q: 'We missed December 31. Is it too late?',
    a: 'Not yet — late registration runs January 1 to February 1, 2027 at $35 per student, if your chosen center still has seats. After February 1, registration closes for the season. Results are typically shared in May; your center will pass along the specifics.',
  },
];

/**
 * /kangaroo-2027-wa/: the Washington-state layer on top of the national
 * Math Kangaroo 2027 war room — how WA centers and invitation codes
 * work, Eastside center options, WA-specific pitfalls, and FAQs.
 * Facts are from mathkangaroo.org (checked October 2026); we are not
 * affiliated with Math Kangaroo USA.
 */
export default function Kangaroo2027WaPage() {
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
            <Link href="/kangaroo-2027/" className="hover:underline">
              Math Kangaroo 2027
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground font-medium">
            Washington
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-3">
        Math Kangaroo 2027 in Washington State 🦘
      </h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        The national guides give you the dates and the fee. What they
        can&apos;t give you is the Washington layer: how centers around
        Seattle and the Eastside actually fill up, how invitation-only school
        centers work, and which deadlines bite WA families first. That is
        what this page is for. New here? Start with the{' '}
        <Link href="/kangaroo-2027/" className="text-primary hover:underline">
          national Math Kangaroo 2027 war room
        </Link>
        , then come back for the local playbook.
      </p>

      <h2 className="text-xl font-bold mb-4">The dates that matter in WA</h2>
      <ul className="grid gap-4 sm:grid-cols-2 mb-4">
        {KEY_DATES.map((item) => (
          <li
            key={item.label}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {item.label}
            </p>
            <p className="font-semibold mb-1">{item.value}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.note}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground mb-10">
        Source:{' '}
        <a
          href="https://mathkangaroo.org/mks/registration/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Math Kangaroo USA registration page
        </a>
        . The regular window closes December 31, 2026 — for WA families the
        real deadline is whenever your preferred center fills, which can be
        earlier.
      </p>

      <h2 className="text-xl font-bold mb-4">
        How registration works in Washington (3 steps)
      </h2>
      <ol className="space-y-4 mb-10">
        {WA_STEPS.map((step, i) => (
          <li
            key={step.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex gap-4"
          >
            <span
              aria-hidden
              className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 font-bold flex items-center justify-center"
            >
              {i + 1}
            </span>
            <div>
              <p className="font-semibold mb-1">{step.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="text-xl font-bold mb-4">
        WA centers &amp; invitation codes, explained
      </h2>
      <div className="space-y-4 mb-6">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="font-semibold mb-1">🔒 Private centers (invitation only)</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most school centers are private: they enroll only their own
            students, and the Center Manager hands families a confidential
            invitation code for the registration page. Some private centers
            are hidden from everyone outside the school, so searching the
            public list and not finding your school proves nothing — ask the
            school directly.
          </p>
        </section>
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="font-semibold mb-1">🔓 Public centers (open to everyone)</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Public centers take students from any school and any grade, and
            only in-the-classroom centers can be public. If your school has
            no center — or its code never reaches you — a public center is
            your reliable path. In past seasons these spots have been the
            first to disappear on the Eastside.
          </p>
        </section>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        Recent official center listings included these Eastside options, from
        Bellevue and Kirkland to Redmond, Sammamish, Medina, Shoreline, and
        Kenmore:
      </p>
      <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 mb-4 text-sm leading-relaxed">
        {EASTSIDE_CENTERS.map((center) => (
          <li key={center} className="flex gap-2">
            <span aria-hidden>📍</span>
            <span>{center}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground leading-relaxed mb-10">
        Centers change every season and new ones are still being added for
        2027, so treat this as a scouting list, not a promise. The live list
        on the{' '}
        <a
          href="https://mathkangaroo.org/mks/registration/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          official registration page
        </a>{' '}
        is the final word.
      </p>

      <h2 className="text-xl font-bold mb-4">Five WA parent pitfalls</h2>
      <div className="space-y-4 mb-10">
        {PITFALLS.map((pitfall, i) => (
          <section
            key={pitfall.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="font-semibold mb-1">
              {i + 1}. {pitfall.title}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {pitfall.body}
            </p>
          </section>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Prep, the local way</h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Once you are registered, the prep is the same 20 weeks as everywhere
        — the difference is that around here, a lot of kids do it together:
        school math clubs, PTA problem-of-the-week boards, and living-room
        practice with friends. Our free tools slot into any of those:
      </p>
      <div className="space-y-4 mb-10">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="font-semibold mb-1">One problem a day</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            A fresh Kangaroo-style problem every day, with the answer
            explained — sized for breakfast-table practice.
          </p>
          <Link
            href="/tools/kangaroo/"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Open the daily problem &amp; timed quiz →
          </Link>
        </section>
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="font-semibold mb-1">Timed practice (8 questions, 12 minutes)</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Contest pacing is a skill of its own. The timed quiz teaches
            skip-mark-return better than any pep talk, and grade-level problem
            sets let you go deeper.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link
              href="/practice/kangaroo/grade-3/"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Grade 3 problem set →
            </Link>
            <Link
              href="/practice/kangaroo/grade-4/"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Grade 4 problem set →
            </Link>
          </p>
        </section>
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="font-semibold mb-1">The 20-week plan</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            The week-by-week schedule from first problem to contest morning
            lives in the national war room — week 1 starts in October, so you
            are right on time.
          </p>
          <Link
            href="/kangaroo-2027/"
            className="text-sm font-semibold text-primary hover:underline"
          >
            See the 20-week prep plan →
          </Link>
        </section>
      </div>

      <div className="rounded-2xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-950/30 p-6 mb-10">
        <p className="font-semibold mb-1">
          📬 Get the free printable Kangaroo 2027 pack
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The one-page registration checklist (with the WA center questions to
          ask your school), a week-by-week prep tracker, and a fresh printable
          worksheet every Friday — free, no spam, unsubscribe anytime.
        </p>
        <Link
          href="/newsletter/"
          className="inline-block rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 text-sm"
        >
          Get the free printable pack + weekly worksheet
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">Washington parent FAQ</h2>
      <div className="space-y-4 mb-10">
        {FAQS.map((faq) => (
          <section
            key={faq.q}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="font-semibold mb-1">{faq.q}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </p>
          </section>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/70 max-w-xl leading-relaxed">
        Dates, fees, center rules, and availability above are from Math
        Kangaroo USA (mathkangaroo.org), checked October 2026. Centers open,
        fill, and occasionally close during the season — always confirm on
        the official site before you pay. Our practice problems are original
        and written in the Kangaroo spirit; we are not affiliated with or
        endorsed by Math Kangaroo USA, and this page is an independent
        parent guide, not an official registration channel.
      </p>
    </div>
  );
}
