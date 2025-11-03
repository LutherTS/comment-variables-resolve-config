import { successFalse, successTrue, typeError } from "../constants/bases.js";
import { ConfigDataSchema } from "../constants/schemas.js";

import { makeSuccessFalseTypeError, makeNormalizedKey } from "./helpers.js";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").ConfigData} ConfigData
 * @typedef {import("../../../types/_commons/typedefs.js").FlattenConfigDataResults} FlattenConfigDataResults
 */

/**
 * $COMMENT#JSDOC#DEFINITIONS#FLATTENCONFIGDATA
 * @param {ConfigData} configData $COMMENT#JSDOC#PARAMS#CONFIGDATAA
 * @param {Object} [options] $COMMENT#JSDOC#PARAMS#OPTIONS
 * @param {Map<string, {value: string; source: string}>} [options.configDataMap] $COMMENT#JSDOC#PARAMS#CONFIGDATAMAPOPTION
 * @param {string[]} [options.parentKeys] $COMMENT#JSDOC#PARAMS#PARENTKEYSOPTION
 * @returns $COMMENT#JSDOC#RETURNS#FLATTENCONFIGDATA
 */
export const flattenConfigData = (
  configData,
  { configDataMap = new Map(), parentKeys = [] } = {}
) => {
  for (const [key, value] of Object.entries(configData)) {
    const newKeys = [...parentKeys, key];

    if (typeof value === "string") {
      const normalizedKey = makeNormalizedKey(newKeys);
      const source = newKeys.join(" > ");

      // checks the uniqueness of each normalized key
      if (configDataMap.has(normalizedKey)) {
        return makeSuccessFalseTypeError(
          `ERROR. The normalized key "${normalizedKey}" has already been assigned. Check between the two following key paths: \n"${
            configDataMap.get(normalizedKey).source
          }" \n"${source}"`
        );
      }

      configDataMap.set(normalizedKey, {
        value,
        source,
      });
    } else if (typeof value === "object" && value && !Array.isArray(value)) {
      const subConfigData = /** @type {ConfigData} */ (value);
      const flattenConfigDataOptions = { configDataMap, parentKeys: newKeys };

      const flattenConfigDataResults = /** @type {FlattenConfigDataResults} */ (
        flattenConfigData(subConfigData, flattenConfigDataOptions)
      );
      if (!flattenConfigDataResults.success) return flattenConfigDataResults;
    }
  }

  return {
    ...successTrue,
    configDataMap,
  };
};

/**
 * $COMMENT#JSDOC#DEFINITIONS#MAKEORIGINALFLATTENEDCONFIGDATA
 * @param {unknown} data $COMMENT#JSDOC#PARAMS#CONFIGDATAC
 * @returns $COMMENT#JSDOC#RETURNS#MAKEORIGINALFLATTENEDCONFIGDATA
 */
export const makeOriginalFlattenedConfigData = (data) => {
  // needed because of z.record()
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return makeSuccessFalseTypeError(
      // "Invalid config.data format."
      "ERROR. Invalid data format. The data should be an object."
    );
  }

  const configDataResults = ConfigDataSchema.safeParse(data);

  if (!configDataResults.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            // "Config data could not pass validation from zod."
            "ERROR. Data could not pass validation from zod.",
        },
        ...configDataResults.error.errors.map((e) => ({
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

  return {
    ...successTrue,
    originalFlattenedConfigData,
    configDataResultsData: configDataResults.data,
  };
};

/**
 * $COMMENT#JSDOC#DEFINITIONS#GETCOMPOSEDVARIABLESEXCLUSIVESFREEKEYS
 * @param {unknown} data $COMMENT#JSDOC#PARAMS#CONFIGDATAC
 * @param {string[]} composedVariablesExclusives $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVES
 * @param {boolean} isVariationData $COMMENT#JSDOC#PARAMS#ISVARIATIONDATA
 * @returns $COMMENT#JSDOC#RETURNS#GETCOMPOSEDVARIABLESEXCLUSIVESFREEKEYS
 */
export const getComposedVariablesExclusivesFreeKeys = (
  data,
  composedVariablesExclusives,
  isVariationData
) => {
  const makeOriginalFlattenedConfigDataResults =
    makeOriginalFlattenedConfigData(data);

  if (!makeOriginalFlattenedConfigDataResults.success) {
    return makeOriginalFlattenedConfigDataResults;
  }

  const { originalFlattenedConfigData } =
    makeOriginalFlattenedConfigDataResults;

  const originalFlattenedConfigDataKeys = Object.keys(
    originalFlattenedConfigData
  );

  const relevantComposedVariablesExclusives = isVariationData
    ? // removes variant prefixes for variant data runs
      composedVariablesExclusives.map((e) => e.replace(/^[^#]+#/, () => ""))
    : // retains the original array for config data runs
      composedVariablesExclusives;

  // for variant data runs, negates all logical duplicates from other variations
  const composedVariablesExclusivesSet = new Set(
    relevantComposedVariablesExclusives
  );

  const composedVariablesExclusivesFreeKeys =
    originalFlattenedConfigDataKeys.filter(
      (e) => !composedVariablesExclusivesSet.has(e)
    );

  return {
    ...successTrue,
    composedVariablesExclusivesFreeKeys,
  };
};
