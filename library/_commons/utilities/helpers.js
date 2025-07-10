/* escapeRegex */

/**
 * Escapes all regex characters with a `"\"` in a string to prepare it for use in a regex.
 * @param {string} string The string.
 * @returns The string with regex characters escaped.
 */
export const escapeRegex = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* makePlaceholderRegex */

/**
 * Makes a global regex for a `$COMMENT#*` placeholder.
 * @param {string} placeholder The `$COMMENT#*` placeholder that the regex is designed to find.
 * @returns The regex complete with positive lookbehind and positive lookahead to ensure the placeholder is taken into account only when surrounded by whitespace.
 */
export const makePlaceholderRegex = (placeholder) =>
  new RegExp(`(?<=\\s|^)${escapeRegex(placeholder)}(?=\\s|$)`, "g");
