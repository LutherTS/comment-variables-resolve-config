import {
  successFalse,
  successTrue,
  typeError,
  $COMMENT,
} from "../constants/bases.js";
import {
  flattenedConfigKeyRegex,
  flattenedConfigPlaceholderLocalRegex,
} from "../constants/regexes.js";

import {
  makeSuccessFalseTypeError,
  reverseFlattenedConfigData,
  removeVariantPrefixFromVariationKey,
} from "./helpers.js";
import { makeOriginalFlattenedConfigData } from "./flatten-config-data.js";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").ValueLocation} ValueLocation
 */

/* Core */

/* resolveCoreData */

/**
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVECOREDATA
 * @param {unknown} data $COMMENT#JSDOC#PARAMS#CONFIGDATAD
 * @param {ValueLocation[]} extracts $COMMENT#JSDOC#PARAMS#EXTRACTS
 * @param {string[]} composedVariablesExclusives $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVESB
 * @returns $COMMENT#JSDOC#RETURNS#RESOLVECOREDATA
 */
export const resolveCoreData = async (
  data,
  extracts,
  composedVariablesExclusives
) => {
  const makeOriginalFlattenedConfigDataResults =
    makeOriginalFlattenedConfigData(data);

  if (!makeOriginalFlattenedConfigDataResults.success) {
    return makeOriginalFlattenedConfigDataResults;
  }

  let { originalFlattenedConfigData, configDataResultsData } =
    makeOriginalFlattenedConfigDataResults;

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
        `ERROR. Value "${value}" should not include "//" for structural reasons related to JavaScript comments.`
      );
    }
    if (value.includes("/*")) {
      return makeSuccessFalseTypeError(
        `ERROR. Value "${value}" should not include "/*" for structural reasons related to JavaScript comments.`
      );
    }
    if (value.includes("*/")) {
      return makeSuccessFalseTypeError(
        `ERROR. Value "${value}" should not include "*/" for structural reasons related to JavaScript comments.`
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

  // Also including the reversed flattened config data.

  const reversedFlattenedConfigData =
    reverseFlattenedConfigData(flattenedConfigData);

  // Handling value locations and object string values...

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

  // And now including the checks on composed variables exclusives.

  // checks that all composed variables exclusives are comment variables (so neither alias variables nor composed variables)
  for (const e of composedVariablesExclusives) {
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
    // warnings,
    originalFlattenedConfigData, // for jscomments placeholders
    aliases_flattenedKeys,
    flattenedConfigData,
    reversedFlattenedConfigData,
    keys_valueLocations,
    nonAliasesKeys_valueLocations,
    aliasesKeys_valueLocations,
    // exploratory name, only from resolveCoreData
    configDataResultsData,
  };
};

/* Derivatives */

/* resolveVariationData */

/**
 * $COMMENT#JSDOC#DEFINITIONS#RESOLVEVARIATIONDATA
 * @param {unknown} data $COMMENT#JSDOC#PARAMS#CONFIGDATAF
 * @param {Record<string, string>} core__originalFlattenedConfigData $COMMENT#JSDOC#PARAMS#CORE__ORIGINALFLATTENEDCONFIGDATA
 * @param {Record<string, string>} core__aliases_flattenedKeys $COMMENT#JSDOC#PARAMS#CORE__ALIASES_FLATTENEDKEYS
 * @param {Record<string, string>} core__flattenedConfigData $COMMENT#JSDOC#PARAMS#CORE__FLATTENEDCONFIGDATA
 * @returns $COMMENT#JSDOC#RETURNS#RESOLVEVARIATIONDATA
 */
export const resolveVariationData = async (
  data,
  core__originalFlattenedConfigData,
  core__aliases_flattenedKeys,
  core__flattenedConfigData
) => {
  const makeOriginalFlattenedConfigDataResults =
    makeOriginalFlattenedConfigData(data);

  if (!makeOriginalFlattenedConfigDataResults.success) {
    return makeOriginalFlattenedConfigDataResults;
  }

  let { originalFlattenedConfigData, configDataResultsData } =
    makeOriginalFlattenedConfigDataResults;

  // Aliases logic: (aliases_flattenedKeys remains needed because it is used on `compress` and `resolve` to confine the behavior to the variation selected)
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
    if (core__originalFlattenedConfigData[value]) {
      // ... the pair is now an alias ...
      aliases_flattenedKeys[key] = removeVariantPrefixFromVariationKey(value);

      continue;
    } else {
      // ... separating originalFlattenedConfigData into two objects: one for non-alias pairs and one for alias pairs.
      flattenedKeys_originalsOnly[key] = value;
    }
  }

  /** @type {Record<string, string>} */
  const flattenedConfigData = {};

  const flattenedKeys_originalsOnly__EntriesArray = Object.entries(
    flattenedKeys_originalsOnly
  );

  for (const [key, value] of flattenedKeys_originalsOnly__EntriesArray) {
    if (value.includes(`${$COMMENT}#`)) {
      const valueSegments = value.split(" ");
      const keySegments = valueSegments.map((e) =>
        e.replace(`${$COMMENT}#`, "")
      );

      const resolvedSegments = keySegments.map(
        (e) =>
          // flattenedKeys_originalsOnly[e] ||
          // flattenedKeys_originalsOnly[aliases_flattenedKeys?.[e]]
          core__flattenedConfigData[e] ||
          core__flattenedConfigData[core__aliases_flattenedKeys?.[e]]
        // (In the resolveCoreData I had to use flattenedKeys_originalsOnly because flattenedConfigData didn't exist yet. But resolveVariationData runs after resolveCoreData, I can rely on core__flattenedConfigData.)
      );

      const composedVariable = resolvedSegments.join(" ");
      flattenedConfigData[key] = composedVariable;
    } else flattenedConfigData[key] = value;
  }

  // Also including the reversed flattened config data.

  const reversedFlattenedConfigData =
    reverseFlattenedConfigData(flattenedConfigData);

  return {
    // NOTE: THINK ABOUT RETURNING ERRORS ONLY IN SUCCESSFALSE, AND WARNINGS ONLY IN SUCCESSTRUE.
    ...successTrue,
    // warnings,
    originalFlattenedConfigData, // for jscomments placeholders
    aliases_flattenedKeys,
    flattenedConfigData,
    reversedFlattenedConfigData,
    // exploratory name, to be used only from the resolveData run for config.data
    configDataResultsData,
  };
};
