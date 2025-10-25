import { successTrue } from "../constants/bases.js";

import { makeSuccessFalseTypeError, makeNormalizedKey } from "./helpers.js";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").ConfigData} ConfigData
 * @typedef {import("../../../types/_commons/typedefs.js").FlattenConfigDataResults} FlattenConfigDataResults
 */

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
