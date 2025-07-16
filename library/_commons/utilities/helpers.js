import { successFalse, typeError } from "../constants/bases.js";

/**
 * @typedef {import("../../../types/typedefs.js").LintMessage} LintMessage
 * @typedef {import("../../../types/typedefs.js").ValueLocation} ValueLocation
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
 *
 * @param {LintMessage[]} lintMessages
 * @param {string} pluginName
 * @param {string} ruleName
 * @returns
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
