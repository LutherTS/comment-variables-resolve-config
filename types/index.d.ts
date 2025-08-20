import tseslint from "typescript-eslint";
type TSESLintParser = typeof tseslint.parser;

import type { TSESTree, TSESLint } from "@typescript-eslint/utils";
type SourceLocation = TSESTree.SourceLocation;

import type { Linter } from "eslint";

// must be manually maintained

/**
 * Verifies, validates and resolves the config path to retrieve the config's data and ignores.
 * @param {string} configPath The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code extension.
 * @returns The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, the original config, and more. Errors are returned during failures so they can be reused differently on the CLI and the VS Code extension.
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
      lintConfigImports: boolean;
      myIgnoresOnly: boolean;
      composedVariablesExclusives: string[];
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
// export const lintConfigImportsFlag: "--lint-config-imports";
// export const myIgnoresOnlyFlag: "--my-ignores-only";
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

/** The core data needed to run the "extract" rule, fully-named `"extract-object-string-literal-values"`. (The name of the object could eventually be changed for being too function-sounding, since it could be confused for "a function that extract rule config data" instead of what it is, "the data of the extract rule config".) */
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

/** Ensures keys should only include lowercase letters (`Ll`), uppercase letters (`Lu`), other letters (`Lo`), dash punctuation (`Pd`), connector punctuation (`Pc`), numbers (`N`) and whitespaces (`s`). */
export const configKeyRegex: RegExp;
/** Same as `configKeyRegex` but without lowercase letters (`\p{Ll}`), without whitespaces (`\s` which are replaced by underscores) and with the '`#`' character (that links each subkey together). */
export const flattenedConfigKeyRegex: RegExp;
/** Same as `flattenedConfigKeyRegex` but taking the prefix `$COMMENT` and its `#` into consideration, preventing two consecutive `#`'s, removing `^` and `$` in the capture group, and using `_` as replacement for whitespaces. */
export const flattenedConfigPlaceholderLocalRegex: RegExp;
/** Same as `flattenedConfigPlaceholderLocalRegex` but globally. */
export const flattenedConfigPlaceholderGlobalRegex: RegExp;

/**
 * Makes a `{success: false}` object with a single error in its errors array of `{type: "error"}` based on the message it is meant to display.
 * @param {string} message The human-readable message of the error.
 * @returns A `{success: false}` object with a single error in its error array of `{type: "error"}`.
 */
export const makeSuccessFalseTypeError: (message: string) => {
  errors: {
    message: string;
    type: "error";
  }[];
  success: false;
};

/**
 * Extracts and format the output JSON from an ESLint rule's `context.report` to turn it into Value Locations.
 * @param {LintMessage[]} lintMessages The array of LintMessages such as obtained from an `ESLint` or a `Linter` instance running.
 * @param {string} pluginName The name of the plugin being used for filtering.
 * @param {string} ruleName The name of the rule being used for filtering.
 * @returns An array of Value Locations with the value, the file path and the SourceLocation (LOC) included for each.
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
 * Escapes all regex characters with a `"\"` in a string to prepare it for use in a regex.
 * @param {string} string The string.
 * @returns The string with regex characters escaped.
 */
export const escapeRegex: (string: string) => string;

/**
 * Makes a global regex for a given string that ensures it is surrounded by whitespace.
 * @param {string} string The string.
 * @returns The regex complete with positive lookbehind and positive lookahead to ensure the string is taken into account only when surrounded by whitespace.
 */
export const makeIsolatedStringRegex: (string: string) => RegExp;

/**
 * Creates that object with the same keys and the same base shape as the original config data now with all string values entirely resolved alongside Comment Variables keys and placeholders.
 * @param {ResolveConfigResultsSuccessTrue} resolveConfigResultsSuccessTrue The successful results of a `resolveConfig` operation, already vetted and ready to be transformed.
 * @returns An object with `success: true` and the resolved config data if successful, or with `success: false` and errors if unsuccessful.
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
