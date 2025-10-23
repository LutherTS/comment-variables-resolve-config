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
  ConfigDataSchema,
  ConfigIgnoresSchema,
  ConfigLintConfigImportsSchema,
  ConfigMyIgnoresOnlySchema,
  ConfigComposedVariablesExclusivesSchema,
} from "./_commons/constants/schemas.js";

import {
  makeSuccessFalseTypeError,
  extractValueLocationsFromLintMessages,
  reverseFlattenedConfigData,
  makeNormalizedKey,
} from "./_commons/utilities/helpers.js";
import { flattenConfigData } from "./_commons/utilities/flatten-config-data.js";
import { freshImport } from "./_commons/utilities/fresh-import-a.js";

import extractObjectStringLiteralValues from "./_commons/rules/extract.js";

/* resolveConfig */

/**
 * @typedef {import("../types/_commons/typedefs.js").ValueLocation} ValueLocation
 * @typedef {import("../types/_commons/typedefs.js").ConfigData} ConfigData
 * @typedef {import("../types/_commons/typedefs.js").SuccessFalseWithErrors} SuccessFalseWithErrors
 * @typedef {import("../types/_commons/typedefs.js").ResolveConfigResultsSuccessTrue} ResolveConfigResultsSuccessTrue
 */

/**
 * Verifies, validates and resolves the config path to retrieve the config's data and ignores.
 * @param {string} configPath The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code extension.
 * @returns The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, the original config, and more. Errors are returned during failures so they can be reused differently on the CLI and the VS Code extension.
 */
const resolveConfig = async (configPath) => {
  // Step 1a: Checks if config file exists.

  if (!fs.existsSync(configPath)) {
    return makeSuccessFalseTypeError(
      "ERROR. No config file found for Comment Variables." // This effectively never happens when using the CLI tool. The CLI tool intercepts the configPath and create a template path if no config path is found.
    );
  }

  // Step 1b: Checks if config file is JavaScript file (.js only).

  const configExtension = path.extname(configPath);
  if (configExtension !== ".js") {
    return makeSuccessFalseTypeError(
      "ERROR. Config file passed is not strictly JavaScript (.js)."
    );
  }

  // Step 2: Acquires the config.

  const configModule = await freshImport(configPath);
  if (configModule === null)
    return makeSuccessFalseTypeError(
      "ERROR. Config module could not get resolved."
    );

  const config = configModule.default;

  // Step 3: Validates config object.

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

  const configDataResults = ConfigDataSchema.safeParse(data);

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
  const ignores = /** @type {unknown} */ (config.ignores);
  const configIgnoresSchemaResults = ConfigIgnoresSchema.safeParse(ignores);

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

  // validates config.lintConfigImports
  const lintConfigImports = /** @type {unknown} */ (config.lintConfigImports);
  const configLintConfigImportsSchemaResults =
    ConfigLintConfigImportsSchema.safeParse(lintConfigImports);

  if (!configLintConfigImportsSchemaResults.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. Config lintConfigImports could not pass validation from zod.",
        },
        ...configLintConfigImportsSchemaResults.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  // validates config.myIgnoresOnly
  const myIgnoresOnly = /** @type {unknown} */ (config.myIgnoresOnly);
  const configMyIgnoresOnlySchemaResults =
    ConfigMyIgnoresOnlySchema.safeParse(myIgnoresOnly);

  if (!configMyIgnoresOnlySchemaResults.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. Config myIgnoresOnly could not pass validation from zod.",
        },
        ...configMyIgnoresOnlySchemaResults.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  // NEW
  // validates config.composedVariablesExclusives
  const composedVariablesExclusives = /** @type {unknown} */ (
    config.composedVariablesExclusives
  );
  const composedVariablesExclusivesSchemaResults =
    ConfigComposedVariablesExclusivesSchema.safeParse(
      composedVariablesExclusives
    );

  if (!composedVariablesExclusivesSchemaResults.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. Config composedVariablesExclusives could not pass validation from zod.",
        },
        ...composedVariablesExclusivesSchemaResults.error.errors.map((e) => ({
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

  // ALL flattenConfigData VERIFICATIONS ARE MADE HERE, OUTSIDE THE RECURSION.

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
  /** @type {Record<string, string>} */
  const aliases_flattenedKeys = {};
  /** @type {Record<string, string>} */
  const flattenedKeys_originalsOnly = {};

  const originalFlattenedConfigData__EntriesArray = Object.entries(
    originalFlattenedConfigData
  );

  // instead of returning an error because an existing flattened key is in the values ...
  for (const [key, value] of originalFlattenedConfigData__EntriesArray) {
    // ... in aliases_flattenedKeys ...
    if (originalFlattenedConfigData[value]) {
      // ... the pair is now an alias ...
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

    // ensures no comment syntax in values (keys are handled in schemas.js)
    if (value.includes("//")) {
      return makeSuccessFalseTypeError(
        `Value "${value}" should not include "//" for structural reasons related to JavaScript comments.`
      );
    }
    if (value.includes("/*")) {
      return makeSuccessFalseTypeError(
        `Value "${value}" should not include "/*" for structural reasons related to JavaScript comments.`
      );
    }
    if (value.includes("*/")) {
      return makeSuccessFalseTypeError(
        `Value "${value}" should not include "*/" for structural reasons related to JavaScript comments.`
      );
    }
  }

  const aliases_flattenedKeys__EntriesArray = Object.entries(
    aliases_flattenedKeys
  );

  for (const [key, value] of aliases_flattenedKeys__EntriesArray) {
    // checks that no alias is its own key/alias
    if (aliases_flattenedKeys[key] === key)
      return makeSuccessFalseTypeError(
        `ERROR. The alias "${key}" is its own key/alias.`
      );
    // checks that no value is an actual alias
    if (aliases_flattenedKeys[value])
      return makeSuccessFalseTypeError(
        `ERROR. The alias "${key}" can't be the alias of "${value}" because "${value}" is already an alias.`
      );
    // checks if an alias variable's resolved value being a composed variable includes that alias as a segment
    if (
      flattenedKeys_originalsOnly[aliases_flattenedKeys[key]].includes(
        `${$COMMENT}#${key}`
      )
    )
      return makeSuccessFalseTypeError(
        `ERROR. The alias "${key}" links to composed variable "${
          flattenedKeys_originalsOnly[aliases_flattenedKeys[key]]
        }" that includes its placeholder as a segment.`
      );
  }

  // PASSED THIS STAGE, we're now clearly distinguishing:
  // - originalFlattenedConfigData, which is the untreated raw config data
  // - aliases_flattenedKeys, which is only the aliases
  // - flattenedKeys_originalsOnly, which is only the originals
  // Do also keep in mind that aliases are in an object of their own, so they aren't affecting duplicate checks, especially since raw duplication is already addressed with flattenConfigData.

  const flattenedKeys_originalsOnly__valuesArray = Object.values(
    flattenedKeys_originalsOnly
  );

  /** @type {Set<string>} */
  const flattenedKeys_originalsOnly__valuesDuplicateChecksSet = new Set();

  // now that aliases whose values can be duplicate are removed ...
  for (const value of flattenedKeys_originalsOnly__valuesArray) {
    // ... checks that no two original values are duplicate
    if (flattenedKeys_originalsOnly__valuesDuplicateChecksSet.has(value)) {
      return makeSuccessFalseTypeError(
        `ERROR. The value "${value}" is already assigned to an existing key.`
      );
    }
    flattenedKeys_originalsOnly__valuesDuplicateChecksSet.add(value);
  }

  // It is AFTER duplication has been checked on values that we can safely consider handling composed variables.
  // To do so, we'll go through flattenedKeys_originalsOnly and then create flattenedConfigData, the true final one, that checks each Object.entries on flattenedKeys_originalsOnly.

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
      // 3. check if the array of value segments is >= 2 (a single comment variable will create a duplicate, so duplicate value behavior is only reserved for aliases via the actual original key as value) // The thing about this system is, we address the parts where values are keys or placeholders, by respectively making them alias variables (keys as values are aliases) and composed variables instead (placeholders, composed, as values are composed variables).
      if (valueSegments.length < 2)
        return makeSuccessFalseTypeError(
          `ERROR. A composed variable needs at least two comment variables separated by a single space in order to be a composed variable, which the value "${value}" does not.`
        );
      // 4. check if all segments pass flattenedConfigPlaceholderLocalRegex
      for (const valueSegment of valueSegments) {
        if (!flattenedConfigPlaceholderLocalRegex.test(valueSegment)) {
          return makeSuccessFalseTypeError(
            `ERROR. Value segment "${valueSegment}" in value "${value}" does not have the "${$COMMENT}#" shape of a comment variable.`
          );
        }
      }
      // 5. remove $COMMENT# from all segments
      const keySegments = valueSegments.map((e) =>
        e.replace(`${$COMMENT}#`, "")
      );
      // 6. check that all obtained keys do exist in flattenedKeys_originalsOnly or in flattenedKeys_originalsOnly via aliases_flattenedKeys
      for (const keySegment of keySegments) {
        const resolvedValue =
          flattenedKeys_originalsOnly[keySegment] ||
          flattenedKeys_originalsOnly[aliases_flattenedKeys?.[keySegment]];

        if (!resolvedValue)
          return makeSuccessFalseTypeError(
            `ERROR. Key segment "${keySegment}" extracted from value "${value}" is neither an original key nor a vetted alias to one.`
          );

        if (resolvedValue.includes(`${$COMMENT}#`))
          return makeSuccessFalseTypeError(
            `ERROR. A potential composed variable cannot be used as a segment of another composed variable. (Value: "${resolvedValue}")`
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

  const flattenedConfigData__ValuesArray = Object.values(flattenedConfigData);

  // now that composed variables have created new values...
  for (const value of flattenedConfigData__ValuesArray) {
    // ...checks that no two final values are duplicate
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

  // This is where I use ESLint programmatically to obtain all object values that are string literals, along with their source locations. It may not seem necessary for the CLI — it now is thanks to the `placeholders` command — but since the CLI ought to be used with the extension, validating its integrity right here and there will prevent mismatches in expectations between the two products.
  // So in the process, I am running and receiving findAllImports, meaning resolveConfig exports all import paths from the config, with the relevant flag only needing to choose between all imports or just the config path at consumption. This way you can say eventually OK, here when I command+click a $COMMENT, because it's not ignored it sends me to the position in the config files, but there because it's ignored it actually shows me all references outside the ignored files.

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

  for (const extract of extracts) {
    const value = extract.value;

    if (originalFlattenedConfigData[value]) continue;
    // that's an alias, since the value is a key in the original flattened config data

    // with aliases excluded we can now focus on originals only

    // Current rationale is all duplicate unused object string literal values should be turned into template literal values in the fight against silent JavaScript object value overrides.
    if (!values_valueLocations__map.has(value)) {
      values_valueLocations__map.set(value, extract);
      // ignoring composed variables
      if (!value.includes(`${$COMMENT}#`)) allObjectStringValues.push(value); // tracks potential original value overrides from legal JavaScript object value overrides
    } else values_valueLocations__duplicateValuesArray.push({ value: extract });
  }

  // I'm actually going to need to use the callback eventually for faster error handling, because even though the list is interesting... you can't list it all in a VS Code showErrorMessage. I'm going to have to list only one case, and that's where the callback shines. But for this first version, I'm going to use the full lists on both the `array` and the `set`. (The full lists are actually valuable in that they can mention the numbers of errors that need to be fixed.)

  // values_valueLocations__duplicateValuesArray should be empty, because all extracted values meant for use should be unique
  if (values_valueLocations__duplicateValuesArray.length !== 0) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: `ERROR. (\`values_valueLocations__duplicateValuesArray\` should remain empty. Length: ${values_valueLocations__duplicateValuesArray.length}.) You have several string literals as values to keys that are exactly the same within your config file and its recursive import files. Please turn those that are not used via your comment-variables config data into template literals for distinction.`, // Next possibly, list all of the duplicates, by including the original found in values_valueLocationsMap along with the ones in values_valueLocations__duplicateValuesArray, using the keys which are the string literals values as references.
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
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: `ERROR. (\`unrecognizedValuesSet\` should remain empty. Size: ${unrecognizedValuesSet.size}.) One or some of the values of your comment-variables config data are not (valid) string literals. Meaning they do resolve but not as string literals. Please ensure that all values in your comment-variables config data are (valid) string literals, since Comment Variables favors composition through actual Comment Variables, not at the values level.`, // Next possibly, list all the unrecognized values in order to inform on what values should be changed to string literals.
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
    flattenedConfigData__ValuesArray
  );
  /** @type {Array<string} */
  const overriddenObjectStringValues = [];

  for (const value of allObjectStringValues) {
    if (!flattenedConfigData__ValuesSet.has(value))
      overriddenObjectStringValues.push(value);
  }

  if (overriddenObjectStringValues.length !== 0) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: `ERROR. (\`overriddenObjectStringValues\` should remain empty. Length: ${overriddenObjectStringValues.length}.) It appears some of the values from your original config are being overridden in the final flattened config data, or you may have unused object string values lingering within files related to the config, in which case you ought to turn them into template literals for distinction.`, // Next possibly, show the list of overridden values, captured in overriddenObjectStringValues.
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

  for (const [key, value] of aliases_flattenedKeys__EntriesArray) {
    aliasesKeys_valueLocations[key] = nonAliasesKeys_valueLocations[value];
  }

  const keys_valueLocations = {
    ...nonAliasesKeys_valueLocations,
    ...aliasesKeys_valueLocations,
  };

  // NEW
  // checks that all composed variables exclusives are comment variables (so neither alias variables nor composed variables)
  const composedVariablesExclusivesSchemaResultsData =
    composedVariablesExclusivesSchemaResults.data ?? [];
  for (const e of composedVariablesExclusivesSchemaResultsData) {
    const isAlias = !!aliases_flattenedKeys[e];
    const isComposed = flattenedKeys_originalsOnly[e]?.includes(`${$COMMENT}#`);

    if (isAlias)
      return makeSuccessFalseTypeError(
        `ERROR. The "composedVariablesExclusives" key array should only include keys representing comment variables, but "${e}" represents an alias variable. Refer to its original instead.`
      );
    if (isComposed)
      return makeSuccessFalseTypeError(
        `ERROR. The "composedVariablesExclusives" key array should only include keys representing comment variables, but "${e}" represents a composed variable. Which defeats the purpose of "composedVariablesExclusives" since composed variables cannot be made of other composed variables.`
      );
  }

  return {
    // NOTE: THINK ABOUT RETURNING ERRORS ONLY IN SUCCESSFALSE, AND WARNINGS ONLY IN SUCCESSTRUE.
    ...successTrue,
    configPath, // finalized and absolute
    passedIgnores: configIgnoresSchemaResults.data,
    config,
    rawConfigAndImportPaths,
    originalFlattenedConfigData, // for jscomments placeholders
    aliases_flattenedKeys,
    flattenedConfigData,
    reversedFlattenedConfigData,
    keys_valueLocations,
    nonAliasesKeys_valueLocations,
    aliasesKeys_valueLocations,
    lintConfigImports: configLintConfigImportsSchemaResults.data ?? false,
    myIgnoresOnly: configMyIgnoresOnlySchemaResults.data ?? false,
    // NEW
    composedVariablesExclusives: composedVariablesExclusivesSchemaResultsData,
  };
};

/* makeResolvedConfigData */

/**
 * Resolves a composed variable, as in a string made of several comment variables, to the actual Comment Variable it is meant to represent.
 * @param {string} composedVariable The composed variable as is.
 * @param {Record<string, string>} flattenedConfigData The flattened config data obtained from resolveConfig.
 * @param {Record<string, string>} aliases_flattenedKeys The aliases-to-flattened-keys dictionary obtained from resolveConfig.
 * @returns The resolved composed variable as a single natural string.
 */
const resolveComposedVariable = (
  composedVariable,
  flattenedConfigData,
  aliases_flattenedKeys
) => {
  const composedVariableSegments = composedVariable.split(" ");
  const resolvedSegments = composedVariableSegments.map((e) => {
    const segmentKey = e.replace(`${$COMMENT}#`, "");
    const resolvedSegmentKey = aliases_flattenedKeys[segmentKey] || segmentKey;
    return flattenedConfigData[resolvedSegmentKey];
  });
  return resolvedSegments.join(" ");
};

/**
 * Resolves a string value from Comment Variables config data taking into account the possibility that it is first an alias variable, second (and on the alias route) a composed variable, third (also on the alias route) a comment variable.
 * @param {string} stringValue The encountered string value to be resolved.
 * @param {Record<string, string>} flattenedConfigData The flattened config data obtained from resolveConfig.
 * @param {Record<string, string>} aliases_flattenedKeys The aliases-to-flattened-keys dictionary obtained from resolveConfig.
 * @returns The string value resolved as the relevant Comment Variable that it is.
 */
const resolveConfigDataStringValue = (
  stringValue,
  flattenedConfigData,
  aliases_flattenedKeys
) => {
  const valueThroughAlias = flattenedConfigData?.[stringValue];
  if (valueThroughAlias) {
    // stringValue is an alias variable
    // valueThroughAlias is its value
    // valueThroughAlias is now either a composed variable or a comment variable
    if (valueThroughAlias.includes(`${$COMMENT}#`)) {
      // valueThroughAlias is a composed variable
      return resolveComposedVariable(
        valueThroughAlias,
        flattenedConfigData,
        aliases_flattenedKeys
      );
    } else {
      // valueThroughAlias is a comment variable
      return valueThroughAlias;
    }
  } else if (stringValue.includes(`${$COMMENT}#`)) {
    // stringValue is a composed variable
    return resolveComposedVariable(
      stringValue,
      flattenedConfigData,
      aliases_flattenedKeys
    );
  } else {
    // stringValue is a comment variable
    return stringValue;
  }
};

/**
 * Recursively resolves Comment Variables config data values (being strings or nested objects) to generate an object with the same keys and the same shape as the original config data now with all string values entirely resolved.
 * @param {ConfigData} configData The original config data obtained from resolveConfig.
 * @param {Record<string, string>} flattenedConfigData The flattened config data obtained from resolveConfig.
 * @param {Record<string, string>} aliases_flattenedKeys The aliases-to-flattened-keys dictionary obtained from resolveConfig.
 * @param {(value: string) => string} callback The function that runs on every time a string value is encountered, set to `resolveConfigDataStringValue` by default.
 * @returns Just the resolved config data if successful, or an object with `success: false` and errors if unsuccessful.
 */
const resolveConfigData = (
  configData,
  flattenedConfigData,
  aliases_flattenedKeys,
  callback = (value) =>
    resolveConfigDataStringValue(
      value,
      flattenedConfigData,
      aliases_flattenedKeys
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
        flattenedConfigData,
        aliases_flattenedKeys,
        callback
      );
    } else {
      return makeSuccessFalseTypeError(
        `ERROR. Value "${value}" is supposed to be either a string or a nested object.`
      );
    }
  }

  return results;
};

/**
 * Transforms resolved config data with keys and placeholders alongside values.
 * @param {Record<string, unknown>} resolvedConfigData The resolved config data.
 * @param {string[]} parentsKeys The list of keys that are parent to the key at hand given the recursive nature of the config's data's data structure, instantiated as an empty array of strings (`[]`).
 * @returns The transformed resolved config data with keys and placeholders readily accessible alongside values.
 */
const transformResolvedConfigData = (resolvedConfigData, parentsKeys = []) => {
  /** @type {Record<string, unknown>} */
  const results = {};

  for (const [k, v] of Object.entries(resolvedConfigData)) {
    const newKeys = [...parentsKeys, k];

    if (v && typeof v === "object" && !Array.isArray(v)) {
      // If it's an object, recurse.
      results[k] = transformResolvedConfigData(v, newKeys);
    } else {
      // If it's a primitive value, transform it.
      const key = makeNormalizedKey(newKeys);

      results[k] = {
        value: v,
        key,
        placeholder: `${$COMMENT}#${key}`,
      };
    }
  }

  return results;
};

/**
 * Creates that object with the same keys and the same base shape as the original config data now with all string values entirely resolved alongside Comment Variables keys and placeholders.
 * @param {ResolveConfigResultsSuccessTrue} resolveConfigResultsSuccessTrue The successful results of a `resolveConfig` operation, already vetted and ready to be transformed.
 * @returns An object with `success: true` and the resolved config data if successful, or with `success: false` and errors if unsuccessful.
 */
const makeResolvedConfigData = (resolveConfigResultsSuccessTrue) => {
  const { config, aliases_flattenedKeys, flattenedConfigData } =
    resolveConfigResultsSuccessTrue;
  /** @type {ConfigData} */
  const configData = config.data;

  const resolveConfigDataResults = resolveConfigData(
    configData,
    flattenedConfigData,
    aliases_flattenedKeys
  );
  if (
    resolveConfigDataResults.success !== undefined &&
    resolveConfigDataResults.success === false
  ) {
    // ...So. If theoretically somebody calls one of their top keys success and sets its value to false, it would passes the test... But resolveConfig already ensures that all strings are actually strings or objects (not boolean), so we're good here.
    return /** @type {SuccessFalseWithErrors} */ (resolveConfigDataResults);
  }

  /** @type {Record<string, unknown>} */
  const resolvedConfigData = resolveConfigDataResults;
  const transformedResolvedConfigData =
    transformResolvedConfigData(resolvedConfigData);

  return {
    ...successTrue,
    resolvedConfigData: transformedResolvedConfigData,
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
  extractRuleName,
  extractObjectStringLiteralValues,
  makeSuccessFalseTypeError,
  extractValueLocationsFromLintMessages,
  makeResolvedConfigData,
};

export {
  defaultConfigFileName,
  templateFileName,
  exampleFileName,
  resolveRuleName,
  compressRuleName,
  placeholdersRuleName,
  cwd,
  configFlag,
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

export { extractRuleConfigData } from "./_commons/rules/extract.js";
