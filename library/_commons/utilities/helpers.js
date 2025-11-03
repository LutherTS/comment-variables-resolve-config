import { successFalse, typeError } from "../constants/bases.js";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").LintMessage} LintMessage
 * @typedef {import("../../../types/_commons/typedefs.js").ValueLocation} ValueLocation
 */

/* escapeRegex */

/**
 * $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX
 * @param {string} string $COMMENT#JSDOC#PARAMS#STRINGA
 * @returns $COMMENT#JSDOC#RETURNS#ESCAPEREGEX
 */
export const escapeRegex = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* makeIsolatedStringRegex */

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKEISOLATEDSTRINGREGEX
 * @param {string} string $COMMENT#JSDOC#PARAMS#STRINGA
 * @returns $COMMENT#JSDOC#RETURNS#MAKEISOLATEDSTRINGREGEX
 */
export const makeIsolatedStringRegex = (string) =>
  new RegExp(`(?<=\\s|^)${escapeRegex(string)}(?=\\s|$)`, "g");

/* makeSuccessFalseTypeError */

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKESUCCESSFALSETYPEERROR
 * @param {string} message $COMMENT#JSDOC#PARAMS#MESSAGE
 * @returns $COMMENT#JSDOC#RETURNS#MAKESUCCESSFALSETYPEERROR
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
 * $COMMENT#JSDOC#DEFINITIONS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES
 * @param {LintMessage[]} lintMessages $COMMENT#JSDOC#PARAMS#LINTMESSAGES
 * @param {string} pluginName $COMMENT#JSDOC#PARAMS#PLUGINNAME
 * @param {string} ruleName $COMMENT#JSDOC#PARAMS#RULENAME
 * @returns $COMMENT#JSDOC#RETURNS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES
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
 * $COMMENT#JSDOC#DEFINITIONS#REVERSEFLATTENEDCONFIGDATA
 * @param {Record<string, string>} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAA
 * @returns $COMMENT#JSDOC#RETURNS#REVERSEFLATTENEDCONFIGDATA
 */
export const reverseFlattenedConfigData = (flattenedConfigData) =>
  Object.fromEntries(
    Object.entries(flattenedConfigData).map(([key, value]) => [value, key])
  );

/* normalize */

/**
 * $COMMENT#JSDOC#DEFINITIONS#NORMALIZE
 * @param {string} string $COMMENT#JSDOC#PARAMS#STRINGB
 * @returns $COMMENT#JSDOC#RETURNS#NORMALIZE
 */
export const normalize = (string) => string.toUpperCase().replace(/\s/g, "_");

/* makeNormalizedKey */

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKENORMALIZEDKEY
 * @param {string[]} keys $COMMENT#JSDOC#PARAMS#KEYS
 * @returns $COMMENT#JSDOC#RETURNS#MAKENORMALIZEDKEY
 */
export const makeNormalizedKey = (keys) =>
  // keys.map((e) => e.toUpperCase().replace(/\s/g, "_")).join("#");
  keys.map((e) => normalize(e)).join("#");

/* removeVariantPrefixFromVariationKey */

/**
 * $COMMENT#JSDOC#DEFINITIONS#REMOVEVARIANTPREFIXFROMVARIATIONKEY
 * @param {string} variationKey $COMMENT#JSDOC#PARAMS#VARIATIONKEY
 * @returns $COMMENT#JSDOC#RETURNS#REMOVEVARIANTPREFIXFROMVARIATIONKEY
 */
export const removeVariantPrefixFromVariationKey = (variationKey) =>
  variationKey.replace(/^[^#]+#/, () => "");

/* getArraySetDifference */

/**
 * $COMMENT#JSDOC#DEFINITIONS#GETARRAYSETDIFFERENCE
 * @param {{ array: Array<string>, set: Set<string> }} a - $COMMENT#JSDOC#PARAMS#SOURCEA
 * @param {{ array: Array<string>, set: Set<string> }} b - $COMMENT#JSDOC#PARAMS#EXCLUSIONB
 * @returns $COMMENT#JSDOC#RETURNS#GETARRAYSETDIFFERENCE
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
