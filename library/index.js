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
} from "./_commons/schemas/config.js";

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
  const configDataResult = ConfigDataSchema.safeParse(config.data);

  if (!configDataResult.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. Config data could not pass validation from zod.",
        },
        ...configDataResult.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  // validates config.ignores
  const configIgnoresSchemaResult = ConfigIgnoresSchema.safeParse(
    config.ignores
  );

  if (!configIgnoresSchemaResult.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. Config ignores could not pass validation from zod.",
        },
        ...configIgnoresSchemaResult.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  const flattenedConfigDataResults = flattenConfigData(configDataResult.data);

  if (!flattenedConfigDataResults.success) {
    return flattenedConfigDataResults;
  }

  /* NEW!! */
  // This is where I'll be using ESLint programmatically to obtain all object values that are string literals, along with their source locations. It may not seem necessary for the CLI, but since the CLI needs to be used with extension, validating its integrity right here and there will prevent mismatches in expectations between the two products.
  // So in the process, I will be running and received findAllImports, meaning resolveConfig will be exporting all imports from the config, with the relevant flag only needing to choose between all imports or just the config path. This way you can say eventually OK, here when I command-click a $COMMENT, because it's not ignored it sends me to the position, but here because it's ignored it actually shows me all references.

  const findAllImportsResults = findAllImports(configPath);
  if (!findAllImportsResults.success) return findAllImportsResults; // It's a return because now that findAllImports is integrated within resolveConfig, working with its results is no longer optional. (This also means that current warnings find all imports will need to be upgraded to errors.)
  const rawFiles = [...findAllImportsResults.visitedSet];
  // the paths must be relative
  const files = rawFiles.map((e) => path.relative(process.cwd(), e));

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
  console.log("Results are:", results);

  /** @type {ValueLocation[]} */
  const extracted = results.flatMap((result) =>
    result.messages
      .filter(
        (msg) =>
          msg.ruleId === `${commentVariablesPluginName}/${extractRuleName}`
      )
      .map((msg) => JSON.parse(msg.message))
  );
  console.log("Extracted are:", extracted);

  const map = new Map();
  const array = [];

  for (const extract of extracted) {
    const value = extract.value;
    if (!map.has(value)) {
      map.set(value, extract);
    } else array.push(extract);
  }
  console.log("Map is:", map);
  console.log("Array is:", array);

  // array should be empty
  if (array.length !== 0) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. `array` should remain empty because all extracted values should be unique. More on that later.", // Next, list all of the duplicates, by including the ones in the array and the first one in the map.
        },
      ],
    };
  }

  const { reversedFlattenedConfigData } = flattenedConfigDataResults;
  const reversedFlattenedConfigDataKeys = Object.keys(
    reversedFlattenedConfigData
  );
  console.log("Keys are:", reversedFlattenedConfigDataKeys);

  const set = new Set();
  for (const key of reversedFlattenedConfigDataKeys) {
    if (!map.has(key)) set.add(key);
  } // All could be in a single run, but I'd rather report on ALL the errors one time instead of reporting on them one by one.

  // set should be empty
  if (set.size !== 0) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. `set` should remain empty, because there shouldn't be a single value in the reversed flattened config that does not have its equivalent in `map`, which may only be the case if the value was obtain by another mean than a string literal. More on that later.", // Next, list all the values from the reversed flattened config that do not have their equivalent in map in order to inform on what values should be changed to string literals.
        },
      ],
    };
  }

  /** @type {{[k: string]: ValueLocation}} */
  const valueLocations = {};
  for (const key of reversedFlattenedConfigDataKeys) {
    if (!map.has(key)) set.add(key);
    valueLocations[reversedFlattenedConfigData[key]] = map.get(key);
  }
  console.log("Value locations are:", valueLocations);

  // sends back:
  // - the flattened config data,
  // - the reverse flattened config data,
  // - the verified config path
  // - and the raw passed ignores
  return {
    // THINK ABOUT RETURNING ERRORS ONLY IN SUCCESSFALSE, AND WARNINGS ONLY IN SUCCESS TRUE.
    ...flattenedConfigDataResults, // finalized (comes with its own successTrue)
    rawDefaultIgnores: rawFiles, // NEW
    valueLocations, // NEW
    configPath, // finalized
    passedIgnores: configIgnoresSchemaResult.data, // addressed with --lint-config-imports and --my-ignores-only to be finalized
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

export { escapeRegex } from "./_commons/utilities/helpers.js";
