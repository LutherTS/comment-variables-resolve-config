import { successTrue } from "../constants/bases.js";

import { makeSuccessFalseTypeError, makeNormalizedKey } from "./helpers.js";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").ConfigData} ConfigData
 * @typedef {import("../../../types/_commons/typedefs.js").FlattenConfigDataResults} FlattenConfigDataResults
 */

/**
 * Flattens the config's data property into a one-dimensional object of $COMMENT-*-like keys and string values.
 * @param {ConfigData} configData The config's data property. (Values are typed `unknown` given the limitations in typing recursive values in JSDoc.)
 * @param {Object} [options] The additional options as follows:
 * @param {Map<string, {value: string; source: string}>} [options.configDataMap] The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`.
 * @param {string[]} [options.parentKeys] The list of keys that are parent to the key at hand given the recursive nature of the config's data's data structure, instantiated as an empty array of strings (`[]`).
 * @returns Both the flattened config data and its reversed version to ensure the strict reversibility of the `resolve` and `compress` commands in a success object (`success: true`). Errors are bubbled up during failures so they can be reused differently on the CLI and the VS Code extension in a failure object (`success: false`).
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

      if (configDataMap.has(normalizedKey)) {
        // checks the uniqueness of each normalized key
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
