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
  $COMMENT,
} from "./_commons/constants/bases.js";
import {
  flattenedConfigKeyRegex,
  flattenedConfigPlaceholderLocalRegex,
} from "./_commons/constants/regexes.js";

import { makeSuccessFalseTypeError } from "./_commons/utilities/helpers.js";
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
    return makeSuccessFalseTypeError("ERROR. No config file found.");
  }

  // Step 1b: Checks if config file is JavaScript file

  const configExtension = path.extname(configPath);
  if (configExtension !== ".js") {
    return makeSuccessFalseTypeError(
      "ERROR. Config file passed is not JavaScript (.js)."
    );
  }

  // Step 2: Acquires the config

  const configModule = await /** @type {unknown} */ (
    import(`${url.pathToFileURL(configPath)}?t=${Date.now()}`)
  ); // `?t=${Date.now()}` for cache-busting
  const config = /** @type {unknown} */ (configModule.default);

  // Step 3: Validates config object

  // validates config
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return makeSuccessFalseTypeError(
      "ERROR. Invalid config format. The config should be an object."
    );
  }

  // validates config.data
  const data = /** @type {unknown} */ (config.data);

  // needed because of z.record()
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return makeSuccessFalseTypeError(
      "ERROR. Invalid config.data format. The config.data should be an object."
    );
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

  const { configDataMap } = flattenedConfigDataResults;

  // ALL flattenConfigData VERIFICATIONS SHOULD BE MADE HERE, OUTSIDE THE RECURSION

  // strips metadata
  /**@type {Map<string, string>} */
  const flattenedConfigDataMap = new Map();
  configDataMap.forEach((value, key) => {
    flattenedConfigDataMap.set(key, value.value);
  });

  // makes the flattened config data object
  const originalFlattenedConfigData = Object.fromEntries(
    flattenedConfigDataMap
  );
  console.log(
    "Original flattened config data is:",
    originalFlattenedConfigData
  );

  const originalreversedFlattenedConfigData = Object.fromEntries(
    Object.entries(originalFlattenedConfigData).map(([key, value]) => [
      value,
      key,
    ])
  );

  // The integrity of the flattened config data needs to be established before working with it safely.

  const originalFlattenedConfigDataKeysSet = new Set(
    Object.keys(originalFlattenedConfigData)
  );

  // We could literally compose aliases within values, like { key: "$#CHOCOLAT CHAUD#"} ...or not. Because the goal of the API is not to be verbose, but rather to be readable. So I would always prefer $COMMENT#COMMENT $COMMENT#IS $COMMENT#BLUE over $COMMENT#CIB... it depends. Anyway I do the aliases first, and then I'll look into it.

  // Aliases logic:
  // - instead of returning an error because an existing flattened key is in the value...
  /** @type {Record<string, string>} */
  const aliases_flattenedKeys = {};
  // ...in aliases_flattenedKeys...
  // for (const key of flattenedConfigDataKeysSet) {
  for (const [key, value] of Object.entries(originalFlattenedConfigData)) {
    // if (flattenedConfigDataValuesSet.has(key)) {
    if (originalFlattenedConfigDataKeysSet.has(value)) {
      // ...the pair is now an alias... // checked
      aliases_flattenedKeys[key] = value;
      // ...the original key is removed from flattenedConfigData // checked
      delete originalFlattenedConfigData[key];

      continue;
    }

    // for (const key of flattenedConfigDataKeysSet) {
    if (!flattenedConfigKeyRegex.test(key)) {
      // checks if each key for flattenedConfigData passes the flattenedConfigKeyRegex test
      return makeSuccessFalseTypeError(
        `ERROR. Somehow the key "${key}" is not properly formatted. (This is mostly an internal mistake.)`
      );
    }
  }

  // PASSED THIS STAGE, flattenedConfigData IS FINAL BEFORE COMPOSED VARIABLES.
  // Do also keep in mind that aliases are in an object of their own, so there aren't affecting duplicate checks, especially since raw duplication is already addressed with flattenConfigData.

  const originalFlattenedConfigDataValuesArray = Object.values(
    originalFlattenedConfigData
  );

  /** @type {Set<string>} */
  const duplicateChecksSet = new Set();

  for (const value of originalFlattenedConfigDataValuesArray) {
    if (duplicateChecksSet.has(value)) {
      // checks that no two values are duplicate
      return makeSuccessFalseTypeError(
        `ERROR. The value "${value}" is already assigned to an existing key.`
      );
    }
    duplicateChecksSet.add(value);
  }

  // It is AFTER duplication has been checked on values that we can safely consider handling Composed Variables.
  // To do so, we'll go through flattenedConfigData and recreate a new flattenedConfigData, the true final one, that checks each Object.entries sur flattenedConfigData.

  /** @type {Record<string, string>} */
  const flattenedConfigData = {};

  // I have to re-loop on flattenedConfigData because the previous loop modified flattenedConfigData.
  for (const [key, value] of Object.entries(originalFlattenedConfigData)) {
    // 0. check if the value includes "$COMMENT#" (basically there cannot be any value with "$COMMENT#" included that isn't a composed variable)
    if (value.includes(`${$COMMENT}#`)) {
      // That's where I can:
      // 1. check if the value begins with $COMMENT# (basically if a value starts with a comment variable, it is to be understood as a composed variable)
      if (!value.startsWith(`${$COMMENT}#`))
        return makeSuccessFalseTypeError(
          `ERROR. The value "${value}", due to its inclusion of "${$COMMENT}#" would need to start with "${$COMMENT}#" in order to operate as a composed variable.`
        );
      // 2. separate the value by a space
      const valueSegments = value.split(" ");
      // 3. check if the array of separated is >= 2 (a single comment variable will create a duplicate, so this is only reserved for aliases via the actual key) // The thing about this system is, we address the parts where values are keys or placeholders, by making them aliases and composed variables instead.
      if (valueSegments.length < 2)
        return makeSuccessFalseTypeError(
          `ERROR. A composed variable needs at least two comment variables separated by a single space in order to be a composed variable, which the value "${value}" does not.`
        );
      // 4. check if all separated pass flattenedConfigPlaceholderRegex2
      for (const valueSegment of valueSegments) {
        if (!flattenedConfigPlaceholderLocalRegex.test(valueSegment)) {
          return makeSuccessFalseTypeError(
            `ERROR. Value segment "${valueSegment}" in value "${value}" is not a comment variable.`
          );
        }
      }
      // 5. remove $COMMENT# from all separated
      const keySegments = valueSegments.map((e) =>
        e.replace(`${$COMMENT}#`, "")
      );
      // 6. check that all obtain keys do exist in flattenedConfigData
      for (const keySegment of keySegments) {
        if (
          !originalFlattenedConfigData[keySegment] &&
          !originalFlattenedConfigData[aliases_flattenedKeys?.[keySegment]]
        )
          return makeSuccessFalseTypeError(
            `ERROR. Key segment "${keySegment}" extract from value "${value}" is not a key in the original flattened config data.`
          );
      }
      // 7. now that it is secure, replace all keys by their values
      const resolvedSegments = keySegments.map(
        (e) =>
          originalFlattenedConfigData[e] ||
          originalFlattenedConfigData[aliases_flattenedKeys?.[e]]
      );
      // 8. join back the array of separated by a space
      const composedVariable = resolvedSegments.join(" ");
      // 9. trueflattenedConfigData[key] = result of all this
      flattenedConfigData[key] = composedVariable;
      // (All throughout this process, when an issue arises, the process stops.)
      // Because the idea is, in the values of flattenedConfigData:
      // - there should be no (existing) keys to guarantee reversibility of the config
      // - there should be no placeholders to prevent the creation of unintended placeholders
    } else flattenedConfigData[key] = value;
  }
  console.log("Flattened config data is:", flattenedConfigData);

  // A new duplicated value check will be needed.

  // Also including the reversed flattened config data.

  const reversedFlattenedConfigData = Object.fromEntries(
    Object.entries(flattenedConfigData).map(([key, value]) => [value, key])
  );
  console.log("Reversed is:", reversedFlattenedConfigData);

  // console.log("Aliases are:", aliases_flattenedKeys);

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
  // console.log("Extracts are:", extracts);

  // Both of these below ought to be rethought.

  /** @type {Map<string, ValueLocation>} */
  const map = new Map();
  /** @type {Array<ValueLocation>} */
  const array = [];

  // ...
  // There's going to be the ...
  // I'm gonna need to straight-up ditch the "keys" to go straight to the placeholders. It's going to be a seismic change but one that:
  // - simply the sources of truth from three characteristics to two (from 'key, value, placeholder', to 'placeholder, comment')
  // allows here to ignore all values that start with $COMMENT# since all placeholders (not keys) will start with the exact same prefix: if (extract.value.startsWith(`${$COMMENT}#`))
  // Actually... if (configKeysSet.has(extract.value)) continue. That means value here is a key and is therefore an alias.
  for (const extract of extracts) {
    const value = extract.value;
    if (originalFlattenedConfigDataKeysSet.has(value)) continue; // that's an alias
    if (!map.has(value)) {
      map.set(value, extract);
    } else array.push(extract);
  }

  // IMPORTANT...
  // I'm actually going to need to use the callback, because even though the list is interesting... you can't list it all in a VS Code showErrorMessage. I'm going to have to list only one case, and that's where the callback shines. But for this first version, I'm going to use the full lists on both the `array` and the `set`.

  // array should be empty, because all extracted values should be unique
  if (array.length !== 0) {
    return makeSuccessFalseTypeError(
      "ERROR. (`array` should remain empty.) You have several string literal values to keys that are exactly the same within your config file and its recursive import files. Please turn those that are not used via your comment-variables config data into template literals for distinction. More on that in a later release. (If you really need two keys to have the same value, we're introducing aliases.)" // Next, list all of the duplicates, by including the ones in the array and the first one found in the map.
    );
  }

  const originalFlattenedConfigDataValuesArray2 = Object.values(
    originalFlattenedConfigData
  );

  /** @type {Set<string>} */
  const set = new Set();
  for (const value of originalFlattenedConfigDataValuesArray2) {
    if (!map.has(value)) {
      console.log(map);
      set.add(value);
    }
  } // All could be in a single run, but I'd rather report on ALL the errors one time instead of reporting on them one by one for now.

  // set should be empty, because there shouldn't be a single value in the reversed flattened config that does not have its equivalent in map
  if (set.size !== 0) {
    return makeSuccessFalseTypeError(
      "ERROR. (`set` should remain empty.) One or some of the values of your comment-variables config data are not string literals. Please ensure that all values in your comment-variables config data are string literals, since Comment Variables favors composition through actual comment variables, not at the values level. More on that in a later release." // Next, list all the values from the reversed flattened config that do not have their equivalent in map in order to inform on what values should be changed to string literals.
    );
  }

  // console.log(originalFlattenedConfigDataValuesArray2);
  console.log(originalreversedFlattenedConfigData);
  /** @type {{[k: string]: ValueLocation}} */
  const keys_valueLocations = {};
  for (const value of originalFlattenedConfigDataValuesArray2) {
    console.log(reversedFlattenedConfigData[value]);
    console.log(originalreversedFlattenedConfigData[value]);
    if (!map.has(value)) set.add(value);
    keys_valueLocations[
      reversedFlattenedConfigData[value] ||
        originalreversedFlattenedConfigData[value]
    ] = map.get(value);
  }
  console.log("keys_valueLocations are:", keys_valueLocations); // AT HERE
  // I need to literally go through every step. Wait.

  return {
    // NOTE: THINK ABOUT RETURNING ERRORS ONLY IN SUCCESSFALSE, AND WARNINGS ONLY IN SUCCESS TRUE.
    ...successTrue,
    flattenedConfigData,
    reversedFlattenedConfigData,
    aliases_flattenedKeys,
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
  flattenedConfigPlaceholderLocalRegex,
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
  flattenedConfigPlaceholderGlobalRegex,
} from "./_commons/constants/regexes.js";

export {
  escapeRegex,
  makeIsolatedStringRegex,
} from "./_commons/utilities/helpers.js";
