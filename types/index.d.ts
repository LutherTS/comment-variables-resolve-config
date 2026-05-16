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
      configDataResultsData: Record<string, unknown>;
      rawConfigAndImportPaths: string[];
      lintConfigImports: boolean;
      myIgnoresOnly: boolean;
      composedVariablesExclusives: string[];
      variations: false;
      resolvedCoreData: {
        originalFlattenedConfigData: Record<string, string>;
        flattenedConfigData: Record<string, string>;
        aliases_flattenedKeys: Record<string, string>;
        reversedFlattenedConfigData: Record<string, string>;
        keys_valueLocations: Record<
          string,
          {
            value: string;
            filePath: string;
            loc: SourceLocation;
          }
        >;
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
      };
      resolvedReferenceData: null;
      resolvedVariationData: null;
      resolvedPublicData: null;
      librariesData: Record<string, Record<string, string>> | null;
      docCommandData: null;
    }
  | {
      success: true;
      configPath: string;
      passedIgnores: string[];
      config: object;
      configDataResultsData: Record<string, unknown>;
      rawConfigAndImportPaths: string[];
      lintConfigImports: boolean;
      myIgnoresOnly: boolean;
      composedVariablesExclusives: string[];
      variations: true;
      resolvedCoreData: {
        originalFlattenedConfigData: Record<string, string>;
        flattenedConfigData: Record<string, string>;
        aliases_flattenedKeys: Record<string, string>;
        reversedFlattenedConfigData: Record<string, string>;
        keys_valueLocations: Record<
          string,
          {
            value: string;
            filePath: string;
            loc: SourceLocation;
          }
        >;
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
      };
      resolvedReferenceData: {
        originalFlattenedConfigData: Record<string, string>;
        flattenedConfigData: Record<string, string>;
        aliases_flattenedKeys: Record<string, string>;
        reversedFlattenedConfigData: Record<string, string>;
        variant: string;
        normalizedVariant: string;
        variantLabel: string;
      };
      resolvedVariationData: {
        originalFlattenedConfigData: Record<string, string>;
        flattenedConfigData: Record<string, string>;
        aliases_flattenedKeys: Record<string, string>;
        reversedFlattenedConfigData: Record<string, string>;
        variant: string;
        normalizedVariant: string;
        variantLabel: string;
        variantsKeys_missingKeys: Record<string, string[]>;
      };
      resolvedPublicData: {
        libraryKey: string;
        libraryVariations: Record<string, Record<string, string>>;
      };
      librariesData: Record<string, Record<string, string>> | null;
      docCommandData: {
        declarationDir: string;
        rootDir: string;
      } | null;
    }
>;

export default resolveConfig;

export const defaultConfigFileName: "comments.config.js";
export const templateFileName: "comments.template.js";
export const exampleFileName: "comments.example.js";
export const commentVariablesPluginName: "comment-variables";
export const cwd: string;
export const extractRuleName: "extract-object-string-literal-values";
export const resolveRuleName = "resolve";
export const compressRuleName = "compress";
export const placeholdersRuleName = "placeholders";
export const placeholderMessageId: "placeholderMessageId";
export const placeholderDataId: "placeholderDataId";
export const configFlag: "--config";
export const $COMMENT: "$COMMENT";

export const knownIgnores: [
  "node_modules",
  "dist",
  "out",
  ".next",
  ".react-router",
  ".parcel-cache",
  ".react-router-parcel",
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
          variations: boolean;
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
      },
  ],
  unknown
>;

/** $COMMENT#JSDOC#CONSTANTS#EXTRACTRULECONFIGDATA */
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
            variations: boolean;
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
        },
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
 * @param {string} pluginName $COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF plugin $COMMENT#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD
 * @param {string} ruleName $COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF rule $COMMENT#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD
 * @returns $COMMENT#JSDOC#RETURNS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES
 */
export const extractValueLocationsFromLintMessages: (
  lintMessages: Linter.LintMessage[],
  pluginName: string,
  ruleName: string,
) => {
  value: string;
  filePath: string;
  loc: SourceLocation;
}[];

/**
 * $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX
 * @param {string} string $COMMENT#JSDOC#PARAMS#STRINGA
 * @returns $COMMENT#JSDOC#RETURNS#ESCAPEREGEX
 */
export const escapeRegex: (string: string) => string;

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKEISOLATEDSTRINGREGEX
 * @param {string} string $COMMENT#JSDOC#PARAMS#STRINGA
 * @returns $COMMENT#JSDOC#RETURNS#MAKEISOLATEDSTRINGREGEX
 */
export const makeIsolatedStringRegex: (string: string) => RegExp;

/**
 * $COMMENT#JSDOC#DEFINITIONS#REMOVEVARIANTPREFIXFROMVARIATIONPLACEHOLDER
 * @param {string} variationPlaceholder $COMMENT#JSDOC#PARAMS#VARIATIONPLACEHOLDER
 * @returns $COMMENT#JSDOC#RETURNS#REMOVEVARIANTPREFIXFROMVARIATIONPLACEHOLDER
 */
export const removeVariantPrefixFromVariationPlaceholder: (
  variationPlaceholder: string,
) => string;

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKERESOLVEDCONFIGDATA
 * @param {Record<string, unknown>} configData $COMMENT#JSDOC#PARAMS#CONFIGDATAB
 * @param {Record<string, string>} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAB
 * @param {Record<string, string>} aliases_flattenedKeys $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS
 * @returns $COMMENT#JSDOC#RETURNS#MAKERESOLVEDCONFIGDATA
 */
export const makeResolvedConfigData: (
  configData: Record<string, unknown>,
  flattenedConfigData: Record<string, string>,
  aliases_flattenedKeys: Record<string, string>,
) =>
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

/**
 * Makes the JSON resolved config data to be written at an expected $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD
 * @param {Record<string, unknown>} resolvedConfigData $COMMENT#JSDOC#PARAMS#RESOLVEDCONFIGDATAB
 * @returns The JSON resolved config data to be written at an expected $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD $COMMENT#FORCOMPOSEDVARIABLES#MAKEJSONDATARETURNS
 */
export const makeJsonData: (
  resolvedConfigData: Record<string, unknown>,
) => string;

/**
 * Makes the MJS resolved config data to be written at an expected $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD
 * @param {Record<string, unknown>} resolvedConfigData $COMMENT#JSDOC#PARAMS#RESOLVEDCONFIGDATAB
 * @returns The MJS resolved config data to be written at an expected $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD $COMMENT#FORCOMPOSEDVARIABLES#MAKEMJSDATARETURNS
 */
export const makeMjsData: (
  resolvedConfigData: Record<string, unknown>,
) => string;

/**
 * Makes the $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE JSON $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD
 * @param {string} jsonPath The expected $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATH where the JSON $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN
 * @returns The $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE JSON $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED
 */
export const makeJsonPathLog: (jsonPath: string) => string;

/**
 * Makes the $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE MJS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD
 * @param {string} mjsPath The expected $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATH where the MJS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN
 * @returns The $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE MJS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED
 */
export const makeMjsPathLog: (mjsPath: string) => string;
