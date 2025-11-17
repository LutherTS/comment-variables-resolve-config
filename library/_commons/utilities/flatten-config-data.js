import { successFalse, successTrue, typeError } from "../constants/bases.js";
import { ConfigDataSchema } from "../constants/schemas.js";

import {
  makeSuccessFalseTypeError,
  makeNormalizedKey,
  removeVariantPrefixFromVariationKey,
} from "./helpers.js";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").ConfigData} ConfigData
 * @typedef {import("../../../types/_commons/typedefs.js").FlattenConfigDataResults} FlattenConfigDataResults
 */

/* Core */

/* flattenConfigData */

/**
 * Flattens the config's data property into a one-dimensional object of `COMMENT#COMMENT`-like keys and string values. (This function is now also used to flatten variation data.)
 * @param {ConfigData} configData The config's data property or any provided variation data. (Values are typed `unknown` given the limitations in typing recursive values in JSDoc.)
 * @param {Object} [options] The additional options as follows:
 * @param {Map<string, {value: string; source: string}>} [options.configDataMap] The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`.
 * @param {string[]} [options.parentKeys] The list of keys that are parent to the key at hand given the recursive nature of the data's structure, instantiated as an empty array of strings (`[]`).
 * @returns The flattened config or variation data in a success object (`success: true`). (The strict reversibility of the `resolve` and `compress` commands is handled afterwards.) Errors are bubbled up during failures so they can be reused differently on the CLI and the VS Code extension in a failure object (`success: false`).
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

/* Derivatives */

/* makeOriginalFlattenedConfigData */

/**
 * Makes the original flattened config or variation data for a given config or variation provided.
 * @param {unknown} data The config's data property or any provided variation data. (Config or variation data at this time is still `unknown`.)
 * @returns The original flattened config or variation data at the key `originalFlattenedConfigData` along with the verified original config or variation data at the key `configDataResultsData`.
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

/* getComposedVariablesExclusivesFreeKeys */

/**
 * Gets all Comment Variables keys from the data of a given variation (or config) that aren't marked to be exclusively used for composed variables.
 * @param {unknown} data Any provided variation data or the config's data property. (Variation or config data at this time is still `unknown`.)
 * @param {string[]} composedVariablesExclusives The top-level list of all Comment Variables keys that are composed variables exclusives. (It is critical to list all variables only used to make composed variables in this array across all variations, so that they are ignored when comparing variations data keys to be one-to-one equivalents to canonical fallback data keys.)
 * @param {boolean | undefined} isCoreData A boolean that, when `false` or `undefined`, decides to crop out the initial variant parts of composed variables exclusives keys when addressing variation data. (Originally known as `isVariationData`, the argument remains since its logic is already implemented, even though a use case for core data as yet to be found.)
 * @returns All Comment Variables keys from the data of a given variation (or config) that aren't marked to be exclusively used for composed variables. This is to later ensure that all variations share the exact same utilized keys for perfect versatility.
 */
export const getComposedVariablesExclusivesFreeKeys = (
  data,
  composedVariablesExclusives,
  isCoreData
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

  const relevantComposedVariablesExclusives = !isCoreData
    ? // removes variant prefixes for variant data runs
      composedVariablesExclusives.map((e) =>
        removeVariantPrefixFromVariationKey(e)
      )
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
