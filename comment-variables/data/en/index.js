/* data */

export const enData = {
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      escapeRegex:
        'Escapes all regex characters with a `"\\"` in a string to prepare it for use in a regex.',
      makeIsolatedStringRegex:
        "Makes a global regex for a given string that ensures it is surrounded by whitespace.",
      flattenConfigData:
        "Flattens the config's data property into a one-dimensional object of `COMMENT#COMMENT`-like keys and string values. (This function is now also used to flatten variation data.)",
      resolveConfig:
        "Verifies, validates and resolves the config path to retrieve the config's data, ignores, and more.",
      makeSuccessFalseTypeError:
        'Makes a `{success: false}` object with a single error in its errors array of `{type: "error"}` based on the message it is meant to display.',
      extractValueLocationsFromLintMessages:
        "Extracts and format the output JSON from an ESLint rule's `context.report` to turn it into Value Locations.",
      reverseFlattenedConfigData:
        "Reverses the keys and the values of a flattened config data object.",
      resolveComposedVariable:
        "Resolves a composed variable, as in a string made of several comment variables, to the actual Comment Variable it is meant to represent.",
      resolveConfigDataStringValue:
        "Resolves a string value from Comment Variables config data taking into account the possibility that it is first an alias variable, second (and on the alias route) a composed variable, third (also on the alias route) a comment variable.",
      resolveConfigData:
        "$COMMENT#FORCOMPOSEDVARIABLES#RECURSIVELYRESOLVESTO $COMMENT#FORCOMPOSEDVARIABLES#OBJECTCONFIGDATA",
      makeResolvedConfigData:
        "$COMMENT#FORCOMPOSEDVARIABLES#CREATESTHAT $COMMENT#FORCOMPOSEDVARIABLES#TRANSFORMEDOBJECTCONFIGDATA",
      freshImport:
        "Guarantees a fresh import of the config, negating the innate (and hidden) cache of the dynamic `import` utility.",
      transformResolvedConfigData:
        "Transforms resolved config data with keys alongside values.",
      normalize: "Normalizes a Comment Variables key part.",
      makeNormalizedKey:
        "Normalizes and makes a Comment Variable key from the list of keys that trace to its value.",
      makeJsonData:
        "$COMMENT#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD",
      makeMjsData:
        "$COMMENT#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD",
      makeJsonPathLog:
        "$COMMENT#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD",
      makeMjsPathLog:
        "$COMMENT#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD",
      makeOriginalFlattenedConfigData:
        "Makes the original flattened config or variation data for a given config or variation provided.",
      getComposedVariablesExclusivesFreeKeys:
        "Gets all Comment Variables keys from the data of a given variation (or config) that aren't marked to be exclusively used for composed variables.",
      removeVariantPrefixFromVariationKey:
        "Removes the variant prefix of a Comment Variable key.",
      removeVariantPrefixFromVariationPlaceholder:
        "Removes the variant prefix of a Comment Variable placeholder.",
      surroundStringByOneSpace:
        'Surrounds a given string by one space right before and one space right after (`" "`).',
      getArraySetDifference:
        "Computes the difference between two collections of strings efficiently.",
      resolveCoreData:
        "Resolves the config's data into information consumable by the Comment Variables ecosystem.",
      resolveVariationData:
        "Resolves any provided variation data into information consumable by the Comment Variables ecosystem. Along with some tailored wiring, it follows the path of `resolveCoreData` while ignoring all of its checks, since they have already been passed in `resolveCoreData`.",
    }),
    params: Object.freeze({
      stringA: "The string.",
      configDataA:
        "$COMMENT#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATA $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAA",
      configDataC:
        "$COMMENT#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATA $COMMENT#FORCOMPOSEDVARIABLES#__VARIATIONORCONFIGDATA $COMMENT#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#FORCOMPOSEDVARIABLES#ISSTILLUNKNOWN__",
      configDataD:
        "$COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATA $COMMENT#FORCOMPOSEDVARIABLES#__CONFIGDATA $COMMENT#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#FORCOMPOSEDVARIABLES#MAYSTILLUNKNOWN__",
      configDataE:
        "$COMMENT#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATA $COMMENT#FORCOMPOSEDVARIABLES#__CONFIGORVARIATIONDATA $COMMENT#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#FORCOMPOSEDVARIABLES#ISSTILLUNKNOWN__",
      configDataF:
        "$COMMENT#FORCOMPOSEDVARIABLES#VARIATIONDATA $COMMENT#FORCOMPOSEDVARIABLES#__VARIATIONDATA $COMMENT#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#FORCOMPOSEDVARIABLES#MAYSTILLUNKNOWN__",
      configDataMapOption:
        "The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`.",
      parentKeysOption:
        "The list of keys that are parent to the key at hand given the recursive nature of the data's structure, instantiated as an empty array of strings (`[]`).",
      configPathA:
        'The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": "my.config.js"` in `.vscode/settings.json` for the VS Code extension.',
      message: "The human-readable message of the error.",
      lintMessages:
        "The array of LintMessages such as obtained from an `ESLint` or a `Linter` instance running.",
      pluginName:
        "$COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF $COMMENT#FORCOMPOSEDVARIABLES#PLUGINNAME $COMMENT#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD",
      ruleName:
        "$COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF $COMMENT#FORCOMPOSEDVARIABLES#RULENAME $COMMENT#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD",
      options: "The additional options as follows:",
      settings: "The required settings as follows:",
      flattenedConfigDataA:
        "The provided flattened config data to be reversed.",
      composedVariable: "The composed variable as is.",
      flattenedConfigDataB:
        "$COMMENT#FORCOMPOSEDVARIABLES#FLATTENEDCONFIGDATAB $COMMENT#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG",
      stringValue: "The encountered string value to be resolved.",
      aliases_flattenedKeys:
        "$COMMENT#FORCOMPOSEDVARIABLES#ALIASES_FLATTENEDKEYS $COMMENT#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG",
      configDataB:
        "$COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAB $COMMENT#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG",
      callback:
        "The function that runs on every time a string value is encountered, set to `resolveConfigDataStringValue` by default.",
      resolveConfigResultsSuccessTrue:
        "The successful results of a `resolveConfig` operation, already vetted and ready to be transformed.",
      moduleUrl: "The absolute path of the module to import.",
      resolvedConfigDataA: "The resolved config data.",
      parentKeys: "JSDOC#PARAMS#PARENTKEYSOPTION",
      stringB: "The key part to be normalized, notably for variants.",
      keys: "The list of keys at hand in order of traversal.",
      resolvedConfigDataB:
        "The resolved config data as obtained from `makeResolvedConfigData`.",
      jsonPath:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#EXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATH $COMMENT#FORCOMPOSEDVARIABLES#WHERETHE $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN",
      mjsPath:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#EXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATH $COMMENT#FORCOMPOSEDVARIABLES#WHERETHE $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN",
      composedVariablesExclusivesA:
        "The top-level list of all Comment Variables keys that are composed variables exclusives. (It is critical to list all variables only used to make composed variables in this array across all variations, so that they are ignored when comparing variations data keys to be one-to-one equivalents to canonical fallback data keys.)",
      isVariationData:
        "A boolean that, when `false` or `undefined`, decides to crop out the initial variant parts of composed variables exclusives keys when addressing variation data. (Originally known as `isVariationData`, the argument remains since its logic is already implemented, even though a use case for core data as yet to be found.)",
      variationKey:
        "The variation key that needs its variant prefix removed (such as going from `EN#COMMENT` to `COMMENT`).",
      variationPlaceholder:
        "The variation placeholder that needs its variant prefix removed.",
      stringC: "The given string to be surrounded.",
      sourceA: "The source collection (uses `.array`).",
      exclusionB: "The exclusion collection (uses `.set`).",
      extracts:
        "The array that holds all the object string values related to the config, since those are to be exclusively used with the config's data. Includes their file paths and `SourceLocation` objects alongside their values.",
      composedVariablesExclusivesB:
        "The list of composed variable exclusives, which are Comment Variables keys, in order to ascertain their checks within `resolveCoreData`.",
      core__originalFlattenedConfigData:
        "The `originalFlattenedConfigData` obtained from the previous `resolveCoreData` run, used to correctly branch the aliases from the core config data.",
      core__aliases_flattenedKeys:
        "The `originalFlattenedConfigData` obtained from the previous `aliases_flattenedKeys` run, used to correctly resolve the composed variables segments aliases from the core config data.",
      core__flattenedConfigData:
        "The `flattenedConfigData` obtained from the previous `resolveCoreData` run, used to correctly resolve the composed variables segments from the core config data.",
      reference__flattenedConfigData:
        "The flattenedConfigData obtained from the previous resolveVariationData run, used when `allowIncompleteVariations` is set to `true` so that missing variation data can fallback to the reference data.",
    }),
    returns: Object.freeze({
      escapeRegex: "The string with regex characters escaped.",
      makeIsolatedStringRegex:
        "The regex complete with positive lookbehind and positive lookahead to ensure the string is taken into account only when surrounded by whitespace.",
      flattenConfigData:
        "The flattened config or variation data in a success object (`success: true`). (The strict reversibility of the `resolve` and `compress` commands is handled afterwards.) Errors are bubbled up during failures so they can be reused differently on the CLI and the VS Code extension in a failure object (`success: false`).",
      resolveConfig:
        "The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, the original config, and more. Errors are returned during failures so they can be reused differently on the CLI and the VS Code extension.",
      makeSuccessFalseTypeError:
        'A `{success: false}` object with a single error in its error array of `{type: "error"}`.',
      extractValueLocationsFromLintMessages:
        "An array of Value Locations with the value, the file path and the SourceLocation (LOC) included for each.",
      reverseFlattenedConfigData:
        "The reversed version of the provided config data.",
      resolveComposedVariable:
        "The resolved composed variable as a single natural string.",
      resolveConfigDataStringValue:
        "The string value resolved as the relevant Comment Variable that it is.",
      resolveConfigData:
        "Just the resolved config data if successful, or an object with `success: false` and errors if unsuccessful.",
      makeResolvedConfigData:
        "An object with `success: true` and the resolved config data if successful, or with `success: false` and errors if unsuccessful.",
      freshImport:
        "Either an object with its `default` property sets to the default export of the module successfully loaded or `null` when an error arises. (Debugging is currently manual by looking at the error being caught in the child process.)",
      transformResolvedConfigData:
        "The transformed resolved config data with keys and placeholders readily accessible alongside values.",
      normalize:
        "The normalized key part under a common algorith for the entire library.",
      makeNormalizedKey: "The normalized key of a Comment Variable.",
      makeJsonData:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD $COMMENT#FORCOMPOSEDVARIABLES#MAKEJSONDATARETURNS",
      makeMjsData:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD $COMMENT#FORCOMPOSEDVARIABLES#MAKEMJSDATARETURNS",
      makeJsonPathLog:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED",
      makeMjsPathLog:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED",
      makeOriginalFlattenedConfigData:
        "The original flattened config or variation data at the key `originalFlattenedConfigData` along with the verified original config or variation data at the key `configDataResultsData`.",
      getComposedVariablesExclusivesFreeKeys:
        "All Comment Variables keys from the data of a given variation (or config) that aren't marked to be exclusively used for composed variables. This is to later ensure that all variations share the exact same utilized keys for perfect versatility.",
      removeVariantPrefixFromVariationKey:
        "The variation key with its variant prefix removed, akin to a Comment Variable key when `variations` are not in use.",
      removeVariantPrefixFromVariationPlaceholder:
        "The variation placeholder with its variant prefix removed, akin to a Comment Variable placeholder when `variations` are not in use.",
      surroundStringByOneSpace: "The given string surrounded by one space.",
      getArraySetDifference:
        "A new `Set` containing all elements in `a` that are not in `b`.",
      resolveCoreData:
        "With a `{success: true}` object, all the information to be consumed by the Comment Variables CLI and the Comment Variables VS Code extension, namingly `originalFlattenedConfigData`, `aliases_flattenedKeys`, `flattenedConfigData`, `reversedFlattenedConfigData`, `keys_valueLocations`, `nonAliasesKeys_valueLocations`, `aliasesKeys_valueLocations`, `configDataResultsData`, and probably more as the function evolves.",
      resolveVariationData:
        "With a `{success: true}` object, the given variation's own information to be consumed by the Comment Variables CLI and the Comment Variables VS Code extension, namingly its own `originalFlattenedConfigData`, its own `aliases_flattenedKeys`, its own `flattenedConfigData`, its own `reversedFlattenedConfigData`, and accessorily its own `configDataResultsData`.",
    }),
    constants: Object.freeze({
      configKeyRegex:
        "Ensures keys should only include lowercase letters (`Ll`), uppercase letters (`Lu`), other letters (`Lo`), dash punctuation (`Pd`), connector punctuation (`Pc`), numbers (`N`) and whitespaces (`s`).",
      flattenedConfigKeyRegex:
        "Same as `configKeyRegex` but without lowercase letters (`\\p{Ll}`), wthout dash punctuation (`Pd`), connector punctuation (`Pc`), whitespaces (`\\s`), which all three are replaced by underscores (`_`), and with the '`#`' character (that links each subkey together).",
      flattenedConfigPlaceholderLocalRegex:
        "Same as `flattenedConfigKeyRegex` but taking the prefix `$COMMENT` and its `#` into consideration, preventing two consecutive `#`'s, removing `^` and `$` in the capture group, and using `_` as replacement for whitespaces.",
      flattenedConfigPlaceholderGlobalRegex:
        "Same as `flattenedConfigPlaceholderLocalRegex` but globally.",
      extractRuleConfigData:
        'The core data needed to run the "extract" rule, fully-named `"extract-object-string-literal-values"`. (The name of the object could eventually be changed for being too function-sounding, since it could be confused for "a function that extract rule config data" instead of what it is, "the data of the extract rule config".)',
    }),
  }),
  forComposedVariables: Object.freeze({
    pluginName: "plugin",
    ruleName: "rule",
    theNameOf: "The name of the",
    forFilteringPeriod: "being used for filtering.",
    flattenedConfigDataB: "The flattened config data",
    aliases_flattenedKeys: "The aliases-to-flattened-keys dictionary",
    configDataB: "The original config data",
    obtainedResolveConfig: "obtained from resolveConfig.",
    recursivelyResolvesTo:
      "Recursively resolves Comment Variables config data values (being strings or nested objects) to generate an",
    createsThat: "Creates that",
    objectConfigData:
      "object with the same keys and the same shape as the original config data now with all string values entirely resolved.",
    transformedObjectConfigData:
      "object with the same keys and the same base shape as the original config data now with all string values entirely resolved alongside Comment Variables keys.",
    makesThe: "Makes the",
    resolvedAnExpected: "resolved config data to be written at an expected",
    pathPeriod: " path.",
    jsonCaps: "JSON",
    dotJsonPathPeriod: "`.json` path.",
    mjsCaps: "MJS",
    dotMjsPathPeriod: "`.mjs` path.",
    logWritingOfThe: "log that announces the writing of the",
    resolvedConfigDataPeriod: "resolved config data.",
    _The: "The",
    expected: "expected",
    dotJsonPath: "`.json` path",
    dotMjsPath: "`.mjs` path",
    whereThe: "where the",
    resolvedToBeWritten: "resolved config data is to be written.",
    makeJsonDataReturns:
      "It can be consumed by any language that can parse JSON, which means virtually all modern languages, so that Comment Variables can act as a single source of truth for text variables beyond JavaScript and TypeScript.",
    makeMjsDataReturns:
      "Its format makes it possible to be consumed with literal type safety in both JavaScript and TypeScript.",
    resolvedConfigCompleted: "resolved config data has been completed.",
    configData: "The config's data property.",
    variationData: "Any provided variation data.",
    configOrVariationData:
      "The config's data property or any provided variation data.",
    variationOrConfigData:
      "Any provided variation data or the config's data property.",
    configDataA:
      "(Values are typed `unknown` given the limitations in typing recursive values in JSDoc.)",
    configDataC: "(Config data at this time is still `unknown`.)",
    configDataD: "(Config data at this time may still be `unknown`.)",
    variationDataC: "(Variation data at this time is still `unknown`.)",
    variationDataD: "(Variation data at this time may still be `unknown`.)",
    configOrVariationDataC:
      "(Config or variation data at this time is still `unknown`.)",
    configOrVariationDataD:
      "(Config or variation data at this time may still be `unknown`.)",
    variationOrConfigDataC:
      "(Variation – or config – data at this time is still `unknown`.)",
    variationOrConfigDataD:
      "(Variation – or config – data at this time may still be `unknown`.)",
    __configData: "(Config data",
    __variationData: "(Variation data",
    __configOrVariationData: "(Config or variation data",
    __variationOrConfigData: "(Variation or config data",
    atThisTime: "at this time",
    isStillUnknown__: "is still `unknown`.)",
    mayStillUnknown__: "may still be `unknown`.)",
  }),
};

/* manual commentVariablesExclusives */

export const enComposedVariablesExclusives = /** @type {const} */ ([
  "EN#FORCOMPOSEDVARIABLES#PLUGINNAME",
  "EN#FORCOMPOSEDVARIABLES#RULENAME",
  "EN#FORCOMPOSEDVARIABLES#MAKESTHE",
  "EN#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED",
  "EN#FORCOMPOSEDVARIABLES#PATHPERIOD",
  "EN#FORCOMPOSEDVARIABLES#JSONCAPS",
  "EN#FORCOMPOSEDVARIABLES#MJSCAPS",
  "EN#FORCOMPOSEDVARIABLES#CONFIGDATA",
  "EN#FORCOMPOSEDVARIABLES#CONFIGDATAA",
  "EN#FORCOMPOSEDVARIABLES#CONFIGDATAC",
  "EN#FORCOMPOSEDVARIABLES#_THE",
  "EN#FORCOMPOSEDVARIABLES#WHERETHE",
  "EN#FORCOMPOSEDVARIABLES#EXPECTED",
  "EN#FORCOMPOSEDVARIABLES#ATTHISTIME",
]);
