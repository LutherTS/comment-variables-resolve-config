import tseslint from "typescript-eslint";

type TSESLintParser = typeof tseslint.parser;

// must be manually maintained

/**
 * Verifies, validates and resolves the config path to retrieve the config's data and ignores.
 * @param {string} configPath The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code extension.
 * @returns The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, and the original config. Errors are returned during failures so they can be reused differently on the CLI and the VS Code extension.
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
      flattenedConfigData: {
        [k: string]: string;
      };
      reversedFlattenedConfigData: {
        [k: string]: string;
      };
      rawConfigAndImportPaths: string[];
      valueLocations: {
        [k: string]: {
          value: string;
          filePath: string;
          loc: SourceLocation;
        };
      };
    }
>;

export default resolveConfig;

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

export const defaultConfigFileName: "comments.config.js";
export const commentVariablesPluginName: "comment-variables";
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
export const typeScriptAndJSXCompatible: {
  parser: TSESLintParser;
  parserOptions: {
    ecmaFeatures: {
      jsx: true;
    };
  };
};

export const configKeyRegex: RegExp;
export const flattenedConfigKeyRegex: RegExp;
export const flattenedConfigPlaceholderRegex: RegExp;

/**
 * Escapes all regex characters with a `"\"` in a string to prepare it for use in a regex.
 * @param {string} string The string.
 * @returns The string with regex characters escaped.
 */
export const escapeRegex: (string: string) => string;

/**
 * Makes a global regex for a `$COMMENT#*` placeholder.
 * @param {string} placeholder The `$COMMENT#*` placeholder that the regex is designed to find.
 * @returns The regex complete with positive lookbehind and positive lookahead to ensure the placeholder is taken into account only when surrounded by whitespace.
 */
export const makePlaceholderRegex: (placeholder: string) => RegExp;
