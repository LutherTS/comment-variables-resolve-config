import { successFalse, typeError } from "../constants/bases.js";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").LintMessage} LintMessage
 * @typedef {import("../../../types/_commons/typedefs.js").ValueLocation} ValueLocation
 */

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

/* makeSuccessFalseTypeError */

/**
 * Makes a `{success: false}` object with a single error in its errors array of `{type: "error"}` based on the message it is meant to display.
 * @param {string} message The human-readable message of the error.
 * @returns A `{success: false}` object with a single error in its error array of `{type: "error"}`.
 */
export const makeSuccessFalseTypeError = (message) => ({
  ...successFalse,
  errors: [
    {
      ...typeError,
      message,
    },
  ],
});

/* extractValueLocationsFromLintMessages */

/**
 * Extracts and format the output JSON from an ESLint rule's `context.report` to turn it into Value Locations.
 * @param {LintMessage[]} lintMessages The array of LintMessages such as obtained from an `ESLint` or a `Linter` instance running.
 * @param {string} pluginName The name of the plugin being used for filtering.
 * @param {string} ruleName The name of the rule being used for filtering.
 * @returns An array of Value Locations with the value, the file path and the SourceLocation (LOC) included for each.
 */
export const extractValueLocationsFromLintMessages = (
  lintMessages,
  pluginName,
  ruleName
) =>
  /** @type {ValueLocation[]} */ (
    lintMessages
      .filter((msg) => msg.ruleId === `${pluginName}/${ruleName}`)
      .map((msg) => JSON.parse(msg.message))
  );

/* reverseFlattenedConfigData */

/**
 * Reverses the keys and the values of a flattened config data object.
 * @param {Record<string, string>} flattenedConfigData The provided flattened config data to be reversed.
 * @returns The reversed version of the provided config data.
 */
export const reverseFlattenedConfigData = (flattenedConfigData) =>
  Object.fromEntries(
    Object.entries(flattenedConfigData).map(([key, value]) => [value, key])
  );

/* normalize */

/**
 * Normalizes a Comment Variables key part.
 * @param {string} string The key part to be normalized, notably for variants.
 * @returns The normalized key part under a common algorith for the entire library.
 */
export const normalize = (string) => string.toUpperCase().replace(/\s/g, "_");

/* makeNormalizedKey */

/**
 * Normalizes and makes a Comment Variable key from the list of keys that trace to its value.
 * @param {string[]} keys The list of keys at hand in order of traversal.
 * @returns The normalized key of a Comment Variable.
 */
export const makeNormalizedKey = (keys) =>
  keys.map((e) => normalize(e)).join("#");

/* removeVariantPrefixFromVariationKey */

/**
 * Removes the variant prefix of a Comment Variable key.
 * @param {string} variationKey The variation key that needs its variant prefix removed (such as going from `EN#COMMENT` to `COMMENT`).
 * @returns The variation key with its variant prefix removed, akin to a Comment Variable key when `variations` are not in use.
 */
export const removeVariantPrefixFromVariationKey = (variationKey) =>
  variationKey.replace(/^[^#]+#/, () => "");

/* removeVariantPrefixFromVariationPlaceholder */

/**
 * Removes the variant prefix of a Comment Variable placeholder.
 * @param {string} variationPlaceholder The variation placeholder that needs its variant prefix removed.
 * @returns The variation placeholder with its variant prefix removed, akin to a Comment Variable placeholder when `variations` are not in use.
 */
export const removeVariantPrefixFromVariationPlaceholder = (
  variationPlaceholder
) => variationPlaceholder.replace(/#[^#]+#/, () => "#");

/* surroundStringByOneSpace */

/**
 * Surrounds a given string by one space right before and one space right after (`" "`).
 * @param {string} string The given string to be surrounded.
 * @returns The given string surrounded by one space.
 */
export const surroundStringByOneSpace = (string) => " " + string + " ";

/* getArraySetDifference */

/**
 * Computes the difference between two collections of strings efficiently.
 * @param {{ array: Array<string>, set: Set<string> }} a - The source collection (uses `.array`).
 * @param {{ array: Array<string>, set: Set<string> }} b - The exclusion collection (uses `.set`).
 * @returns A new `Set` containing all elements in `a` that are not in `b`.
 */
export const getArraySetDifference = (a, b) => {
  /** @type {Set<string>} */
  const results = new Set();

  for (const value of a.array) {
    if (!b.set.has(value)) {
      results.add(value);
    }
  }
  return results;
};
