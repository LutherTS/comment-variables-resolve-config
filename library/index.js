import fs from "fs";
import path from "path";
import url from "url";

import { ESLint } from "eslint";

import { findAllImports } from "find-all-js-imports";

import {
  successFalse,
  successTrue,
  typeError,
  typeWarning,
  typeScriptAndJSXCompatible,
  commentVariablesPluginName,
  extractRuleName,
} from "./_commons/constants/bases.js";

import { flattenConfigData } from "./_commons/utilities/flatten-config-data.js";

import {
  ConfigDataSchema,
  ConfigIgnoresSchema,
} from "./_commons/constants/schemas.js";

import extractObjectStringLiteralValues from "./_commons/rules/extract.js";

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
 * Verifies, validates and resolves the config path to retrieve the config's data and ignores.
 * @param {string} configPath The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code extension.
 * @returns The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, and the original config. Errors are returned during failures so they can be reused differently on the CLI and the VS Code extension.
 */
const resolveConfig = async (configPath) => {
  // Step 1a: Checks if config file exists

  if (!fs.existsSync(configPath)) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. No config file found.",
        },
      ],
    };
  }

  // Step 1b: Checks if config file is JavaScript file

  const configExtension = path.extname(configPath);
  if (configExtension !== ".js") {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. Config file passed is not JavaScript (.js).",
        },
      ],
    };
  }

  // Step 2: Acquires the config

  const configModule = await /** @type {unknown} */ (
    import(`${url.pathToFileURL(configPath)}?t=${Date.now()}`)
  ); // `?t=${Date.now()}` for cache-busting
  const config = /** @type {unknown} */ (configModule.default);

  // Step 3: Validates config object

  // validates config
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. Invalid config format. The config should be an object.",
        },
      ],
    };
  }

  // validates config.data
  const data = /** @type {unknown} */ (config.data);

  // needed because of z.record()
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. Invalid config.data format. The config.data should be an object.",
        },
      ],
    };
  }

  const configDataResults = ConfigDataSchema.safeParse(config.data);

  if (!configDataResults.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. Config data could not pass validation from zod.",
        },
        ...configDataResults.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  // validates config.ignores
  const configIgnoresSchemaResults = ConfigIgnoresSchema.safeParse(
    config.ignores
  );

  if (!configIgnoresSchemaResults.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. Config ignores could not pass validation from zod.",
        },
        ...configIgnoresSchemaResults.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  const flattenedConfigDataResults = flattenConfigData(configDataResults.data);

  if (!flattenedConfigDataResults.success) {
    return flattenedConfigDataResults;
  }

  /* NEW!!! */
  // This is where I use ESLint programmatically to obtain all object values that are string literals, along with their source locations. It may not seem necessary for the CLI, but since the CLI needs to be used with extension, validating its integrity right here and there will prevent mismatches in expectations between the two products.
  // So in the process, I am running and receiving findAllImports, meaning resolveConfig exports all import paths from the config, with the relevant flag only needing to choose between all imports or just the config path at consumption. This way you can say eventually OK, here when I command+click a $COMMENT, because it's not ignored it sends me to the position in the config files, but here because it's ignored it actually shows me all references outside the ignored files.

  const findAllImportsResults = findAllImports(configPath);
  if (!findAllImportsResults.success) return findAllImportsResults; // It's a return because now that findAllImports is integrated within resolveConfig, working with its results is no longer optional. (This also means that current warnings find all imports will need to be upgraded to errors.)
  const rawConfigAndImportPaths = [...findAllImportsResults.visitedSet];
  // the paths must be relative for ESLint
  const files = rawConfigAndImportPaths.map((e) =>
    path.relative(process.cwd(), e)
  );

  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      {
        files,
        languageOptions: typeScriptAndJSXCompatible,
        plugins: {
          [commentVariablesPluginName]: {
            rules: {
              [extractRuleName]: extractObjectStringLiteralValues,
            },
          },
        },
        rules: {
          [`${commentVariablesPluginName}/${extractRuleName}`]: "warn",
        },
      },
    ],
  });
  const results = await eslint.lintFiles(files);

  /** @type {ValueLocation[]} */
  const extracts = results.flatMap((result) =>
    result.messages
      .filter(
        (msg) =>
          msg.ruleId === `${commentVariablesPluginName}/${extractRuleName}`
      )
      .map((msg) => JSON.parse(msg.message))
  );

  /** @type {Map<string, ValueLocation>} */
  const map = new Map();
  /** @type {Array<ValueLocation>} */
  const array = [];

  for (const extract of extracts) {
    const value = extract.value;
    if (!map.has(value)) {
      map.set(value, extract);
    } else array.push(extract);
  }

  // IMPORTANT...
  // I'm actually going to need to use the callback, because even though the list is interesting... you can't list it all in a VS Code showErrorMessage. I'm going to have to list only one case, and that's where the callback shines. But for this first version, I'm going to use the full lists on both the `array` and the `set`.

  // array should be empty, because all extracted values should be unique
  if (array.length !== 0) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. (`array` should remain empty.) You have several string literal values to keys that are exactly the same within your config file and its recursive import files. Please turn those that are not used via your comment-variables config data into template literals for distinction. More on that in a later release.", // Next, list all of the duplicates, by including the ones in the array and the first one found in the map.
        },
      ],
    };
  }

  const { reversedFlattenedConfigData } = flattenedConfigDataResults;
  const reversedFlattenedConfigDataKeys = Object.keys(
    reversedFlattenedConfigData
  );

  /** @type {Set<string>} */
  const set = new Set();
  for (const key of reversedFlattenedConfigDataKeys) {
    if (!map.has(key)) set.add(key);
  } // All could be in a single run, but I'd rather report on ALL the errors one time instead of reporting on them one by one for now.

  // set should be empty, because there shouldn't be a single value in the reversed flattened config that does not have its equivalent in map
  if (set.size !== 0) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. (`set` should remain empty.) One or some of the values of your comment-variables config data are not string literals. Please ensure that all values in your comment-variables config data are string literals, since Comment Variables favors composition through actual comment variables, not at the values level. More on that in a later release.", // Next, list all the values from the reversed flattened config that do not have their equivalent in map in order to inform on what values should be changed to string literals.
        },
      ],
    };
  }

  /** @type {{[k: string]: ValueLocation}} */
  const keys_valueLocations = {};
  for (const reversedKey of reversedFlattenedConfigDataKeys) {
    if (!map.has(reversedKey)) set.add(reversedKey);
    keys_valueLocations[reversedFlattenedConfigData[reversedKey]] =
      map.get(reversedKey);
  }

  return {
    // NOTE: THINK ABOUT RETURNING ERRORS ONLY IN SUCCESSFALSE, AND WARNINGS ONLY IN SUCCESS TRUE.
    ...flattenedConfigDataResults, // finalized (comes with its own successTrue)
    rawConfigAndImportPaths, // NEW and now in resolveConfig
    keys_valueLocations, // NEW (formerly valueLocations)
    configPath, // finalized
    passedIgnores: configIgnoresSchemaResults.data, // addressed with --lint-config-imports and --my-ignores-only to be finalized
    config, // and the config itself too
  };
};

export default resolveConfig;

export {
  successFalse,
  successTrue,
  typeError,
  typeWarning,
  typeScriptAndJSXCompatible,
  commentVariablesPluginName,
};

export {
  defaultConfigFileName,
  configFlag,
  lintConfigImportsFlag,
  myIgnoresOnlyFlag,
  $COMMENT,
  knownIgnores,
  placeholderMessageId,
  placeholderDataId,
} from "./_commons/constants/bases.js";

export {
  configKeyRegex,
  flattenedConfigKeyRegex,
  flattenedConfigPlaceholderRegex,
} from "./_commons/constants/regexes.js";

export {
  escapeRegex,
  makeIsolatedStringRegex,
} from "./_commons/utilities/helpers.js";
