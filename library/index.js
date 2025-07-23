import fs from "fs";
import path from "path";

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

import {
  makeSuccessFalseTypeError,
  extractValueLocationsFromLintMessages,
  reverseFlattenedConfigData,
} from "./_commons/utilities/helpers.js";
import { flattenConfigData } from "./_commons/utilities/flatten-config-data.js";
import { freshImport } from "./_commons/utilities/fresh-import-a.js";

import {
  ConfigDataSchema,
  ConfigIgnoresSchema,
} from "./_commons/constants/schemas.js";

import extractObjectStringLiteralValues from "./_commons/rules/extract.js";

/* resolveConfig */

/**
 * @typedef {import("../types/_commons/typedefs.js").ValueLocation} ValueLocation
 * @typedef {import("../types/_commons/typedefs.js").ConfigData} ConfigData
 */

/**
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIG
 * @param {string} configPath $COMMENT#JSDOC#PARAMS#CONFIGPATH
 * @returns $COMMENT#JSDOC#RETURNS#RESOLVECONFIG
 */
const resolveConfig = async (configPath) => {
  // Step 1a: Checks if config file exists

  if (!fs.existsSync(configPath)) {
    return makeSuccessFalseTypeError(
      "ERROR. No config file found for Comment Variables."
    );
  }

  // Step 1b: Checks if config file is JavaScript file

  const configExtension = path.extname(configPath);
  if (configExtension !== ".js") {
    return makeSuccessFalseTypeError(
      "ERROR. Config file passed is not strictly JavaScript (.js)."
    );
  }

  // Step 2: Acquires the config

  const configModule = await freshImport(configPath);
  if (configModule === null)
    return makeSuccessFalseTypeError(
      "ERROR. Config module could not get resolved."
    );

  const config = configModule.default;

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

  // makes the original flattened config data object
  const originalFlattenedConfigData = Object.fromEntries(
    flattenedConfigDataMap
  );

  // The integrity of the flattened config data needs to be established before working with it safely.

  // Aliases logic:
  // - instead of returning an error because an existing flattened key is in the value...
  /** @type {Record<string, string>} */
  const aliases_flattenedKeys = {};
  /** @type {Record<string, string>} */
  const flattenedKeys_originalsOnly = {};
  for (const [key, value] of Object.entries(originalFlattenedConfigData)) {
    // ...in aliases_flattenedKeys...
    if (originalFlattenedConfigData[value]) {
      // ...the pair is now an alias... // checked
      aliases_flattenedKeys[key] = value;

      continue;
    } else {
      // ... separating originalFlattenedConfigData into two objects: one for non-alias pairs and one for alias pairs.
      flattenedKeys_originalsOnly[key] = value;
    }

    if (!flattenedConfigKeyRegex.test(key)) {
      // Checks if each key for flattenedConfigData passes the flattenedConfigKeyRegex test. This validates for aliases keys and values at the same time as well since in originalFlattenedConfigData[value] guarantees that the value of an alias is a key being tested right here.
      return makeSuccessFalseTypeError(
        `ERROR. Somehow the key "${key}" is not properly formatted. (This is mostly an internal mistake.)`
      );
    }
  }

  for (const [key, value] of Object.entries(aliases_flattenedKeys)) {
    // checkes that no alias is its own key/alias
    if (aliases_flattenedKeys[key] === key)
      return makeSuccessFalseTypeError(
        `ERROR. The alias "${key}" is its own key/alias.`
      );
    // checks that no value is an actual key
    if (aliases_flattenedKeys[value])
      return makeSuccessFalseTypeError(
        `ERROR. The alias "${key}" can't be the alias of "${value}" because "${value}" is already an alias.`
      );
  }

  // PASSED THIS STAGE, we're now clearly distinguishing:
  // - originalFlattenedConfigData, which is the untreated raw config data
  // - aliases_flattenedKeys, which is only the aliases
  // - flattenedKeys_originalsOnly, which is only the originals
  // Do also keep in mind that aliases are in an object of their own, so there aren't affecting duplicate checks, especially since raw duplication is already addressed with flattenConfigData.

  const flattenedKeys_originalsOnly__valuesArray = Object.values(
    flattenedKeys_originalsOnly
  );

  /** @type {Set<string>} */
  const flattenedKeys_originalsOnly__valuesDuplicateChecksSet = new Set();

  for (const value of flattenedKeys_originalsOnly__valuesArray) {
    // now that aliases whose values can be duplicate are removed ...
    if (flattenedKeys_originalsOnly__valuesDuplicateChecksSet.has(value)) {
      // ... checks that no two original values are duplicate
      return makeSuccessFalseTypeError(
        `ERROR. The value "${value}" is already assigned to an existing key.`
      );
    }
    flattenedKeys_originalsOnly__valuesDuplicateChecksSet.add(value);
  }

  // It is AFTER duplication has been checked on values that we can safely consider handling composed variables.
  // To do so, we'll go through flattenedKeys_originalsOnly and then create flattenedConfigData, the true final one, that checks each Object.entries sur flattenedKeys_originalsOnly.

  /** @type {Record<string, string>} */
  const flattenedConfigData = {};

  const flattenedKeys_originalsOnly__EntriesArray = Object.entries(
    flattenedKeys_originalsOnly
  );

  for (const [key, value] of flattenedKeys_originalsOnly__EntriesArray) {
    // 0. check if the value includes "$COMMENT#" (basically there cannot be any value with "$COMMENT#" included that isn't a composed variable)
    if (value.includes(`${$COMMENT}#`)) {
      // That's where I can:
      // 1. check if the value begins with $COMMENT# (basically if a value starts with a comment variable, it is to be understood as a composed variable)
      if (!value.startsWith(`${$COMMENT}#`))
        return makeSuccessFalseTypeError(
          `ERROR. The value "${value}", due to its inclusion of "${$COMMENT}#", would need to start with "${$COMMENT}#" in order to operate as a composed variable.`
        );
      // 2. separate the value by a space
      const valueSegments = value.split(" ");
      // 3. check if the array of value segments is >= 2 (a single comment variable will create a duplicate, so duplicate value behavior is only reserved for aliases via the actual original key as value) // The thing about this system is, we address the parts where values are keys or placeholders, by respectively making them aliases (keys as values are aliases) and composed variables instead (placeholders, composed, as values are composed variables).
      if (valueSegments.length < 2)
        return makeSuccessFalseTypeError(
          `ERROR. A composed variable needs at least two comment variables separated by a single space in order to be a composed variable, which the value "${value}" does not.`
        );
      // 4. check if all separated pass flattenedConfigPlaceholderLocalRegex
      for (const valueSegment of valueSegments) {
        if (!flattenedConfigPlaceholderLocalRegex.test(valueSegment)) {
          return makeSuccessFalseTypeError(
            `ERROR. Value segment "${valueSegment}" in value "${value}" does not have the "${$COMMENT}#" shape of a comment variable.`
          );
        }
      }
      // 5. remove $COMMENT# from all separated
      const keySegments = valueSegments.map((e) =>
        e.replace(`${$COMMENT}#`, "")
      );
      // 6. check that all obtain keys do exist in flattenedKeys_originalsOnly or in flattenedKeys_originalsOnly via aliases_flattenedKeys
      for (const keySegment of keySegments) {
        const resolvedValue =
          flattenedKeys_originalsOnly[keySegment] ||
          flattenedKeys_originalsOnly[aliases_flattenedKeys?.[keySegment]];

        if (!resolvedValue)
          return makeSuccessFalseTypeError(
            `ERROR. Key segment "${keySegment}" extract from value "${value}" is neither an original key nor a vetted alias to one.`
          );

        if (resolvedValue.includes(`${$COMMENT}#`))
          return makeSuccessFalseTypeError(
            `ERROR. A potential composed variable cannot be used as the comment variable of another composed variable.`
          ); // works even with aliases of composed variables
      }
      // 7. now that it is secure, replace all keys by their values
      const resolvedSegments = keySegments.map(
        (e) =>
          flattenedKeys_originalsOnly[e] ||
          flattenedKeys_originalsOnly[aliases_flattenedKeys?.[e]]
      );
      // 8. join back the array of resolved segments by a space
      const composedVariable = resolvedSegments.join(" ");
      // 9. flattenedConfigData[key] = result of all this
      flattenedConfigData[key] = composedVariable;
      // All throughout this process, when an issue arises, the process stops. Because the idea is, in the values of flattenedConfigData:
      // - there should be no (existing) keys to guarantee reversibility
      // - there should be no singled-out placeholders to prevent the creation of unintended placeholders
    } else flattenedConfigData[key] = value;
  }

  /** @type {Set<string>} */
  const flattenedConfigDataDuplicateChecksSet = new Set();

  // now that composed variables have created new values ...
  for (const value of Object.values(flattenedConfigData)) {
    // ... checks that no two final values are duplicate
    if (flattenedConfigDataDuplicateChecksSet.has(value)) {
      return makeSuccessFalseTypeError(
        `ERROR. The finalized value "${value}" is already assigned to an existing key.`
      );
    }
    flattenedConfigDataDuplicateChecksSet.add(value);
  }

  // Also including the reversed flattened config data.

  const reversedFlattenedConfigData =
    reverseFlattenedConfigData(flattenedConfigData);

  // console.log("originalFlattenedConfigData is:", originalFlattenedConfigData);
  // console.log("flattenedKeys_originalsOnly is:", flattenedKeys_originalsOnly);
  // console.log("aliases_flattenedKeys is:", aliases_flattenedKeys);
  // console.log("Flattened with composed variables is:", flattenedConfigData);
  // console.log(
  //   "Reversed with composed variables is:",
  //   reversedFlattenedConfigData
  // );

  /* NEW!!! */
  // This is where I use ESLint programmatically to obtain all object values that are string literals, along with their source locations. It may not seem necessary for the CLI, but since the CLI needs to be used with extension, validating its integrity right here and there will prevent mismatches in expectations between the two products.
  // So in the process, I am running and receiving findAllImports, meaning resolveConfig exports all import paths from the config, with the relevant flag only needing to choose between all imports or just the config path at consumption. This way you can say eventually OK, here when I command+click a $COMMENT, because it's not ignored it sends me to the position in the config files, but here because it's ignored it actually shows me all references outside the ignored files.

  const findAllImportsResults = findAllImports(configPath);
  if (!findAllImportsResults.success) return findAllImportsResults; // It's a return because now that findAllImports is integrated within resolveConfig, working with its results is no longer optional.
  const rawConfigAndImportPaths = [...findAllImportsResults.visitedSet];
  // the paths must be relative for ESLint
  const files = rawConfigAndImportPaths.map((e) =>
    path.relative(process.cwd(), e)
  );

  const eslint = new ESLint({
    errorOnUnmatchedPattern: false,
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

  const extracts = results.flatMap((result) =>
    extractValueLocationsFromLintMessages(
      result.messages,
      commentVariablesPluginName,
      extractRuleName
    )
  );

  /** @type {Map<string, ValueLocation>} */
  const values_valueLocations__map = new Map();
  /** @type {Array<Record<string, ValueLocation>>} */
  const values_valueLocations__duplicateValuesArray = [];
  /** @type {Array<string} */
  const allObjectStringValues = []; // aliases, and composed variables excluded

  // // making a set out of flattenedKeys_originalsOnly__valuesArray for faster lookups
  // const flattenedKeys_originalsOnly__valuesSet = new Set(
  //   flattenedKeys_originalsOnly__valuesArray
  // );

  for (const extract of extracts) {
    const value = extract.value;

    if (originalFlattenedConfigData[value]) continue;
    // that's an alias, since the value is the key in the original flattened config data

    // with aliases excluded we can now focus on originals only

    // REMOVING THIS ALLOWS FOR OVERRIDDEN VALUES TO STILL SHOW UP IN values_valueLocations__map
    // if (flattenedKeys_originalsOnly__valuesSet.has(value)) {

    // basically you can have duplicate object string literal values as long as they are not the values from the original flattened config data (which includes composed variables) // NOT ANYMORE. Current rationale all duplicate unused object string literal values should be turned into template literal values in the fight against silent JavaScript object value overrides
    if (!values_valueLocations__map.has(value)) {
      values_valueLocations__map.set(value, extract);
      if (!value.includes(`${$COMMENT}#`))
        // ignoring composed variables
        allObjectStringValues.push(value); // tracks potential original value overrides from legal JavaScript object value overrides
    } else values_valueLocations__duplicateValuesArray.push({ value: extract });

    // }
  }

  // I'm actually going to need to use the callback eventually for faster error handling, because even though the list is interesting... you can't list it all in a VS Code showErrorMessage. I'm going to have to list only one case, and that's where the callback shines. But for this first version, I'm going to use the full lists on both the `array` and the `set`.

  // values_valueLocations__duplicateValuesArray should be empty, because all extracted values meant for use should be unique
  if (values_valueLocations__duplicateValuesArray.length !== 0) {
    // return makeSuccessFalseTypeError(
    //   `ERROR. (\`values_valueLocations__duplicateValuesArray\` should remain empty. Length: ${values_valueLocations__duplicateValuesArray.length}.) You have several string literals as values to keys that are exactly the same within your config file and its recursive import files. Please turn those that are not used via your comment-variables config data into template literals for distinction. More on that in a later release. (If you really need two keys to have the same value, we're introducing aliases.)` // Next possibly, list all of the duplicates, by including the original found in values_valueLocationsMap along with the ones in values_valueLocations__duplicateValuesArray, using the keys which are the string literals values as references.
    // );
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: `ERROR. (\`values_valueLocations__duplicateValuesArray\` should remain empty. Length: ${values_valueLocations__duplicateValuesArray.length}.) You have several string literals as values to keys that are exactly the same within your config file and its recursive import files. Please turn those that are not used via your comment-variables config data into template literals for distinction. (If you really need two keys to have the same value, we're introducing aliases.)`, // Next possibly, list all of the duplicates, by including the original found in values_valueLocationsMap along with the ones in values_valueLocations__duplicateValuesArray, using the keys which are the string literals values as references.
        },
        {
          ...typeError,
          message: `Look to the following value: ${
            Object.keys(values_valueLocations__duplicateValuesArray)[0]
          }`,
        },
      ],
    };
  }

  /** @type {Set<string>} */
  const unrecognizedValuesSet = new Set();

  for (const value of flattenedKeys_originalsOnly__valuesArray) {
    if (!values_valueLocations__map.has(value)) {
      // valueLocations only include string literals, so even if the value perfectly resolves, it doesn't exist in values_valueLocationsMap
      unrecognizedValuesSet.add(value);
    }
  }

  // I'd rather report on ALL the errors one time instead of reporting on them one at a time for now.

  // unrecognizedValuesSet should be empty, because there shouldn't be a single value in flattenedKeys_originalsOnly__valuesArray that couldn't be found in values_valueLocationsMap with its ValueLocation data, unless it isn't a string literal
  if (unrecognizedValuesSet.size !== 0) {
    // return makeSuccessFalseTypeError(
    //   `ERROR. (\`unrecognizedValuesSet\` should remain empty. Size: ${unrecognizedValuesSet.size}.) One or some of the values of your comment-variables config data are not string literals. Meaning they do resolve but not as string literals. Please ensure that all values in your comment-variables config data are string literals, since Comment Variables favors composition through actual Comment Variables, not at the values level. More on that in a later release.` // Next possibly, list all the unrecognized values in order to inform on what values should be changed to string literals.
    // );
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: `ERROR. (\`unrecognizedValuesSet\` should remain empty. Size: ${unrecognizedValuesSet.size}.) One or some of the values of your comment-variables config data are not string literals. Meaning they do resolve but not as string literals. Please ensure that all values in your comment-variables config data are string literals, since Comment Variables favors composition through actual Comment Variables, not at the values level.`, // Next possibly, list all the unrecognized values in order to inform on what values should be changed to string literals.
        },
        {
          ...typeError,
          message: `Look to the following (perhaps evaluated) value: ${
            [...unrecognizedValuesSet][0]
          }`,
        },
      ],
    };
  }

  // Now to catch actual duplicate keys that silently override.

  const flattenedConfigData__ValuesSet = new Set(
    Object.values(flattenedConfigData)
  );
  /** @type {Array<string} */
  const overriddenObjectStringValues = [];

  for (const value of allObjectStringValues) {
    if (!flattenedConfigData__ValuesSet.has(value))
      overriddenObjectStringValues.push(value);
  }

  if (overriddenObjectStringValues.length !== 0) {
    // return makeSuccessFalseTypeError(
    //   `ERROR. (\`overriddenObjectStringValues\` should remain empty. Length: ${overriddenObjectStringValues.length}.) It appears some of the values from your original config are being overridden in the final flattened config data through legal JavaScript object value overrides. This is likely to be unintentional. More on that in a later release.` // Next possibly, show the list of overridden values, captured in overriddenObjectStringValues.
    // );
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: `ERROR. (\`overriddenObjectStringValues\` should remain empty. Length: ${overriddenObjectStringValues.length}.) It appears some of the values from your original config are being overridden in the final flattened config data through legal JavaScript object value overrides. This is likely to be unintentional.`, // Next possibly, show the list of overridden values, captured in overriddenObjectStringValues.
        },
        {
          ...typeError,
          message: `Look to the following value: ${overriddenObjectStringValues[0]}`,
        },
      ],
    };
  }

  // Concluding on value locations objects.

  /** @type {Record<string, ValueLocation>} */
  const nonAliasesKeys_valueLocations = {}; // unique ValueLocation objects

  for (const [key, value] of flattenedKeys_originalsOnly__EntriesArray) {
    nonAliasesKeys_valueLocations[key] = values_valueLocations__map.get(value);
  }

  /** @type {Record<string, ValueLocation>} */
  const aliasesKeys_valueLocations = {}; // expected duplicate ValueLocation objects

  for (const [key, value] of Object.entries(aliases_flattenedKeys)) {
    aliasesKeys_valueLocations[key] = nonAliasesKeys_valueLocations[value];
  }

  const keys_valueLocations = {
    ...nonAliasesKeys_valueLocations,
    ...aliasesKeys_valueLocations,
  };

  // console.log(
  //   "nonAliasesKeys_valueLocations are:",
  //   nonAliasesKeys_valueLocations
  // );
  // console.log("aliases_valueLocations are:", aliasesKeys_valueLocations);
  // console.log("keys_valueLocations are:", keys_valueLocations);

  return {
    // NOTE: THINK ABOUT RETURNING ERRORS ONLY IN SUCCESSFALSE, AND WARNINGS ONLY IN SUCCESS TRUE.
    ...successTrue,
    configPath, // finalized
    passedIgnores: configIgnoresSchemaResults.data, // addressed with --lint-config-imports and --my-ignores-only to be finalized
    config, // and the config itself too
    rawConfigAndImportPaths, // NEW and now in resolveConfig
    originalFlattenedConfigData, // BRAND NEW for jscomments placeholders
    aliases_flattenedKeys,
    flattenedConfigData,
    reversedFlattenedConfigData,
    keys_valueLocations, // NEW (formerly valueLocations)
    nonAliasesKeys_valueLocations,
    aliasesKeys_valueLocations,
  };
};

/* makeResolvedConfigData */

/**
 * Resolves a composed variable, as in a string made of several comment variables, to the actual Comment Variable it is meant to represent.
 * @param {string} composedVariable The composed variable as is.
 * @param {Record<string, string>} flattenedConfigData The flattened config data obtained from resolveConfig.
 * @returns The resolved composed variable as a single natural string.
 */
const resolveComposedVariable = (composedVariable, flattenedConfigData) => {
  const composedVariableSegments = composedVariable.split(" ");
  const resolvedSegments = composedVariableSegments.map((e) => {
    const segmentKey = e.replace(`${$COMMENT}#`, "");
    return flattenedConfigData[segmentKey];
  });
  return resolvedSegments.join(" ");
};

/**
 * Resolves a string value from Comment Variables config data taking into account the possible that it is first an alias variable, second (and on the alias route) a composed variable, third (also on the alias route) a comment variable.
 * @param {string} stringValue The encountered string value to be resolved.
 * @param {Record<string, string>} aliases_flattenedKeys The aliases-to-flattened-keys dictionary obtained from resolveConfig.
 * @param {Record<string, string>} flattenedConfigData The flattened config data obtained from resolveConfig.
 * @returns The string value resolved as the relevant Comment Variable that it is.
 */
const resolveConfigDataStringValue = (
  stringValue,
  aliases_flattenedKeys,
  flattenedConfigData
) => {
  const keyThroughAlias = aliases_flattenedKeys?.[stringValue];
  if (keyThroughAlias) {
    // stringValue is an alias variable
    const linkedValue = flattenedConfigData[keyThroughAlias];
    // linkedValue is now either a composed variable or a comment variable
    if (linkedValue.includes(`${$COMMENT}#`)) {
      // linkedValue is a composed variable
      return resolveComposedVariable(linkedValue, flattenedConfigData);
    } else {
      // linkedValue is a comment variable
      return linkedValue;
    }
  } else if (stringValue.includes(`${$COMMENT}#`)) {
    // stringValue is a composed variable
    return resolveComposedVariable(stringValue, flattenedConfigData);
  } else {
    // stringValue is a comment variable
    return stringValue;
  }
};

/**
 * Recursively resolves Comment Variables config data values (being strings or nested objects) to generate an object with the same keys and the same shape as the original config data now with all string values entirely resolved.
 * @param {ConfigData} configData The original config data obtained from resolveConfig.
 * @param {Record<string, string>} aliases_flattenedKeys The aliases-to-flattened-keys dictionary obtained from resolveConfig.
 * @param {Record<string, string>} flattenedConfigData The flattened config data obtained from resolveConfig.
 * @param {(value: string) => string} callback The function that runs on every time a string value is encountered, set to `resolveConfigDataStringValue` by default.
 * @returns An object with `success: true` and the resolved config data if success, or with `success: false` and errors if unsuccessful.
 */
const resolveConfigData = (
  configData,
  aliases_flattenedKeys,
  flattenedConfigData,
  callback = (value) =>
    resolveConfigDataStringValue(
      value,
      aliases_flattenedKeys,
      flattenedConfigData
    )
) => {
  /** @type {Record<string, unknown>} */
  const results = {};

  for (const key in configData) {
    const value = configData[key];

    if (typeof value === "string") {
      results[key] = callback(value);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      results[key] = resolveConfigData(
        value,
        aliases_flattenedKeys,
        flattenedConfigData,
        callback
      );
    } else {
      return makeSuccessFalseTypeError(
        `ERROR. Value "${value}" is supposed to be either a string or a nested object.`
      );
    }
  }

  return {
    ...successTrue,
    resolvedConfigData: results,
  };
};

/**
 *
 * @param {string} configPath
 */
const makeResolvedConfigData = async (configPath) => {
  const resolveConfigResults = await resolveConfig(configPath);
  if (!resolveConfigResults.success) {
    return resolveConfigResults.errors;
  }

  const { config, aliases_flattenedKeys, flattenedConfigData } =
    resolveConfigResults;
  /** @type {ConfigData} */
  const configData = config.data;

  const resolveConfigDataResults = resolveConfigData(
    configData,
    aliases_flattenedKeys,
    flattenedConfigData
  );
  if (!resolveConfigDataResults.success) {
    return resolveConfigDataResults.errors;
  }

  return resolveConfigDataResults.resolvedConfigData;
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
  extractRuleName,
  extractObjectStringLiteralValues,
  makeSuccessFalseTypeError,
  extractValueLocationsFromLintMessages,
  makeResolvedConfigData,
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
