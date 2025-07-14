import { successTrue } from "../constants/bases.js";
import { flattenedConfigKeyRegex } from "../constants/regexes.js";

import { makeSuccessFalseTypeError } from "./helpers.js";

/**
 * @typedef {Record<string, unknown>} ConfigData
 *
 * @typedef {{
 *   success: false;
 *   errors: Array<{ type: "error" | "warning"; message: string }>;
 * } | {
 *   success: true;
 *   configDataMap: Map<string, {value: string; source: string}>;
 * }} FlattenConfigDataResults
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
    const normalizedKey = newKeys
      .map((k) => k.toUpperCase())
      .join("#")
      .replace(/\s/g, "_");
    const source = newKeys.join(" > ");

    if (typeof value === "string") {
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

  // // strips metadata
  // /**@type {Map<string, string>} */
  // const flattenedConfigDataMap = new Map();
  // configDataMap.forEach((value, key) => {
  //   flattenedConfigDataMap.set(key, value.value);
  // });

  // // makes the flattened config data object
  // const flattenedConfigData = Object.fromEntries(flattenedConfigDataMap);

  // // The integrity of the flattened config data needs to be established before working with it safely.

  // const flattenedConfigDataKeysSet = new Set(Object.keys(flattenedConfigData));

  // const flattenedConfigDataValuesArray = Object.values(flattenedConfigData);
  // // const flattenedConfigDataValuesSet = new Set(flattenedConfigDataValuesArray);

  // // Here is where I can implement aliases. The whole flow will probably have to be re-thought. The idea is that if a value is strictly equal to a key, then it is an alias.
  // // And then, we could literally compose aliases within values, like { key: "$#CHOCOLAT CHAUD#"} ...or not. Because the goal of the API is not to be verbose, but rather to be readable. So I would always prefer $COMMENT#COMMENT $COMMENT#IS $COMMENT#BLUE over $COMMENT#CIB... it depends. Anyway I do the aliases first, and then I'll look into it.
  // // Also, since the error format I'm using is shared between the consumers of the config, I could export makeSuccessFalseTypeError. // DONE.

  // // Aliases logic:
  // // - instead of returning an error because an existing flattened key is in the value...
  // /** @type {Record<string, string>} */
  // const aliases_flattenedKeys = {};
  // // ...in aliases_flattenedKeys...
  // // for (const key of flattenedConfigDataKeysSet) {
  // for (const [key, value] of Object.entries(flattenedConfigData)) {
  //   // if (flattenedConfigDataValuesSet.has(key)) {
  //   if (flattenedConfigDataKeysSet.has(value)) {
  //     // ...the pair is now an alias... // checked
  //     aliases_flattenedKeys[key] = value;
  //     // ...the original key is removed from flattenedConfigData // checked
  //     delete flattenedConfigData[key];

  //     continue;

  //     // checks the reversability of flattenedConfigData
  //     // return {
  //     //   ...successFalse,
  //     //   errors: [
  //     //     {
  //     //       ...typeError,
  //     //       message: `ERROR. The key "${key}" is and shouldn't be among the values of flattenedConfigData.`,
  //     //     },
  //     //   ],
  //     // };
  //   }
  //   // }

  //   // for (const key of flattenedConfigDataKeysSet) {
  //   if (!flattenedConfigKeyRegex.test(key)) {
  //     // checks if each key for flattenedConfigData passes the flattenedConfigKeyRegex test
  //     return makeSuccessFalseTypeError(
  //       `ERROR. Somehow the key "${key}" is not properly formatted. (This is mostly an internal mistake.)`
  //     );
  //   }
  // }

  // /** @type {Set<string>} */
  // const set = new Set();

  // for (const value of flattenedConfigDataValuesArray) {
  //   if (set.has(value)) {
  //     console.log("errors, duplicate value");
  //     // checks that no two values are duplicate
  //     return makeSuccessFalseTypeError(
  //       `ERROR. The value "${value}" is already assigned to an existing key.`
  //     );
  //   }
  //   set.add(value);
  // }

  // // Also including the reversed flattened config data.

  // const reversedFlattenedConfigData = Object.fromEntries(
  //   Object.entries(flattenedConfigData).map(([key, value]) => [value, key])
  // );

  // console.log("Aliases are:", aliases_flattenedKeys);

  // return {
  //   ...successTrue,
  //   flattenedConfigData,
  //   reversedFlattenedConfigData,
  //   aliases_flattenedKeys,
  // };
};
