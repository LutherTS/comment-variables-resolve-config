const data = {
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      escapeRegex:
        'Escapes all regex characters with a `"\\"` in a string to prepare it for use in a regex.' /* $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX */,
      makeIsolatedStringRegex:
        "Makes a global regex for a given string that ensures it is surrounded by whitespace." /* $COMMENT#JSDOC#DEFINITIONS#MAKEISOLATEDSTRINGREGEX */,
      flattenConfigData:
        "Flattens the config's data property into a one-dimensional object of `COMMENT#COMMENT`-like keys and string values. (This function is now also used to flatten variation data.)" /* $COMMENT#JSDOC#DEFINITIONS#FLATTENCONFIGDATA */,
      resolveConfig:
        "Verifies, validates and resolves the config path to retrieve the config's data, ignores, and more." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIG */,
      makeSuccessFalseTypeError:
        'Makes a `{success: false}` object with a single error in its errors array of `{type: "error"}` based on the message it is meant to display.' /* $COMMENT#JSDOC#DEFINITIONS#MAKESUCCESSFALSETYPEERROR */,
      extractValueLocationsFromLintMessages:
        "Extracts and format the output JSON from an ESLint rule's `context.report` to turn it into Value Locations." /* $COMMENT#JSDOC#DEFINITIONS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES */,
      reverseFlattenedConfigData:
        "Reverses the keys and the values of a flattened config data object." /* $COMMENT#JSDOC#DEFINITIONS#REVERSEFLATTENEDCONFIGDATA */,
      resolveComposedVariable:
        "Resolves a composed variable, as in a string made of several comment variables, to the actual Comment Variable it is meant to represent." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMPOSEDVARIABLE */,
      resolveConfigDataStringValue:
        "Resolves a string value from Comment Variables config data taking into account the possibility that it is first an alias variable, second (and on the alias route) a composed variable, third (also on the alias route) a comment variable." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIGDATASTRINGVALUE */,
      resolveConfigData:
        "$COMMENT#FORCOMPOSEDVARIABLES#RECURSIVELYRESOLVESTO $COMMENT#FORCOMPOSEDVARIABLES#OBJECTCONFIGDATA" /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIGDATA */,
      makeResolvedConfigData:
        "$COMMENT#FORCOMPOSEDVARIABLES#CREATESTHAT $COMMENT#FORCOMPOSEDVARIABLES#TRANSFORMEDOBJECTCONFIGDATA" /* $COMMENT#JSDOC#DEFINITIONS#MAKERESOLVEDCONFIGDATA */,
      freshImport:
        "Guarantees a fresh import of the config, negating the innate (and hidden) cache of the dynamic `import` utility." /* $COMMENT#JSDOC#DEFINITIONS#FRESHIMPORT */,
      transformResolvedConfigData:
        "Transforms resolved config data with keys alongside values." /* $COMMENT#JSDOC#DEFINITIONS#TRANSFORMRESOLVEDCONFIGDATA */,
      normalize:
        "Normalizes a Comment Variables key part." /* $COMMENT#JSDOC#DEFINITIONS#NORMALIZE */,
      makeNormalizedKey:
        "Normalizes and makes a Comment Variable key from the list of keys that trace to its value." /* $COMMENT#JSDOC#DEFINITIONS#MAKENORMALIZEDKEY */,
      makeJsonData:
        "$COMMENT#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD" /* $COMMENT#JSDOC#DEFINITIONS#MAKEJSONDATA */,
      makeMjsData:
        "$COMMENT#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD" /* $COMMENT#JSDOC#DEFINITIONS#MAKEMJSDATA */,
      makeJsonPathLog:
        "$COMMENT#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD" /* $COMMENT#JSDOC#DEFINITIONS#MAKEJSONPATHLOG */,
      makeMjsPathLog:
        "$COMMENT#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD" /* $COMMENT#JSDOC#DEFINITIONS#MAKEMJSPATHLOG */,
      makeOriginalFlattenedConfigData:
        "Makes the original flattened config or variation data for a given config or variation provided." /* $COMMENT#JSDOC#DEFINITIONS#MAKEORIGINALFLATTENEDCONFIGDATA */,
      getComposedVariablesExclusivesFreeKeys:
        "Gets all Comment Variables keys from the data of a given variation (or config) that aren't marked to be exclusively used for composed variables." /* $COMMENT#JSDOC#DEFINITIONS#GETCOMPOSEDVARIABLESEXCLUSIVESFREEKEYS */,
      removeVariantPrefixFromVariationKey:
        "Removes the variant prefix of a Comment Variable key." /* $COMMENT#JSDOC#DEFINITIONS#REMOVEVARIANTPREFIXFROMVARIATIONKEY */,
      removeVariantPrefixFromVariationPlaceholder:
        "Removes the variant prefix of a Comment Variable placeholder." /* $COMMENT#JSDOC#DEFINITIONS#REMOVEVARIANTPREFIXFROMVARIATIONPLACEHOLDER */,
      surroundStringByOneSpace:
        'Surrounds a given string by one space right before and one space right after (`" "`).' /* $COMMENT#JSDOC#DEFINITIONS#SURROUNDSTRINGBYONESPACE */,
      getArraySetDifference:
        "Computes the difference between two collections of strings efficiently." /* $COMMENT#JSDOC#DEFINITIONS#GETARRAYSETDIFFERENCE */,
      resolveCoreData:
        "Resolves the config's data into information consumable by the Comment Variables ecosystem." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECOREDATA */,
      resolveVariationData:
        "Resolves any provided variation data into information consumable by the Comment Variables ecosystem. Along with some tailored wiring, it follows the path of `resolveCoreData` while ignoring all of its checks, since they have already been passed in `resolveCoreData`." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVEVARIATIONDATA */,
    }),
    params: Object.freeze({
      stringA: "The string." /* $COMMENT#JSDOC#PARAMS#STRINGA */,
      configDataA:
        "$COMMENT#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATA $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAA" /* $COMMENT#JSDOC#PARAMS#CONFIGDATAA */,
      configDataC:
        "$COMMENT#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATA $COMMENT#FORCOMPOSEDVARIABLES#__VARIATIONORCONFIGDATA $COMMENT#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#FORCOMPOSEDVARIABLES#ISSTILLUNKNOWN__" /* $COMMENT#JSDOC#PARAMS#CONFIGDATAC */,
      configDataD:
        "$COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATA $COMMENT#FORCOMPOSEDVARIABLES#__CONFIGDATA $COMMENT#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#FORCOMPOSEDVARIABLES#MAYSTILLUNKNOWN__" /* $COMMENT#JSDOC#PARAMS#CONFIGDATAD */,
      configDataE:
        "$COMMENT#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATA $COMMENT#FORCOMPOSEDVARIABLES#__CONFIGORVARIATIONDATA $COMMENT#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#FORCOMPOSEDVARIABLES#ISSTILLUNKNOWN__" /* $COMMENT#JSDOC#PARAMS#CONFIGDATAE */,
      configDataF:
        "$COMMENT#FORCOMPOSEDVARIABLES#VARIATIONDATA $COMMENT#FORCOMPOSEDVARIABLES#__VARIATIONDATA $COMMENT#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#FORCOMPOSEDVARIABLES#MAYSTILLUNKNOWN__" /* $COMMENT#JSDOC#PARAMS#CONFIGDATAF */,
      configDataMapOption:
        "The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`." /* $COMMENT#JSDOC#PARAMS#CONFIGDATAMAPOPTION */,
      parentKeysOption:
        "The list of keys that are parent to the key at hand given the recursive nature of the data's structure, instantiated as an empty array of strings (`[]`)." /* $COMMENT#JSDOC#PARAMS#PARENTKEYSOPTION */,
      configPathA:
        'The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": "my.config.js"` in `.vscode/settings.json` for the VS Code extension.' /* $COMMENT#JSDOC#PARAMS#CONFIGPATHA */ /* $COMMENT#JSDOC#PARAMS#CONFIGPATH */,
      message:
        "The human-readable message of the error." /* $COMMENT#JSDOC#PARAMS#MESSAGE */,
      lintMessages:
        "The array of LintMessages such as obtained from an `ESLint` or a `Linter` instance running." /* $COMMENT#JSDOC#PARAMS#LINTMESSAGES */,
      pluginName:
        "$COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF $COMMENT#FORCOMPOSEDVARIABLES#PLUGINNAME $COMMENT#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD" /* $COMMENT#JSDOC#PARAMS#PLUGINNAME */,
      ruleName:
        "$COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF $COMMENT#FORCOMPOSEDVARIABLES#RULENAME $COMMENT#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD" /* $COMMENT#JSDOC#PARAMS#RULENAME */,
      options:
        "The additional options as follows:" /* $COMMENT#JSDOC#PARAMS#OPTIONS */,
      settings:
        "The required settings as follows:" /* $COMMENT#JSDOC#PARAMS#SETTINGS */,
      flattenedConfigDataA:
        "The provided flattened config data to be reversed." /* $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAA */,
      composedVariable:
        "The composed variable as is." /* $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLE */,
      flattenedConfigDataB:
        "$COMMENT#FORCOMPOSEDVARIABLES#FLATTENEDCONFIGDATAB $COMMENT#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG" /* $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAB */,
      stringValue:
        "The encountered string value to be resolved." /* $COMMENT#JSDOC#PARAMS#STRINGVALUE */,
      aliases_flattenedKeys:
        "$COMMENT#FORCOMPOSEDVARIABLES#ALIASES_FLATTENEDKEYS $COMMENT#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG" /* $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS */,
      configDataB:
        "$COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAB $COMMENT#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG" /* $COMMENT#JSDOC#PARAMS#CONFIGDATAB */,
      callback:
        "The function that runs on every time a string value is encountered, set to `resolveConfigDataStringValue` by default." /* $COMMENT#JSDOC#PARAMS#CALLBACK */,
      resolveConfigResultsSuccessTrue:
        "The successful results of a `resolveConfig` operation, already vetted and ready to be transformed." /* $COMMENT#JSDOC#PARAMS#RESOLVECONFIGRESULTSSUCCESSTRUE */,
      moduleUrl:
        "The absolute path of the module to import." /* $COMMENT#JSDOC#PARAMS#MODULEURL */,
      resolvedConfigDataA:
        "The resolved config data." /* $COMMENT#JSDOC#PARAMS#RESOLVEDCONFIGDATAA */,
      parentKeys:
        "JSDOC#PARAMS#PARENTKEYSOPTION" /* $COMMENT#JSDOC#PARAMS#PARENTKEYS */,
      stringB:
        "The key part to be normalized, notably for variants." /* $COMMENT#JSDOC#PARAMS#STRINGB */,
      keys: "The list of keys at hand in order of traversal." /* $COMMENT#JSDOC#PARAMS#KEYS */,
      resolvedConfigDataB:
        "The resolved config data as obtained from `makeResolvedConfigData`." /* $COMMENT#JSDOC#PARAMS#RESOLVEDCONFIGDATAB */,
      jsonPath:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#EXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATH $COMMENT#FORCOMPOSEDVARIABLES#WHERETHE $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN" /* $COMMENT#JSDOC#PARAMS#JSONPATH */,
      mjsPath:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#EXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATH $COMMENT#FORCOMPOSEDVARIABLES#WHERETHE $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN" /* $COMMENT#JSDOC#PARAMS#MJSPATH */,
      composedVariablesExclusivesA:
        "The top-level list of all Comment Variables keys that are composed variables exclusives. (It is critical to list all variables only used to make composed variables in this array across all variations, so that they are ignored when comparing variations data keys to be one-to-one equivalents to canonical fallback data keys.)" /* $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVESA */,
      isVariationData:
        "A boolean that, when `false` or `undefined`, decides to crop out the initial variant parts of composed variables exclusives keys when addressing variation data. (Originally known as `isVariationData`, the argument remains since its logic is already implemented, even though a use case for core data as yet to be found.)" /* $COMMENT#JSDOC#PARAMS#ISVARIATIONDATA */,
      variationKey:
        "The variation key that needs its variant prefix removed (such as going from `EN#COMMENT` to `COMMENT`)." /* $COMMENT#JSDOC#PARAMS#VARIATIONKEY */,
      variationPlaceholder:
        "The variation placeholder that needs its variant prefix removed." /* $COMMENT#JSDOC#PARAMS#VARIATIONPLACEHOLDER */,
      stringC:
        "The given string to be surrounded." /* $COMMENT#JSDOC#PARAMS#STRINGC */,
      sourceA:
        "The source collection (uses `.array`)." /* $COMMENT#JSDOC#PARAMS#SOURCEA */,
      exclusionB:
        "The exclusion collection (uses `.set`)." /* $COMMENT#JSDOC#PARAMS#EXCLUSIONB */,
      extracts:
        "The array that holds all the object string values related to the config, since those are to be exclusively used with the config's data. Includes their file paths and `SourceLocation` objects alongside their values." /* $COMMENT#JSDOC#PARAMS#EXTRACTS */,
      composedVariablesExclusivesB:
        "The list of composed variable exclusives, which are Comment Variables keys, in order to ascertain their checks within `resolveCoreData`." /* $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVESB */,
      core__originalFlattenedConfigData:
        "The `originalFlattenedConfigData` obtained from the previous `resolveCoreData` run, used to correctly branch the aliases from the core config data." /* $COMMENT#JSDOC#PARAMS#CORE__ORIGINALFLATTENEDCONFIGDATA */,
      core__aliases_flattenedKeys:
        "The `originalFlattenedConfigData` obtained from the previous `aliases_flattenedKeys` run, used to correctly resolve the composed variables segments aliases from the core config data." /* $COMMENT#JSDOC#PARAMS#CORE__ALIASES_FLATTENEDKEYS */,
      core__flattenedConfigData:
        "The `flattenedConfigData` obtained from the previous `resolveCoreData` run, used to correctly resolve the composed variables segments from the core config data." /* $COMMENT#JSDOC#PARAMS#CORE__FLATTENEDCONFIGDATA */,
      reference__flattenedConfigData:
        "The flattenedConfigData obtained from the previous resolveVariationData run, used when `allowIncompleteVariations` is set to `true` so that missing variation data can fallback to the reference data." /* $COMMENT#JSDOC#PARAMS#REFERENCE__FLATTENEDCONFIGDATA */,
    }),
    returns: Object.freeze({
      escapeRegex:
        "The string with regex characters escaped." /* $COMMENT#JSDOC#RETURNS#ESCAPEREGEX */,
      makeIsolatedStringRegex:
        "The regex complete with positive lookbehind and positive lookahead to ensure the string is taken into account only when surrounded by whitespace." /* $COMMENT#JSDOC#RETURNS#MAKEISOLATEDSTRINGREGEX */,
      flattenConfigData:
        "The flattened config or variation data in a success object (`success: true`). (The strict reversibility of the `resolve` and `compress` commands is handled afterwards.) Errors are bubbled up during failures so they can be reused differently on the CLI and the VS Code extension in a failure object (`success: false`)." /* $COMMENT#JSDOC#RETURNS#FLATTENCONFIGDATA */,
      resolveConfig:
        "The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, the original config, and more. Errors are returned during failures so they can be reused differently on the CLI and the VS Code extension." /* $COMMENT#JSDOC#RETURNS#RESOLVECONFIG */,
      makeSuccessFalseTypeError:
        'A `{success: false}` object with a single error in its error array of `{type: "error"}`.' /* $COMMENT#JSDOC#RETURNS#MAKESUCCESSFALSETYPEERROR */,
      extractValueLocationsFromLintMessages:
        "An array of Value Locations with the value, the file path and the SourceLocation (LOC) included for each." /* $COMMENT#JSDOC#RETURNS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES */,
      reverseFlattenedConfigData:
        "The reversed version of the provided config data." /* $COMMENT#JSDOC#RETURNS#REVERSEFLATTENEDCONFIGDATA */,
      resolveComposedVariable:
        "The resolved composed variable as a single natural string." /* $COMMENT#JSDOC#RETURNS#RESOLVECOMPOSEDVARIABLE */,
      resolveConfigDataStringValue:
        "The string value resolved as the relevant Comment Variable that it is." /* $COMMENT#JSDOC#RETURNS#RESOLVECONFIGDATASTRINGVALUE */,
      resolveConfigData:
        "Just the resolved config data if successful, or an object with `success: false` and errors if unsuccessful." /* $COMMENT#JSDOC#RETURNS#RESOLVECONFIGDATA */,
      makeResolvedConfigData:
        "An object with `success: true` and the resolved config data if successful, or with `success: false` and errors if unsuccessful." /* $COMMENT#JSDOC#RETURNS#MAKERESOLVEDCONFIGDATA */,
      freshImport:
        "Either an object with its `default` property sets to the default export of the module successfully loaded or `null` when an error arises. (Debugging is currently manual by looking at the error being caught in the child process.)" /* $COMMENT#JSDOC#RETURNS#FRESHIMPORT */,
      transformResolvedConfigData:
        "The transformed resolved config data with keys and placeholders readily accessible alongside values." /* $COMMENT#JSDOC#RETURNS#TRANSFORMRESOLVEDCONFIGDATA */,
      normalize:
        "The normalized key part under a common algorith for the entire library." /* $COMMENT#JSDOC#RETURNS#NORMALIZE */,
      makeNormalizedKey:
        "The normalized key of a Comment Variable." /* $COMMENT#JSDOC#RETURNS#MAKENORMALIZEDKEY */,
      makeJsonData:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD $COMMENT#FORCOMPOSEDVARIABLES#MAKEJSONDATARETURNS" /* $COMMENT#JSDOC#RETURNS#MAKEJSONDATA */,
      makeMjsData:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD $COMMENT#FORCOMPOSEDVARIABLES#MAKEMJSDATARETURNS" /* $COMMENT#JSDOC#RETURNS#MAKEMJSDATA */,
      makeJsonPathLog:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED" /* $COMMENT#JSDOC#RETURNS#MAKEJSONPATHLOG */,
      makeMjsPathLog:
        "$COMMENT#FORCOMPOSEDVARIABLES#_THE $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED" /* $COMMENT#JSDOC#RETURNS#MAKEMJSPATHLOG */,
      makeOriginalFlattenedConfigData:
        "The original flattened config or variation data at the key `originalFlattenedConfigData` along with the verified original config or variation data at the key `configDataResultsData`." /* $COMMENT#JSDOC#RETURNS#MAKEORIGINALFLATTENEDCONFIGDATA */,
      getComposedVariablesExclusivesFreeKeys:
        "All Comment Variables keys from the data of a given variation (or config) that aren't marked to be exclusively used for composed variables. This is to later ensure that all variations share the exact same utilized keys for perfect versatility." /* $COMMENT#JSDOC#RETURNS#GETCOMPOSEDVARIABLESEXCLUSIVESFREEKEYS */,
      removeVariantPrefixFromVariationKey:
        "The variation key with its variant prefix removed, akin to a Comment Variable key when `variations` are not in use." /* $COMMENT#JSDOC#RETURNS#REMOVEVARIANTPREFIXFROMVARIATIONKEY */,
      removeVariantPrefixFromVariationPlaceholder:
        "The variation placeholder with its variant prefix removed, akin to a Comment Variable placeholder when `variations` are not in use." /* $COMMENT#JSDOC#RETURNS#REMOVEVARIANTPREFIXFROMVARIATIONPLACEHOLDER */,
      surroundStringByOneSpace:
        "The given string surrounded by one space." /* $COMMENT#JSDOC#RETURNS#SURROUNDSTRINGBYONESPACE */,
      getArraySetDifference:
        "A new `Set` containing all elements in `a` that are not in `b`." /* $COMMENT#JSDOC#RETURNS#GETARRAYSETDIFFERENCE */,
      resolveCoreData:
        "With a `{success: true}` object, all the information to be consumed by the Comment Variables CLI and the Comment Variables VS Code extension, namingly `originalFlattenedConfigData`, `aliases_flattenedKeys`, `flattenedConfigData`, `reversedFlattenedConfigData`, `keys_valueLocations`, `nonAliasesKeys_valueLocations`, `aliasesKeys_valueLocations`, `configDataResultsData`, and probably more as the function evolves." /* $COMMENT#JSDOC#RETURNS#RESOLVECOREDATA */,
      resolveVariationData:
        "With a `{success: true}` object, the given variation's own information to be consumed by the Comment Variables CLI and the Comment Variables VS Code extension, namingly its own `originalFlattenedConfigData`, its own `aliases_flattenedKeys`, its own `flattenedConfigData`, its own `reversedFlattenedConfigData`, and accessorily its own `configDataResultsData`." /* $COMMENT#JSDOC#RETURNS#RESOLVEVARIATIONDATA */,
    }),
    constants: Object.freeze({
      configKeyRegex:
        "Ensures keys should only include lowercase letters (`Ll`), uppercase letters (`Lu`), other letters (`Lo`), dash punctuation (`Pd`), connector punctuation (`Pc`), numbers (`N`) and whitespaces (`s`)." /* $COMMENT#JSDOC#CONSTANTS#CONFIGKEYREGEX */,
      flattenedConfigKeyRegex:
        "Same as `configKeyRegex` but without lowercase letters (`\\p{Ll}`), without whitespaces (`\\s` which are replaced by underscores) and with the '`#`' character (that links each subkey together)." /* $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGKEYREGEX */,
      flattenedConfigPlaceholderLocalRegex:
        "Same as `flattenedConfigKeyRegex` but taking the prefix `$COMMENT` and its `#` into consideration, preventing two consecutive `#`'s, removing `^` and `$` in the capture group, and using `_` as replacement for whitespaces." /* $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGPLACEHOLDERLOCALREGEX */,
      flattenedConfigPlaceholderGlobalRegex:
        "Same as `flattenedConfigPlaceholderLocalRegex` but globally." /* $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGPLACEHOLDERGLOBALREGEX */,
      extractRuleConfigData:
        'The core data needed to run the "extract" rule, fully-named `"extract-object-string-literal-values"`. (The name of the object could eventually be changed for being too function-sounding, since it could be confused for "a function that extract rule config data" instead of what it is, "the data of the extract rule config".)' /* $COMMENT#JSDOC#CONSTANTS#EXTRACTRULECONFIGDATA */,
    }),
  }),
  forComposedVariables: Object.freeze({
    pluginName: "plugin" /* $COMMENT#FORCOMPOSEDVARIABLES#PLUGINNAME */,
    ruleName: "rule" /* $COMMENT#FORCOMPOSEDVARIABLES#RULENAME */,
    theNameOf: "The name of the" /* $COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF */,
    forFilteringPeriod:
      "being used for filtering." /* $COMMENT#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD */,
    flattenedConfigDataB:
      "The flattened config data" /* $COMMENT#FORCOMPOSEDVARIABLES#FLATTENEDCONFIGDATAB */,
    aliases_flattenedKeys:
      "The aliases-to-flattened-keys dictionary" /* $COMMENT#FORCOMPOSEDVARIABLES#ALIASES_FLATTENEDKEYS */,
    configDataB:
      "The original config data" /* $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAB */,
    obtainedResolveConfig:
      "obtained from resolveConfig." /* $COMMENT#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG */,
    recursivelyResolvesTo:
      "Recursively resolves Comment Variables config data values (being strings or nested objects) to generate an" /* $COMMENT#FORCOMPOSEDVARIABLES#RECURSIVELYRESOLVESTO */,
    createsThat: "Creates that" /* $COMMENT#FORCOMPOSEDVARIABLES#CREATESTHAT */,
    objectConfigData:
      "object with the same keys and the same shape as the original config data now with all string values entirely resolved." /* $COMMENT#FORCOMPOSEDVARIABLES#OBJECTCONFIGDATA */,
    transformedObjectConfigData:
      "object with the same keys and the same base shape as the original config data now with all string values entirely resolved alongside Comment Variables keys." /* $COMMENT#FORCOMPOSEDVARIABLES#TRANSFORMEDOBJECTCONFIGDATA */,
    makesThe: "Makes the" /* $COMMENT#FORCOMPOSEDVARIABLES#MAKESTHE */,
    resolvedAnExpected:
      "resolved config data to be written at an expected" /* $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED */,
    pathPeriod: " path." /* $COMMENT#FORCOMPOSEDVARIABLES#PATHPERIOD */,
    jsonCaps: "JSON" /* $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS */,
    dotJsonPathPeriod:
      "`.json` path." /* $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD */,
    mjsCaps: "MJS" /* $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS */,
    dotMjsPathPeriod:
      "`.mjs` path." /* $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD */,
    logWritingOfThe:
      "log that announces the writing of the" /* $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE */,
    resolvedConfigDataPeriod:
      "resolved config data." /* $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD */,
    _The: "The" /* $COMMENT#FORCOMPOSEDVARIABLES#_THE */,
    expected: "expected" /* $COMMENT#FORCOMPOSEDVARIABLES#EXPECTED */,
    dotJsonPath: "`.json` path" /* $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATH */,
    dotMjsPath: "`.mjs` path" /* $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATH */,
    whereThe: "where the" /* $COMMENT#FORCOMPOSEDVARIABLES#WHERETHE */,
    resolvedToBeWritten:
      "resolved config data is to be written." /* $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN */,
    makeJsonDataReturns:
      "It can be consumed by any language that can parse JSON, which means virtually all modern languages, so that Comment Variables can act as a single source of truth for text variables beyond JavaScript and TypeScript." /* $COMMENT#FORCOMPOSEDVARIABLES#MAKEJSONDATARETURNS */,
    makeMjsDataReturns:
      "Its format makes it possible to be consumed with literal type safety in both JavaScript and TypeScript." /* $COMMENT#FORCOMPOSEDVARIABLES#MAKEMJSDATARETURNS */,
    resolvedConfigCompleted:
      "resolved config data has been completed." /* $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED */,
    configData:
      "The config's data property." /* $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATA */,
    variationData:
      "Any provided variation data." /* $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONDATA */,
    configOrVariationData:
      "The config's data property or any provided variation data." /* $COMMENT#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATA */,
    variationOrConfigData:
      "Any provided variation data or the config's data property." /* $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATA */,
    configDataA:
      "(Values are typed `unknown` given the limitations in typing recursive values in JSDoc.)" /* $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAA */,
    configDataC:
      "(Config data at this time is still `unknown`.)" /* $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAC */,
    configDataD:
      "(Config data at this time may still be `unknown`.)" /* $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAD */,
    variationDataC:
      "(Variation data at this time is still `unknown`.)" /* $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONDATAC */,
    variationDataD:
      "(Variation data at this time may still be `unknown`.)" /* $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONDATAD */,
    configOrVariationDataC:
      "(Config or variation data at this time is still `unknown`.)" /* $COMMENT#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATAC */,
    configOrVariationDataD:
      "(Config or variation data at this time may still be `unknown`.)" /* $COMMENT#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATAD */,
    variationOrConfigDataC:
      "(Variation – or config – data at this time is still `unknown`.)" /* $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATAC */,
    variationOrConfigDataD:
      "(Variation – or config – data at this time may still be `unknown`.)" /* $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATAD */,
    __configData:
      "(Config data" /* $COMMENT#FORCOMPOSEDVARIABLES#__CONFIGDATA */,
    __variationData:
      "(Variation data" /* $COMMENT#FORCOMPOSEDVARIABLES#__VARIATIONDATA */,
    __configOrVariationData:
      "(Config or variation data" /* $COMMENT#FORCOMPOSEDVARIABLES#__CONFIGORVARIATIONDATA */,
    __variationOrConfigData:
      "(Variation or config data" /* $COMMENT#FORCOMPOSEDVARIABLES#__VARIATIONORCONFIGDATA */,
    atThisTime: "at this time" /* $COMMENT#FORCOMPOSEDVARIABLES#ATTHISTIME */,
    isStillUnknown__:
      "is still `unknown`.)" /* $COMMENT#FORCOMPOSEDVARIABLES#ISSTILLUNKNOWN__ */,
    mayStillUnknown__:
      "may still be `unknown`.)" /* $COMMENT#FORCOMPOSEDVARIABLES#MAYSTILLUNKNOWN__ */,
  }),
};

const ignores = [];

const composedVariablesExclusives = [
  "FORCOMPOSEDVARIABLES#PLUGINNAME",
  "FORCOMPOSEDVARIABLES#RULENAME",
  "FORCOMPOSEDVARIABLES#MAKESTHE",
  "FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED",
  "FORCOMPOSEDVARIABLES#PATHPERIOD",
  "FORCOMPOSEDVARIABLES#JSONCAPS",
  "FORCOMPOSEDVARIABLES#MJSCAPS",
  "FORCOMPOSEDVARIABLES#CONFIGDATA",
  "FORCOMPOSEDVARIABLES#CONFIGDATAA",
  "FORCOMPOSEDVARIABLES#CONFIGDATAC",
  "FORCOMPOSEDVARIABLES#_THE",
  "FORCOMPOSEDVARIABLES#WHERETHE",
  "FORCOMPOSEDVARIABLES#EXPECTED",
  "FORCOMPOSEDVARIABLES#ATTHISTIME",
];

const config = {
  data,
  ignores,
  composedVariablesExclusives,
};

export default config;
