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

/**
 * Merge extra query parameters into a Tally form URL. Used to carry
 * hidden-field values into a submission — e.g. the readiness check passes
 * a compact report summary (`score`, `topics`) so the emailed report can
 * be assembled from the submission record by hand. Per Tally's hidden
 * fields docs, a value is only recorded when the form has a hidden field
 * with the same name, so the names used here must exist in the form.
 */
export function appendTallyParams(
  url: string,
  params: Record<string, string>,
): string {
  const merged = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    merged.searchParams.set(key, value);
  }
  return merged.toString();
}
