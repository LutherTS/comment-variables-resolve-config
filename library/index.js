import fs from "fs";
import path from "path";

import { ESLint } from "eslint";
import { findAllImports } from "find-all-js-imports";

import {
  successFalse,
  successTrue,
  variationsFalse,
  variationsTrue,
  typeError,
  typeWarning,
  typeScriptAndJSXCompatible,
  commentVariablesPluginName,
  extractRuleName,
  $COMMENT,
} from "./_commons/constants/bases.js";
import { flattenedConfigPlaceholderLocalRegex } from "./_commons/constants/regexes.js";
import {
  ConfigIgnoresSchema,
  ConfigLintConfigImportsSchema,
  ConfigMyIgnoresOnlySchema,
  ConfigComposedVariablesExclusivesSchema,
  VariationsSchema,
} from "./_commons/constants/schemas.js";

import {
  makeSuccessFalseTypeError,
  extractValueLocationsFromLintMessages,
  normalize,
  makeNormalizedKey,
  removeVariantPrefixFromVariationKey,
  getArraySetDifference,
} from "./_commons/utilities/helpers.js";
import { freshImport } from "./_commons/utilities/fresh-import-a.js";
import {
  resolveCoreData,
  resolveVariationData,
} from "./_commons/utilities/resolve-data.js";
import { getComposedVariablesExclusivesFreeKeys } from "./_commons/utilities/flatten-config-data.js";

import extractObjectStringLiteralValues from "./_commons/rules/extract.js";

/* resolveConfig */

/**
 * @typedef {import("../types/_commons/typedefs.js").ValueLocation} ValueLocation
 * @typedef {import("../types/_commons/typedefs.js").ConfigData} ConfigData
 * @typedef {import("../types/_commons/typedefs.js").SuccessFalseWithErrors} SuccessFalseWithErrors
 * @typedef {import("../types/_commons/typedefs.js").ResolveConfigResultsSuccessTrue} ResolveConfigResultsSuccessTrue
 */

/**
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIG
 * @param {string} configPath $COMMENT#JSDOC#PARAMS#CONFIGPATHA
 * @returns $COMMENT#JSDOC#RETURNS#RESOLVECONFIG
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

  // NEW: data should be validated last because it will now depend on whether the variants flag is true or not.

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

  const configIgnoresSchemaResultsData = configIgnoresSchemaResults.data;

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

  const configLintConfigImportsSchemaResultsData =
    configLintConfigImportsSchemaResults.data ?? false;

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

  const configMyIgnoresOnlySchemaResultsData =
    configMyIgnoresOnlySchemaResults.data ?? false;

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

  let composedVariablesExclusivesSchemaResultsData =
    composedVariablesExclusivesSchemaResults.data ?? [];

  // NEW!! Checking the variations key.

  // validates config.variants
  const variations = /** @type {unknown} */ (config.variations);
  const variationsSchemaResults = VariationsSchema.safeParse(variations);

  if (!variationsSchemaResults.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. Config variations could not pass validation from zod.",
        },
        ...variationsSchemaResults.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  const variationsSchemaResultsData = variationsSchemaResults.data;

  // specifies the comment variables exclusives of variations are enabled

  if (variationsSchemaResultsData) {
    const variantComposedVariablesExclusivesSet = new Set(
      composedVariablesExclusivesSchemaResultsData.map((e) =>
        removeVariantPrefixFromVariationKey(e)
      )
    );
    composedVariablesExclusivesSchemaResultsData = [
      ...composedVariablesExclusivesSchemaResultsData,
      ...variantComposedVariablesExclusivesSet,
    ];
  }

  // IMPORTANT: MOVED EARLIER IN THE PROCESS
  // This is where I use ESLint programmatically to obtain all object values that are string literals, along with their source locations. It may not seem necessary for the CLI — it now is thanks to the `placeholders` command — but since the CLI ought to be used with the extension, validating its integrity right here and there will prevent mismatches in expectations between the two products.
  // So in the process, I am running and receiving findAllImports, meaning resolveConfig exports all import paths from the config, with the relevant flag only needing to choose between all imports or just the config path at consumption. This way you can say eventually OK, here when I command+click a $COMMENT, because it's not ignored it sends me to the position in the config files, but there because it's ignored it actually shows me all references outside the ignored files.

  const findAllImportsResults = findAllImports(configPath);
  if (!findAllImportsResults.success) {
    // temporary workaround until I fix the error handling on findAllImports
    // (do remember as I say below that errors from findAllImports are now blocking and enforce a return, hence the updated type "error")
    const trueFindAllImportsResults = {
      ...findAllImportsResults,
      errors: findAllImportsResults.errors.map((e) => ({ ...e, ...typeError })),
    };
    // return findAllImportsResults
    return trueFindAllImportsResults;
  } // It's a return because now that findAllImports is integrated within resolveConfig, working with its results is no longer optional.
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

  // validates config.data
  const data = /** @type {unknown} */ (config.data);

  // NEW: config.data validated last and within resolveData.

  const resolveCoreDataResults = await resolveCoreData(
    data,
    extracts,
    composedVariablesExclusivesSchemaResultsData
  );
  if (!resolveCoreDataResults.success) return resolveCoreDataResults;
  const {
    originalFlattenedConfigData,
    aliases_flattenedKeys,
    flattenedConfigData,
    reversedFlattenedConfigData,
    keys_valueLocations,
    nonAliasesKeys_valueLocations,
    aliasesKeys_valueLocations,
    // only retrieved from the run for config.data for now
    configDataResultsData,
  } = resolveCoreDataResults;

  // Branching for variations.

  const resolvedCoreData = {
    originalFlattenedConfigData, // for jscomments placeholders
    aliases_flattenedKeys,
    flattenedConfigData,
    reversedFlattenedConfigData,
    keys_valueLocations,
    nonAliasesKeys_valueLocations,
    aliasesKeys_valueLocations,
  };

  if (!variationsSchemaResults.data) {
    return {
      // NOTE: THINK ABOUT RETURNING ERRORS ONLY IN SUCCESSFALSE, AND WARNINGS ONLY IN SUCCESSTRUE.
      ...successTrue,
      // warnings,
      configPath, // finalized and absolute
      passedIgnores: configIgnoresSchemaResultsData,
      config,
      configDataResultsData,
      rawConfigAndImportPaths,
      lintConfigImports: configLintConfigImportsSchemaResultsData,
      myIgnoresOnly: configMyIgnoresOnlySchemaResultsData,
      composedVariablesExclusives: composedVariablesExclusivesSchemaResultsData,
      ...variationsFalse,
      resolvedCoreData,
      // specific to variationsFalse
      resolvedreferenceData: null,
      resolvedVariationData: null,
    };
  } else {
    const variationsSchemaResultsData = variationsSchemaResults.data;

    // Checks

    // Checking that the data key has each of the strings from variations.variants as its top-level keys.

    const dataTopLevelKeys = Object.keys(configDataResultsData);
    const dataTopLevelKeysSet = new Set(dataTopLevelKeys);

    const variantsKeys = Object.keys(variationsSchemaResultsData.variants);
    const variantsKeysSet = new Set(variantsKeys);

    if (dataTopLevelKeysSet.size !== variantsKeysSet.size)
      return makeSuccessFalseTypeError(
        `ERROR. There isn't the same amount of top-level keys in the data key as there is of top-level keys in the variations.variants key.`
      );
    for (const key of dataTopLevelKeysSet) {
      if (!variantsKeysSet.has(key))
        return makeSuccessFalseTypeError(
          `ERROR. The key "${key}" present among the top-level keys in the data key is not present among the top-level keys in the variations.variants key.`
        );
    }

    // Checking that none of the top-level keys of each variations, through normalization, is a variant, to prevent collisions like EN#FR#HELLO/FR#HELLO vs. FR#HELLO/HELLO, where there should be no EN#FR#HELLO

    const variantsKeysNormalized = variantsKeys.map((e) => normalize(e));
    const variantsKeysNormalizedSet = new Set(variantsKeysNormalized);

    for (const variantKey of variantsKeys) {
      /** @type {Record<string, unknown>} (Addressing `unknown`.) */
      const variation = configDataResultsData[variantKey];
      const variationTopLevelKeys = Object.keys(variation);
      const variationTopLevelKeysNormalized = variationTopLevelKeys.map((e) =>
        normalize(e)
      );

      for (const normalizedKey of variationTopLevelKeysNormalized) {
        if (variantsKeysNormalizedSet.has(normalizedKey))
          return makeSuccessFalseTypeError(
            `ERROR. The normalized top-level key "${normalizedKey}" from the "${variantKey}" variation collides with an existing variant's name either as is or when normalized ("${normalizedKey}").`
          );
      }
    }

    // Checking that variations.reference is strictly the same as one of the top-level keys in data. Specifically now as data from the referenceVariant.

    if (
      config.data[variationsSchemaResultsData.referenceVariant] !==
      config.variations.referenceData
    )
      return makeSuccessFalseTypeError(
        `ERROR. config.variations.referenceData's reference is not found within the values of any of the top-level keys in data. The object used for config.variations.referenceData needs to be strictly the same as that of one of the variants's data.`
      );

    // Checking that all variations data have the exact same keys and only so, excluding composed variables exclusives, as the canonical config.variations.referenceData.

    const referenceDataFreeKeysResults = getComposedVariablesExclusivesFreeKeys(
      variationsSchemaResultsData.referenceData,
      composedVariablesExclusivesSchemaResultsData
    );

    if (!referenceDataFreeKeysResults.success)
      return referenceDataFreeKeysResults;
    const { composedVariablesExclusivesFreeKeys: referenceDataFreeKeys } =
      referenceDataFreeKeysResults;

    const referenceDataFreeKeysSet = new Set(referenceDataFreeKeys);
    const referenceDataFreeKeysAndSet = {
      array: referenceDataFreeKeys,
      set: referenceDataFreeKeysSet,
    };

    // #1: variantsKeys_variationsDataFreeKeys__map loop
    /**
     * @type {Map<string, {array: Array<string>; set: Set<string>}>}
     * (Reminder that all keys are already verified to be unique with `flattenConfigData` within `getComposedVariablesExclusivesFreeKeys`, so there is no need to check whether or not the `Set`s are erasing duplicates that do not exist.)
     */
    const variantsKeys_variationsDataFreeKeys__map = new Map();

    for (const variantKey of variantsKeys) {
      const variationDataFreeKeysResults =
        getComposedVariablesExclusivesFreeKeys(
          configDataResultsData[variantKey],
          composedVariablesExclusivesSchemaResultsData
        );

      if (!variationDataFreeKeysResults.success)
        return variationDataFreeKeysResults;
      const { composedVariablesExclusivesFreeKeys: variationDataFreeKeys } =
        variationDataFreeKeysResults;

      variantsKeys_variationsDataFreeKeys__map.set(variantKey, {
        array: variationDataFreeKeys,
        set: new Set(variationDataFreeKeys),
      });
    }

    // #2 outstanding keys loop
    console.log("Checking for outstanding keys...");

    for (const [
      variantKey,
      variationDataFreeKeysAndSet,
    ] of variantsKeys_variationsDataFreeKeys__map) {
      const outstandingKeysSet = getArraySetDifference(
        variationDataFreeKeysAndSet,
        referenceDataFreeKeysAndSet
      );

      if (outstandingKeysSet.size !== 0) {
        const outstandingKey =
          normalize(variantKey) +
          "#" +
          outstandingKeysSet.values().next().value;
        const outstandingKeyValueLocation = keys_valueLocations[outstandingKey];

        return {
          ...successFalse,
          errors: [
            {
              ...typeError,
              message: `ERROR. Outstanding key(s) found for variant "${variantKey}".`,
            },
            {
              ...typeError,
              message: `Key "${outstandingKey}" at relative file path "${path.relative(
                process.cwd(),
                outstandingKeyValueLocation.filePath
              )}" is not found in referenceData. (Line: ${
                outstandingKeyValueLocation.loc.start.line
              }. Column: ${outstandingKeyValueLocation.loc.start.column}.)`,
            },
            {
              ...typeError,
              message: `(Total amount of keys in "${variantKey}" variation not found in referenceData: ${outstandingKeysSet.size}.)`,
            },
          ],
        };
      }
    }

    console.log("Success. No outstanding key found.");

    // #3 missing keys loop
    console.log("Checking for missing keys...");

    for (const [
      variantKey,
      variationDataFreeKeysAndSet,
    ] of variantsKeys_variationsDataFreeKeys__map) {
      const missingKeysSet = getArraySetDifference(
        referenceDataFreeKeysAndSet,
        variationDataFreeKeysAndSet
      );

      if (missingKeysSet.size !== 0) {
        const missingKey =
          normalize(variationsSchemaResultsData.referenceVariant) +
          "#" +
          missingKeysSet.values().next().value;
        const missingKeyValueLocation = keys_valueLocations[missingKey];

        return {
          ...successFalse,
          errors: [
            {
              ...typeError,
              message: `ERROR. Missing key(s) found for variant "${variantKey}".`,
            },
            {
              ...typeError,
              message: `Key "${removeVariantPrefixFromVariationKey(
                missingKey
              )}" at relative file path "${path.relative(
                process.cwd(),
                missingKeyValueLocation.filePath
              )}" is not found in "${variantKey}" variation. (Line: ${
                missingKeyValueLocation.loc.start.line
              }. Column: ${missingKeyValueLocation.loc.start.column}.)`,
            },
            {
              ...typeError,
              message: `(Total amount of keys in referenceData not found in "${variantKey}" variation: ${missingKeysSet.size}.)`,
            },
          ],
        };
      }
    }

    console.log("Success. No missing key found.");

    // Resolves

    // resolvedReferenceData
    const resolvedReferenceDataResults = await resolveVariationData(
      variationsSchemaResultsData.referenceData,
      originalFlattenedConfigData,
      aliases_flattenedKeys,
      flattenedConfigData
    );
    if (!resolvedReferenceDataResults.success)
      return resolvedReferenceDataResults;

    const resolvedReferenceData = {
      originalFlattenedConfigData:
        resolvedReferenceDataResults.originalFlattenedConfigData,
      aliases_flattenedKeys: resolvedReferenceDataResults.aliases_flattenedKeys,
      flattenedConfigData: resolvedReferenceDataResults.flattenedConfigData,
      reversedFlattenedConfigData:
        resolvedReferenceDataResults.reversedFlattenedConfigData,
      variant: variationsSchemaResultsData.referenceVariant,
      normalizedVariant: normalize(
        variationsSchemaResultsData.referenceVariant
      ),
    };

    // resolvedVariationData
    const resolvedVariationDataResults = await resolveVariationData(
      configDataResultsData[variationsSchemaResultsData.variant],
      originalFlattenedConfigData,
      aliases_flattenedKeys,
      flattenedConfigData
    );
    if (!resolvedVariationDataResults.success)
      return resolvedVariationDataResults;

    const resolvedVariationData = {
      originalFlattenedConfigData:
        resolvedVariationDataResults.originalFlattenedConfigData,
      aliases_flattenedKeys: resolvedVariationDataResults.aliases_flattenedKeys,
      flattenedConfigData: resolvedVariationDataResults.flattenedConfigData,
      reversedFlattenedConfigData:
        resolvedVariationDataResults.reversedFlattenedConfigData,
      variant: variationsSchemaResultsData.variant,
      normalizedVariant: normalize(variationsSchemaResultsData.variant),
    };

    return {
      ...successTrue,
      // warnings,
      configPath, // finalized and absolute
      passedIgnores: configIgnoresSchemaResultsData,
      config,
      configDataResultsData,
      rawConfigAndImportPaths,
      lintConfigImports: configLintConfigImportsSchemaResultsData,
      myIgnoresOnly: configMyIgnoresOnlySchemaResultsData,
      composedVariablesExclusives: composedVariablesExclusivesSchemaResultsData,
      ...variationsTrue,
      resolvedCoreData,
      // specific to variationsTrue
      resolvedReferenceData,
      resolvedVariationData,
    };
  }
};

/* makeResolvedConfigData */

/**
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMPOSEDVARIABLE
 * @param {string} composedVariable $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLE
 * @param {Record<string, string>} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAB
 * @param {Record<string, string>} aliases_flattenedKeys $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS
 * @returns $COMMENT#JSDOC#RETURNS#RESOLVECOMPOSEDVARIABLE
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
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIGDATASTRINGVALUE
 * @param {string} stringValue $COMMENT#JSDOC#PARAMS#STRINGVALUE
 * @param {Record<string, string>} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAB
 * @param {Record<string, string>} aliases_flattenedKeys $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS
 * @returns $COMMENT#JSDOC#RETURNS#RESOLVECONFIGDATASTRINGVALUE
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
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIGDATA
 * @param {ConfigData} configData $COMMENT#JSDOC#PARAMS#CONFIGDATAB
 * @param {Record<string, string>} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAB
 * @param {Record<string, string>} aliases_flattenedKeys $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS
 * @param {(value: string) => string} callback $COMMENT#JSDOC#PARAMS#CALLBACK
 * @returns $COMMENT#JSDOC#RETURNS#RESOLVECONFIGDATA
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
 * $COMMENT#JSDOC#DEFINITIONS#TRANSFORMRESOLVEDCONFIGDATA
 * @param {Record<string, unknown>} resolvedConfigData $COMMENT#JSDOC#PARAMS#RESOLVEDCONFIGDATAA
 * @param {string[]} parentsKeys $COMMENT#JSDOC#PARAMS#PARENTKEYSOPTION
 * @returns $COMMENT#JSDOC#RETURNS#TRANSFORMRESOLVEDCONFIGDATA
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
        // Now with only keys alongside values, no longer placeholders. This is because placeholders can be easily reconstructed (like below), they are translated on hover via the TypeScript server plugin which is misleading when reading the resolved config data, and in order to shorten the size of the generated JSON and `.mjs` files.
        // placeholder: `${$COMMENT}#${key}`,
      };
    }
  }

  return results;
};

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKERESOLVEDCONFIGDATA
 * @param {Record<string, unknown>} configData $COMMENT#JSDOC#PARAMS#CONFIGDATAB
 * @param {Record<string, string>} flattenedConfigData $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAB
 * @param {Record<string, string>} aliases_flattenedKeys $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS
 * @returns $COMMENT#JSDOC#RETURNS#MAKERESOLVEDCONFIGDATA
 */
const makeResolvedConfigData = (
  configData,
  flattenedConfigData,
  aliases_flattenedKeys
) => {
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

/* makeJsonData */

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKEJSONDATA
 * @param {Record<string, unknown>} resolvedConfigData $COMMENT#JSDOC#PARAMS#RESOLVEDCONFIGDATAB
 * @returns $COMMENT#JSDOC#RETURNS#MAKEJSONDATA
 */
const makeJsonData = (resolvedConfigData) =>
  JSON.stringify(resolvedConfigData, null, 2);

/* makeMjsData */

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKEMJSDATA
 * @param {Record<string, unknown>} resolvedConfigData $COMMENT#JSDOC#PARAMS#RESOLVEDCONFIGDATAB
 * @returns $COMMENT#JSDOC#RETURNS#MAKEMJSDATA
 */
const makeMjsData = (resolvedConfigData) =>
  `/** @typedef {${JSON.stringify(
    resolvedConfigData
  )}} ResolvedConfigData */\n\n/** @type {ResolvedConfigData} */\nexport const resolvedConfigData = ${JSON.stringify(
    resolvedConfigData,
    null,
    2
  )}`;

/* makeJsonPathLog */

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKEJSONPATHLOG
 * @param {string} jsonPath $COMMENT#JSDOC#PARAMS#JSONPATH
 * @returns $COMMENT#JSDOC#RETURNS#MAKEJSONPATHLOG
 */
const makeJsonPathLog = (jsonPath) =>
  `JSON resolved config data written to: \n${jsonPath}`;

/* makeMjsPathLog */

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKEMJSPATHLOG
 * @param {string} mjsPath $COMMENT#JSDOC#PARAMS#MJSPATH
 * @returns $COMMENT#JSDOC#RETURNS#MAKEMJSPATHLOG
 */
const makeMjsPathLog = (mjsPath) =>
  `MJS resolved config data written to: \n${mjsPath}`;

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
  makeJsonData,
  makeMjsData,
  makeJsonPathLog,
  makeMjsPathLog,
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
  removeVariantPrefixFromVariationPlaceholder,
} from "./_commons/utilities/helpers.js";

export { extractRuleConfigData } from "./_commons/rules/extract.js";
