/**
 * Newsletter signup helpers.
 *
 * The signup form is a Tally embed. Its URL comes from the
 * NEXT_PUBLIC_TALLY_FORM_URL environment variable so the form itself can
 * be created (a 3-minute job) after this page ships. While the variable
 * is empty the page renders an honest "coming soon" placeholder instead
 * of a fake form.
 */
export function getNewsletterFormUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_TALLY_FORM_URL;
  const url = raw?.trim();
  return url ? url : null;
}
