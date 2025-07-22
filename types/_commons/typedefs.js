import { placeholderMessageId } from "../../library/_commons/constants/bases.js";

/**
 * @typedef {import('eslint').Linter.LintMessage} LintMessage
 */

/**
 * @typedef {import("@typescript-eslint/utils")
 *   .TSESTree
 *   .SourceLocation
 * } SourceLocation
 * @typedef {{
 *   value: string;
 *   filePath: string;
 *   loc: SourceLocation
 * }} ValueLocation
 */

/**
 * @typedef {{
 *   composedVariablesOnly?: false
 *   makePlaceholders?: undefined;
 * } | {
 *   composedVariablesOnly: true;
 *   makePlaceholders?: never;
 * } | {
 *   composedVariablesOnly?: false
 *   makePlaceholders: {
 *     composedValues_originalKeys: Record<string, string>;
 *     aliasValues_originalKeys: Record<string, string>;
 *     regularValuesOnly_originalKeys: Record<string, string>;
 *     aliases_flattenedKeys: Record<string, string>;
 *   };
 * }} RuleOptions
 * @typedef {import('@typescript-eslint/utils').TSESLint.RuleModule<typeof placeholderMessageId, [RuleOptions], unknown>} ExtractRule
 */

/**
 * @typedef {Record<string, unknown>} ConfigData
 *
 * @typedef {{
 *   success: false;
 *   errors: Array<{ type: "error" | "warning"; message: string }>;
 * } | {
 *   success: true;
 *   configDataMap: Map<string, {value: string; source: string}>;
 * }} FlattenConfigDataResults
 */

export {}; // Makes the file a module.
