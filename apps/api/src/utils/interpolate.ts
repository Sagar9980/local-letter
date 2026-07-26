// Replaces literal `{{token}}` placeholders with values from `variables`.
// Unknown tokens are left untouched rather than blanked out, so a missing
// variable is visible in the rendered output instead of silently disappearing.
export function interpolate(input: string, variables: Record<string, unknown>): string {
  return input.replace(/{{\s*([\w.]+)\s*}}/g, (match, token: string) => {
    const value = variables[token];
    return value === undefined || value === null ? match : String(value);
  });
}
