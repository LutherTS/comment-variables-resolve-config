import { successFalse, typeError } from "../constants/bases.js";

/**
 * @typedef {import("../../../types/typedefs.js").LintMessage} LintMessage
 * @typedef {import("../../../types/typedefs.js").ValueLocation} ValueLocation
 */

/* escapeRegex */

/**
 * $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX
 * @param {string} string $COMMENT#JSDOC#PARAMS#STRING
 * @returns $COMMENT#JSDOC#RETURNS#ESCAPEREGEX
 */
export const escapeRegex = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* makeIsolatedStringRegex */

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKEISOLATEDSTRINGREGEX
 * @param {string} string $COMMENT#JSDOC#PARAMS#STRING
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
