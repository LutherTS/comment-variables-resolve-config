import tseslint from "typescript-eslint";
type TSESLintParser = typeof tseslint.parser;

import type { TSESTree, TSESLint } from "@typescript-eslint/utils";
type SourceLocation = TSESTree.SourceLocation;

import type { Linter } from "eslint";

// must be manually maintained

/**
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIG
 * @param {string} configPath $COMMENT#JSDOC#PARAMS#CONFIGPATHA
 * @returns $COMMENT#JSDOC#RETURNS#RESOLVECONFIG
 */
declare const resolveConfig: (configPath: string) => Promise<
  | {
      success: false;
      errors: Array<{
        type: "error" | "warning";
        message: string;
      }>;
    }
  | {
      success: true;
      configPath: string;
      passedIgnores: string[];
      config: object;
      rawConfigAndImportPaths: string[];
      originalFlattenedConfigData: {
        [k: string]: string;
      };
      flattenedConfigData: Record<string, string>;
      aliases_flattenedKeys: Record<string, string>;
      reversedFlattenedConfigData: {
        [k: string]: string;
      };
      keys_valueLocations: {
        [x: string]: {
          value: string;
          filePath: string;
          loc: SourceLocation;
        };
      };
      nonAliasesKeys_valueLocations: Record<
        string,
        {
          value: string;
          filePath: string;
          loc: SourceLocation;
        }
      >;
      aliasesKeys_valueLocations: Record<
        string,
        {
          value: string;
          filePath: string;
          loc: SourceLocation;
        }
      >;
      lintConfigImports: boolean | undefined;
      myIgnoresOnly: boolean | undefined;
    }
>;

export default resolveConfig;

export const defaultConfigFileName: "comments.config.js";
export const templateFileName: "comments.template.js";
export const exampleFileName: "comments.example.js";
export const commentVariablesPluginName: "comment-variables";
export const extractRuleName: "extract-object-string-literal-values";
export const placeholderMessageId: "placeholderMessageId";
export const placeholderDataId: "placeholderDataId";
export const configFlag: "--config";
export const lintConfigImportsFlag: "--lint-config-imports";
export const myIgnoresOnlyFlag: "--my-ignores-only";
export const $COMMENT: "$COMMENT";

export const knownIgnores: [
  "node_modules",
  "dist",
  "out",
  ".next",
  ".react-router",
  ".parcel-cache",
  ".react-router-parcel"
];

export const successFalse: Readonly<{
  success: false;
}>;
export const successTrue: Readonly<{
  success: true;
}>;
export const typeError: Readonly<{
  type: "error";
}>;
export const typeWarning: Readonly<{
  type: "warning";
}>;

export const typeScriptAndJSXCompatible: {
  parser: TSESLintParser;
  parserOptions: {
    ecmaFeatures: {
      jsx: true;
    };
  };
};

export const extractObjectStringLiteralValues: TSESLint.RuleModule<
  typeof placeholderMessageId,
  [
    | {
        composedVariablesOnly?: false;
        makePlaceholders?: undefined;
        findInstancesInConfig?: undefined;
      }
    | {
        composedVariablesOnly: true;
        makePlaceholders?: never;
        findInstancesInConfig?: never;
      }
    | {
        composedVariablesOnly?: false;
        makePlaceholders: {
          composedValues_originalKeys: Record<string, string>;
          aliasValues_originalKeys: Record<string, string>;
          regularValuesOnly_originalKeys: Record<string, string>;
          aliases_flattenedKeys: Record<string, string>;
        };
        findInstancesInConfig?: never;
      }
    | {
        composedVariablesOnly?: false;
        makePlaceholders?: never;
        findInstancesInConfig: {
          placeholder: string;
          key: string;
          valueLocation: {
            value: string;
            filePath: string;
            loc: SourceLocation;
          };
        };
      }
  ],
  unknown
>;

export const extractRuleConfigData: Readonly<{
  pluginName: "comment-variables";
  ruleName: "extract-object-string-literal-values";
  rule: TSESLint.RuleModule<
    "placeholderMessageId",
    [
      | {
          composedVariablesOnly?: false;
          makePlaceholders?: undefined;
          findInstancesInConfig?: undefined;
        }
      | {
          composedVariablesOnly: true;
          makePlaceholders?: never;
          findInstancesInConfig?: never;
        }
      | {
          composedVariablesOnly?: false;
          makePlaceholders: {
            composedValues_originalKeys: Record<string, string>;
            aliasValues_originalKeys: Record<string, string>;
            regularValuesOnly_originalKeys: Record<string, string>;
            aliases_flattenedKeys: Record<string, string>;
          };
          findInstancesInConfig?: never;
        }
      | {
          composedVariablesOnly?: false;
          makePlaceholders?: never;
          findInstancesInConfig: {
            placeholder: string;
            key: string;
            valueLocation: {
              value: string;
              filePath: string;
              loc: SourceLocation;
            };
          };
        }
    ],
    unknown,
    TSESLint.RuleListener
  >;
}>;

/** $COMMENT#JSDOC#CONSTANTS#CONFIGKEYREGEX */
export const configKeyRegex: RegExp;
/** $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGKEYREGEX */
export const flattenedConfigKeyRegex: RegExp;
/** $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGPLACEHOLDERLOCALREGEX */
export const flattenedConfigPlaceholderLocalRegex: RegExp;
/** $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGPLACEHOLDERGLOBALREGEX */
export const flattenedConfigPlaceholderGlobalRegex: RegExp;

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKESUCCESSFALSETYPEERROR
 * @param {string} message $COMMENT#JSDOC#PARAMS#MESSAGE
 * @returns $COMMENT#JSDOC#RETURNS#MAKESUCCESSFALSETYPEERROR
 */
export const makeSuccessFalseTypeError: (message: string) => {
  errors: {
    message: string;
    type: "error";
  }[];
  success: false;
};

/**
 * $COMMENT#JSDOC#DEFINITIONS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES
 * @param {LintMessage[]} lintMessages $COMMENT#JSDOC#PARAMS#LINTMESSAGES
 * @param {string} pluginName $COMMENT#JSDOC#PARAMS#PLUGINNAME
 * @param {string} ruleName $COMMENT#JSDOC#PARAMS#RULENAME
 * @returns $COMMENT#JSDOC#RETURNS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES
 */
export const extractValueLocationsFromLintMessages: (
  lintMessages: Linter.LintMessage[],
  pluginName: string,
  ruleName: string
) => {
  value: string;
  filePath: string;
  loc: SourceLocation;
}[];

/**
 * $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX
 * @param {string} string $COMMENT#JSDOC#PARAMS#STRING
 * @returns $COMMENT#JSDOC#RETURNS#ESCAPEREGEX
 */
export const escapeRegex: (string: string) => string;

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKEISOLATEDSTRINGREGEX
 * @param {string} string $COMMENT#JSDOC#PARAMS#STRING
 * @returns $COMMENT#JSDOC#RETURNS#MAKEISOLATEDSTRINGREGEX
 */
export const makeIsolatedStringRegex: (string: string) => RegExp;

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKERESOLVEDCONFIGDATA
 * @param {ResolveConfigResultsSuccessTrue} resolveConfigResultsSuccessTrue $COMMENT#JSDOC#PARAMS#RESOLVECONFIGRESULTSSUCCESSTRUE
 * @returns $COMMENT#JSDOC#RETURNS#MAKERESOLVEDCONFIGDATA
 */
export const makeResolvedConfigData: (resolveConfigResultsSuccessTrue: {
  success: true;
  configPath: string;
  passedIgnores: string[];
  config: object;
  rawConfigAndImportPaths: string[];
  flattenedConfigData: Record<string, string>;
  aliases_flattenedKeys: Record<string, string>;
  reversedFlattenedConfigData: {
    [k: string]: string;
  };
  keys_valueLocations: {
    [k: string]: {
      value: string;
      filePath: string;
      loc: SourceLocation;
    };
  };
  nonAliasesKeys_valueLocations: Record<
    string,
    {
      value: string;
      filePath: string;
      loc: SourceLocation;
    }
  >;
  aliasesKeys_valueLocations: Record<
    string,
    {
      value: string;
      filePath: string;
      loc: SourceLocation;
    }
  >;
}) =>
  | {
      success: false;
      errors: Array<{
        type: "error" | "warning";
        message: string;
      }>;
    }
  | {
      success: true;
      resolvedConfigData: Record<string, unknown>;
    };
