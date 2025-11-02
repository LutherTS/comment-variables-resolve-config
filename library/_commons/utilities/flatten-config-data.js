import { successFalse, successTrue, typeError } from "../constants/bases.js";
import { ConfigDataSchema } from "../constants/schemas.js";

import { makeSuccessFalseTypeError, makeNormalizedKey } from "./helpers.js";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").ConfigData} ConfigData
 * @typedef {import("../../../types/_commons/typedefs.js").FlattenConfigDataResults} FlattenConfigDataResults
 */

// JSDoc will need to adapt to not just config.data but any data from the upcoming variations system.
/**
 * $COMMENT#JSDOC#DEFINITIONS#FLATTENCONFIGDATA
 * @param {ConfigData} configData $COMMENT#JSDOC#PARAMS#CONFIGDATA
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

  // At this point we're out of the recursion, and we can start working with the complete data. OUTSIDE OF THE RECURSION.

  return {
    ...successTrue,
    configDataMap,
  };
};

/**
 *
 * @param {unknown} data
 * @returns
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
 *
 * @param {unknown} data
 * @param {string[]} composedVariablesExclusives
 * @returns
 */
export const getComposedVariablesExclusivesFreeKeys = (
  data,
  composedVariablesExclusives
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

  const composedVariablesExclusivesSet = new Set(composedVariablesExclusives);

  const composedVariablesExclusivesFreeKeys =
    originalFlattenedConfigDataKeys.filter(
      (e) => !composedVariablesExclusivesSet.has(e)
    );

  return {
    ...successTrue,
    composedVariablesExclusivesFreeKeys,
  };
};
