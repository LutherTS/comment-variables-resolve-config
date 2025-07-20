import { ESLint } from "eslint";
import markdown from "@eslint/markdown";

import {
  commentVariablesPluginName,
  resolveRuleName,
  compressRuleName,
  allJSTSFileGlobs,
  allMDFileGlobs,
  allMDVirtualJSTSFileGlobs,
  typeScriptAndJSXCompatible,
} from "../constants/bases.js";
import { ruleNames_makeRules } from "../constants/rules.js";

/* coreCommentsFlow */

// $COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF $COMMENT#FORCOMPOSEDVARIABLES#RULENAME

/**
 * $COMMENT#JSDOC#DEFINITIONS#CORECOMMENTSFLOW
 * @param {typeof resolveRuleName | typeof compressRuleName} ruleName $COMMENT#JSDOC#PARAMS#RULENAMECURRENTLYUSED
 * @param {string[]} ignores $COMMENT#JSDOC#PARAMS#IGNORES
 * @param {{[key: string]: string}} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAEITHER
 * @returns
 */
const coreCommentsFlow = async (ruleName, ignores, flattenedConfigData) => {
  const eslint = new ESLint({
    fix: true,
    errorOnUnmatchedPattern: false,
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: allJSTSFileGlobs,
        ignores,
        languageOptions: typeScriptAndJSXCompatible,
        plugins: {
          [commentVariablesPluginName]: {
            rules: {
              [ruleName]: ruleNames_makeRules[ruleName](flattenedConfigData),
            },
          },
        },
        rules: {
          [`${commentVariablesPluginName}/${ruleName}`]: "warn",
        },
      },
      {
        files: allMDFileGlobs,
        ignores,
        plugins: { markdown },
        processor: "markdown/markdown",
      },
      {
        files: allMDVirtualJSTSFileGlobs,
        ignores,
        languageOptions: typeScriptAndJSXCompatible,
        rules: {
          [`${commentVariablesPluginName}/${ruleName}`]: "warn",
        },
      },
    ],
  });

  const results = await eslint.lintFiles([
    ...allJSTSFileGlobs,
    ...allMDFileGlobs,
  ]);
  await ESLint.outputFixes(results);

  console.log("Results are:", results);

  const resolvedOrCompressed =
    ruleName === resolveRuleName
      ? "Resolved"
      : ruleName === compressRuleName
      ? "Compressed"
      : "Unknown rule name'd";

  const total = results.reduce((sum, r) => {
    const add = r.output ? 1 : 0;
    return sum + add;
  }, 0);

  console.log(
    `✅ ${resolvedOrCompressed} comments on ${total} file${
      total === 1 ? "" : "s"
    }.`
  );
};

/* resolveCommentsFlow */

/**
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMMENTSFLOW
 * @param {string[]} ignores $COMMENT#JSDOC#PARAMS#IGNORES
 * @param {{[key: string]: string}} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA
 * @returns
 */
export const resolveCommentsFlow = async (ignores, flattenedConfigData) =>
  coreCommentsFlow(resolveRuleName, ignores, flattenedConfigData);

/* compressCommentsFlow */

/**
 * $COMMENT#JSDOC#DEFINITIONS#COMPRESSCOMMENTSFLOW
 * @param {string[]} ignores $COMMENT#JSDOC#PARAMS#IGNORES
 * @param {{[key: string]: string}} reversedFlattenedConfigData $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA
 * @returns
 */
export const compressCommentsFlow = async (
  ignores,
  reversedFlattenedConfigData
) => coreCommentsFlow(compressRuleName, ignores, reversedFlattenedConfigData);
