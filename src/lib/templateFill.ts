/** Fills {placeholder} tokens in a template string — client-safe (no fs), same convention
 *  as crossSellSettings.ts's "{count}" substitution, usable from both server and client. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((acc, [key, value]) => acc.split(`{${key}}`).join(value), template);
}
