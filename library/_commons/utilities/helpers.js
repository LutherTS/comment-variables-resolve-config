import { successFalse, typeError } from "../constants/bases.js";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").LintMessage} LintMessage
 * @typedef {import("../../../types/_commons/typedefs.js").ValueLocation} ValueLocation
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

/* reverseConfigData */

/**
 * $COMMENT#JSDOC#DEFINITIONS#REVERSECONFIGDATA
 * @param {Record<string, string>} configData $COMMENT#JSDOC#PARAMS#CONFIGDATATOREVERSE
 * @returns $COMMENT#JSDOC#RETURNS#REVERSECONFIGDATA
 */
export const reverseConfigData = (configData) =>
  Object.fromEntries(
    Object.entries(configData).map(([key, value]) => [value, key])
  );
