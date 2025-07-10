/* escapeRegex */

/**
 * Escapes all regex characters with a `"\"` in a string to prepare it for use in a regex.
 * @param {string} string The string.
 * @returns The string with regex characters escaped.
 */
export const escapeRegex = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* makeIsolatedStringRegex */

/**
 * Makes a global regex for a given string that ensures it is surrounded by whitespace.
 * @param {string} string The string.
 * @returns The regex complete with positive lookbehind and positive lookahead to ensure the string is taken into account only when surrounded by whitespace.
 */
export const makeIsolatedStringRegex = (string) =>
  new RegExp(`(?<=\\s|^)${escapeRegex(string)}(?=\\s|$)`, "g");
