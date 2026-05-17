/* data */

export const enData = Object.freeze({
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      escapeRegex:
        'Escapes all regex characters with a `"\\"` in a string to prepare it for use in a regex.' /* variations: $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX / core: $COMMENT#EN#JSDOC#DEFINITIONS#ESCAPEREGEX */,
      makeIsolatedStringRegex:
        "Makes a global regex for a given string that ensures it is surrounded by whitespace." /* variations: $COMMENT#JSDOC#DEFINITIONS#MAKEISOLATEDSTRINGREGEX / core: $COMMENT#EN#JSDOC#DEFINITIONS#MAKEISOLATEDSTRINGREGEX */,
      flattenConfigData:
        "Flattens the config's data property into a one-dimensional object of `COMMENT#COMMENT`-like keys and string values. (This function is now also used to flatten variation data.)" /* variations: $COMMENT#JSDOC#DEFINITIONS#FLATTENCONFIGDATA / core: $COMMENT#EN#JSDOC#DEFINITIONS#FLATTENCONFIGDATA */,
      resolveConfig:
        "Verifies, validates and resolves the config path to retrieve the config's data, ignores, and more." /* variations: $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIG / core: $COMMENT#EN#JSDOC#DEFINITIONS#RESOLVECONFIG */,
      makeSuccessFalseTypeError:
        'Makes a `{success: false}` object with a single error in its errors array of `{type: "error"}` based on the message it is meant to display.' /* variations: $COMMENT#JSDOC#DEFINITIONS#MAKESUCCESSFALSETYPEERROR / core: $COMMENT#EN#JSDOC#DEFINITIONS#MAKESUCCESSFALSETYPEERROR */,
      extractValueLocationsFromLintMessages:
        "Extracts and format the output JSON from an ESLint rule's `context.report` to turn it into Value Locations." /* variations: $COMMENT#JSDOC#DEFINITIONS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES / core: $COMMENT#EN#JSDOC#DEFINITIONS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES */,
      reverseFlattenedConfigData:
        "Reverses the keys and the values of a flattened config data object." /* variations: $COMMENT#JSDOC#DEFINITIONS#REVERSEFLATTENEDCONFIGDATA / core: $COMMENT#EN#JSDOC#DEFINITIONS#REVERSEFLATTENEDCONFIGDATA */,
      resolveComposedVariable:
        "Resolves a composed variable, as in a string made of several comment variables, to the actual Comment Variable it is meant to represent." /* variations: $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMPOSEDVARIABLE / core: $COMMENT#EN#JSDOC#DEFINITIONS#RESOLVECOMPOSEDVARIABLE */,
      resolveConfigDataStringValue:
        "Resolves a string value from Comment Variables config data taking into account the possibility that it is first an alias variable, second (and on the alias route) a composed variable, third (also on the alias route) a comment variable." /* variations: $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIGDATASTRINGVALUE / core: $COMMENT#EN#JSDOC#DEFINITIONS#RESOLVECONFIGDATASTRINGVALUE */,
      resolveConfigData:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#RECURSIVELYRESOLVESTO $COMMENT#EN#FORCOMPOSEDVARIABLES#OBJECTCONFIGDATA" /* variations: $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIGDATA / core: $COMMENT#EN#JSDOC#DEFINITIONS#RESOLVECONFIGDATA */,
      makeResolvedConfigData:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#CREATESTHAT $COMMENT#EN#FORCOMPOSEDVARIABLES#TRANSFORMEDOBJECTCONFIGDATA" /* variations: $COMMENT#JSDOC#DEFINITIONS#MAKERESOLVEDCONFIGDATA / core: $COMMENT#EN#JSDOC#DEFINITIONS#MAKERESOLVEDCONFIGDATA */,
      freshImport:
        "Guarantees a fresh import of the config, negating the innate (and hidden) cache of the dynamic `import` utility." /* variations: $COMMENT#JSDOC#DEFINITIONS#FRESHIMPORT / core: $COMMENT#EN#JSDOC#DEFINITIONS#FRESHIMPORT */,
      transformResolvedConfigData:
        "Transforms resolved config data with keys alongside values." /* variations: $COMMENT#JSDOC#DEFINITIONS#TRANSFORMRESOLVEDCONFIGDATA / core: $COMMENT#EN#JSDOC#DEFINITIONS#TRANSFORMRESOLVEDCONFIGDATA */,
      normalize:
        "Normalizes a Comment Variables key part." /* variations: $COMMENT#JSDOC#DEFINITIONS#NORMALIZE / core: $COMMENT#EN#JSDOC#DEFINITIONS#NORMALIZE */,
      makeNormalizedKey:
        "Normalizes and makes a Comment Variable key from the list of keys that trace to its value." /* variations: $COMMENT#JSDOC#DEFINITIONS#MAKENORMALIZEDKEY / core: $COMMENT#EN#JSDOC#DEFINITIONS#MAKENORMALIZEDKEY */,
      makeJsonData:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#EN#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#EN#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD" /* variations: $COMMENT#JSDOC#DEFINITIONS#MAKEJSONDATA / core: $COMMENT#EN#JSDOC#DEFINITIONS#MAKEJSONDATA */,
      makeMjsData:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#EN#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#EN#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD" /* variations: $COMMENT#JSDOC#DEFINITIONS#MAKEMJSDATA / core: $COMMENT#EN#JSDOC#DEFINITIONS#MAKEMJSDATA */,
      makeJsonPathLog:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#EN#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#EN#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD" /* variations: $COMMENT#JSDOC#DEFINITIONS#MAKEJSONPATHLOG / core: $COMMENT#EN#JSDOC#DEFINITIONS#MAKEJSONPATHLOG */,
      makeMjsPathLog:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#MAKESTHE $COMMENT#EN#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#EN#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD" /* variations: $COMMENT#JSDOC#DEFINITIONS#MAKEMJSPATHLOG / core: $COMMENT#EN#JSDOC#DEFINITIONS#MAKEMJSPATHLOG */,
      makeOriginalFlattenedConfigData:
        "Makes the original flattened config or variation data for a given config or variation provided." /* variations: $COMMENT#JSDOC#DEFINITIONS#MAKEORIGINALFLATTENEDCONFIGDATA / core: $COMMENT#EN#JSDOC#DEFINITIONS#MAKEORIGINALFLATTENEDCONFIGDATA */,
      getComposedVariablesExclusivesFreeKeys:
        "Gets all Comment Variables keys from the data of a given variation (or config) that aren't marked to be exclusively used for composed variables." /* variations: $COMMENT#JSDOC#DEFINITIONS#GETCOMPOSEDVARIABLESEXCLUSIVESFREEKEYS / core: $COMMENT#EN#JSDOC#DEFINITIONS#GETCOMPOSEDVARIABLESEXCLUSIVESFREEKEYS */,
      removeVariantPrefixFromVariationKey:
        "Removes the variant prefix of a Comment Variable key." /* variations: $COMMENT#JSDOC#DEFINITIONS#REMOVEVARIANTPREFIXFROMVARIATIONKEY / core: $COMMENT#EN#JSDOC#DEFINITIONS#REMOVEVARIANTPREFIXFROMVARIATIONKEY */,
      removeVariantPrefixFromVariationPlaceholder:
        "Removes the variant prefix of a Comment Variable placeholder." /* variations: $COMMENT#JSDOC#DEFINITIONS#REMOVEVARIANTPREFIXFROMVARIATIONPLACEHOLDER / core: $COMMENT#EN#JSDOC#DEFINITIONS#REMOVEVARIANTPREFIXFROMVARIATIONPLACEHOLDER */,
      surroundStringByOneSpace:
        'Surrounds a given string by one space right before and one space right after (`" "`).' /* variations: $COMMENT#JSDOC#DEFINITIONS#SURROUNDSTRINGBYONESPACE / core: $COMMENT#EN#JSDOC#DEFINITIONS#SURROUNDSTRINGBYONESPACE */,
      getArraySetDifference:
        "Computes the difference between two collections of strings efficiently." /* variations: $COMMENT#JSDOC#DEFINITIONS#GETARRAYSETDIFFERENCE / core: $COMMENT#EN#JSDOC#DEFINITIONS#GETARRAYSETDIFFERENCE */,
      resolveCoreData:
        "Resolves the config's data into information consumable by the Comment Variables ecosystem." /* variations: $COMMENT#JSDOC#DEFINITIONS#RESOLVECOREDATA / core: $COMMENT#EN#JSDOC#DEFINITIONS#RESOLVECOREDATA */,
      resolveVariationData:
        "Resolves any provided variation data into information consumable by the Comment Variables ecosystem. Along with some tailored wiring, it follows the path of `resolveCoreData` while ignoring all of its checks, since they have already been passed in `resolveCoreData`." /* variations: $COMMENT#JSDOC#DEFINITIONS#RESOLVEVARIATIONDATA / core: $COMMENT#EN#JSDOC#DEFINITIONS#RESOLVEVARIATIONDATA */,
    }),
    params: Object.freeze({
      stringA:
        "The string." /* variations: $COMMENT#JSDOC#PARAMS#STRINGA / core: $COMMENT#EN#JSDOC#PARAMS#STRINGA */,
      configDataA:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATA $COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGDATAA" /* variations: $COMMENT#JSDOC#PARAMS#CONFIGDATAA / core: $COMMENT#EN#JSDOC#PARAMS#CONFIGDATAA */,
      configDataC:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATA $COMMENT#EN#FORCOMPOSEDVARIABLES#__VARIATIONORCONFIGDATA $COMMENT#EN#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#EN#FORCOMPOSEDVARIABLES#ISSTILLUNKNOWN__" /* variations: $COMMENT#JSDOC#PARAMS#CONFIGDATAC / core: $COMMENT#EN#JSDOC#PARAMS#CONFIGDATAC */,
      configDataD:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGDATA $COMMENT#EN#FORCOMPOSEDVARIABLES#__CONFIGDATA $COMMENT#EN#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#EN#FORCOMPOSEDVARIABLES#MAYSTILLUNKNOWN__" /* variations: $COMMENT#JSDOC#PARAMS#CONFIGDATAD / core: $COMMENT#EN#JSDOC#PARAMS#CONFIGDATAD */,
      configDataE:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATA $COMMENT#EN#FORCOMPOSEDVARIABLES#__CONFIGORVARIATIONDATA $COMMENT#EN#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#EN#FORCOMPOSEDVARIABLES#ISSTILLUNKNOWN__" /* variations: $COMMENT#JSDOC#PARAMS#CONFIGDATAE / core: $COMMENT#EN#JSDOC#PARAMS#CONFIGDATAE */,
      configDataF:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#VARIATIONDATA $COMMENT#EN#FORCOMPOSEDVARIABLES#__VARIATIONDATA $COMMENT#EN#FORCOMPOSEDVARIABLES#ATTHISTIME $COMMENT#EN#FORCOMPOSEDVARIABLES#MAYSTILLUNKNOWN__" /* variations: $COMMENT#JSDOC#PARAMS#CONFIGDATAF / core: $COMMENT#EN#JSDOC#PARAMS#CONFIGDATAF */,
      configDataMapOption:
        "The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`." /* variations: $COMMENT#JSDOC#PARAMS#CONFIGDATAMAPOPTION / core: $COMMENT#EN#JSDOC#PARAMS#CONFIGDATAMAPOPTION */,
      parentKeysOption:
        "The list of keys that are parent to the key at hand given the recursive nature of the data's structure, instantiated as an empty array of strings (`[]`)." /* variations: $COMMENT#JSDOC#PARAMS#PARENTKEYSOPTION / core: $COMMENT#EN#JSDOC#PARAMS#PARENTKEYSOPTION */,
      configPathA:
        'The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": "my.config.js"` in `.vscode/settings.json` for the VS Code extension.' /* variations: $COMMENT#JSDOC#PARAMS#CONFIGPATHA / core: $COMMENT#EN#JSDOC#PARAMS#CONFIGPATHA */,
      message:
        "The human-readable message of the error." /* variations: $COMMENT#JSDOC#PARAMS#MESSAGE / core: $COMMENT#EN#JSDOC#PARAMS#MESSAGE */,
      lintMessages:
        "The array of LintMessages such as obtained from an `ESLint` or a `Linter` instance running." /* variations: $COMMENT#JSDOC#PARAMS#LINTMESSAGES / core: $COMMENT#EN#JSDOC#PARAMS#LINTMESSAGES */,
      pluginName:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#THENAMEOF $COMMENT#EN#FORCOMPOSEDVARIABLES#PLUGINNAME $COMMENT#EN#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD" /* variations: $COMMENT#JSDOC#PARAMS#PLUGINNAME / core: $COMMENT#EN#JSDOC#PARAMS#PLUGINNAME */,
      ruleName:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#THENAMEOF $COMMENT#EN#FORCOMPOSEDVARIABLES#RULENAME $COMMENT#EN#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD" /* variations: $COMMENT#JSDOC#PARAMS#RULENAME / core: $COMMENT#EN#JSDOC#PARAMS#RULENAME */,
      options:
        "The additional options as follows:" /* variations: $COMMENT#JSDOC#PARAMS#OPTIONS / core: $COMMENT#EN#JSDOC#PARAMS#OPTIONS */,
      settings:
        "The required settings as follows:" /* variations: $COMMENT#JSDOC#PARAMS#SETTINGS / core: $COMMENT#EN#JSDOC#PARAMS#SETTINGS */,
      flattenedConfigDataA:
        "The provided flattened config data to be reversed." /* variations: $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAA / core: $COMMENT#EN#JSDOC#PARAMS#FLATTENEDCONFIGDATAA */,
      composedVariable:
        "The composed variable as is." /* variations: $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLE / core: $COMMENT#EN#JSDOC#PARAMS#COMPOSEDVARIABLE */,
      flattenedConfigDataB:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#FLATTENEDCONFIGDATAB $COMMENT#EN#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG" /* variations: $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAB / core: $COMMENT#EN#JSDOC#PARAMS#FLATTENEDCONFIGDATAB */,
      stringValue:
        "The encountered string value to be resolved." /* variations: $COMMENT#JSDOC#PARAMS#STRINGVALUE / core: $COMMENT#EN#JSDOC#PARAMS#STRINGVALUE */,
      aliases_flattenedKeys:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#ALIASES_FLATTENEDKEYS $COMMENT#EN#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG" /* variations: $COMMENT#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS / core: $COMMENT#EN#JSDOC#PARAMS#ALIASES_FLATTENEDKEYS */,
      configDataB:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGDATAB $COMMENT#EN#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG" /* variations: $COMMENT#JSDOC#PARAMS#CONFIGDATAB / core: $COMMENT#EN#JSDOC#PARAMS#CONFIGDATAB */,
      callback:
        "The function that runs on every time a string value is encountered, set to `resolveConfigDataStringValue` by default." /* variations: $COMMENT#JSDOC#PARAMS#CALLBACK / core: $COMMENT#EN#JSDOC#PARAMS#CALLBACK */,
      resolveConfigResultsSuccessTrue:
        "The successful results of a `resolveConfig` operation, already vetted and ready to be transformed." /* variations: $COMMENT#JSDOC#PARAMS#RESOLVECONFIGRESULTSSUCCESSTRUE / core: $COMMENT#EN#JSDOC#PARAMS#RESOLVECONFIGRESULTSSUCCESSTRUE */,
      moduleUrl:
        "The absolute path of the module to import." /* variations: $COMMENT#JSDOC#PARAMS#MODULEURL / core: $COMMENT#EN#JSDOC#PARAMS#MODULEURL */,
      resolvedConfigDataA:
        "The resolved config data." /* variations: $COMMENT#JSDOC#PARAMS#RESOLVEDCONFIGDATAA / core: $COMMENT#EN#JSDOC#PARAMS#RESOLVEDCONFIGDATAA */,
      parentKeys:
        "EN#JSDOC#PARAMS#PARENTKEYSOPTION" /* variations: $COMMENT#JSDOC#PARAMS#PARENTKEYS / core: $COMMENT#EN#JSDOC#PARAMS#PARENTKEYS */,
      stringB:
        "The key part to be normalized, notably for variants." /* variations: $COMMENT#JSDOC#PARAMS#STRINGB / core: $COMMENT#EN#JSDOC#PARAMS#STRINGB */,
      keys: "The list of keys at hand in order of traversal." /* variations: $COMMENT#JSDOC#PARAMS#KEYS / core: $COMMENT#EN#JSDOC#PARAMS#KEYS */,
      resolvedConfigDataB:
        "The resolved config data as obtained from `makeResolvedConfigData`." /* variations: $COMMENT#JSDOC#PARAMS#RESOLVEDCONFIGDATAB / core: $COMMENT#EN#JSDOC#PARAMS#RESOLVEDCONFIGDATAB */,
      jsonPath:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#_THE $COMMENT#EN#FORCOMPOSEDVARIABLES#EXPECTED $COMMENT#EN#FORCOMPOSEDVARIABLES#DOTJSONPATH $COMMENT#EN#FORCOMPOSEDVARIABLES#WHERETHE $COMMENT#EN#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN" /* variations: $COMMENT#JSDOC#PARAMS#JSONPATH / core: $COMMENT#EN#JSDOC#PARAMS#JSONPATH */,
      mjsPath:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#_THE $COMMENT#EN#FORCOMPOSEDVARIABLES#EXPECTED $COMMENT#EN#FORCOMPOSEDVARIABLES#DOTMJSPATH $COMMENT#EN#FORCOMPOSEDVARIABLES#WHERETHE $COMMENT#EN#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN" /* variations: $COMMENT#JSDOC#PARAMS#MJSPATH / core: $COMMENT#EN#JSDOC#PARAMS#MJSPATH */,
      composedVariablesExclusivesA:
        "The top-level list of all Comment Variables keys that are composed variables exclusives. (It is critical to list all variables only used to make composed variables in this array across all variations, so that they are ignored when comparing variations data keys to be one-to-one equivalents to canonical fallback data keys.)" /* variations: $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVESA / core: $COMMENT#EN#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVESA */,
      isVariationData:
        "A boolean that, when `false` or `undefined`, decides to crop out the initial variant parts of composed variables exclusives keys when addressing variation data. (Originally known as `isVariationData`, the argument remains since its logic is already implemented, even though a use case for core data as yet to be found.)" /* variations: $COMMENT#JSDOC#PARAMS#ISVARIATIONDATA / core: $COMMENT#EN#JSDOC#PARAMS#ISVARIATIONDATA */,
      variationKey:
        "The variation key that needs its variant prefix removed (such as going from `EN#COMMENT` to `COMMENT`)." /* variations: $COMMENT#JSDOC#PARAMS#VARIATIONKEY / core: $COMMENT#EN#JSDOC#PARAMS#VARIATIONKEY */,
      variationPlaceholder:
        "The variation placeholder that needs its variant prefix removed." /* variations: $COMMENT#JSDOC#PARAMS#VARIATIONPLACEHOLDER / core: $COMMENT#EN#JSDOC#PARAMS#VARIATIONPLACEHOLDER */,
      stringC:
        "The given string to be surrounded." /* variations: $COMMENT#JSDOC#PARAMS#STRINGC / core: $COMMENT#EN#JSDOC#PARAMS#STRINGC */,
      sourceA:
        "The source collection (uses `.array`)." /* variations: $COMMENT#JSDOC#PARAMS#SOURCEA / core: $COMMENT#EN#JSDOC#PARAMS#SOURCEA */,
      exclusionB:
        "The exclusion collection (uses `.set`)." /* variations: $COMMENT#JSDOC#PARAMS#EXCLUSIONB / core: $COMMENT#EN#JSDOC#PARAMS#EXCLUSIONB */,
      extracts:
        "The array that holds all the object string values related to the config, since those are to be exclusively used with the config's data. Includes their file paths and `SourceLocation` objects alongside their values." /* variations: $COMMENT#JSDOC#PARAMS#EXTRACTS / core: $COMMENT#EN#JSDOC#PARAMS#EXTRACTS */,
      composedVariablesExclusivesB:
        "The list of composed variable exclusives, which are Comment Variables keys, in order to ascertain their checks within `resolveCoreData`." /* variations: $COMMENT#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVESB / core: $COMMENT#EN#JSDOC#PARAMS#COMPOSEDVARIABLESEXCLUSIVESB */,
      core__originalFlattenedConfigData:
        "The `originalFlattenedConfigData` obtained from the previous `resolveCoreData` run, used to correctly branch the aliases from the core config data." /* variations: $COMMENT#JSDOC#PARAMS#CORE__ORIGINALFLATTENEDCONFIGDATA / core: $COMMENT#EN#JSDOC#PARAMS#CORE__ORIGINALFLATTENEDCONFIGDATA */,
      core__aliases_flattenedKeys:
        "The `originalFlattenedConfigData` obtained from the previous `aliases_flattenedKeys` run, used to correctly resolve the composed variables segments aliases from the core config data." /* variations: $COMMENT#JSDOC#PARAMS#CORE__ALIASES_FLATTENEDKEYS / core: $COMMENT#EN#JSDOC#PARAMS#CORE__ALIASES_FLATTENEDKEYS */,
      core__flattenedConfigData:
        "The `flattenedConfigData` obtained from the previous `resolveCoreData` run, used to correctly resolve the composed variables segments from the core config data." /* variations: $COMMENT#JSDOC#PARAMS#CORE__FLATTENEDCONFIGDATA / core: $COMMENT#EN#JSDOC#PARAMS#CORE__FLATTENEDCONFIGDATA */,
      reference__flattenedConfigData:
        "The flattenedConfigData obtained from the previous resolveVariationData run, used when `allowIncompleteVariations` is set to `true` so that missing variation data can fallback to the reference data." /* variations: $COMMENT#JSDOC#PARAMS#REFERENCE__FLATTENEDCONFIGDATA / core: $COMMENT#EN#JSDOC#PARAMS#REFERENCE__FLATTENEDCONFIGDATA */,
    }),
    returns: Object.freeze({
      escapeRegex:
        "The string with regex characters escaped." /* variations: $COMMENT#JSDOC#RETURNS#ESCAPEREGEX / core: $COMMENT#EN#JSDOC#RETURNS#ESCAPEREGEX */,
      makeIsolatedStringRegex:
        "The regex complete with positive lookbehind and positive lookahead to ensure the string is taken into account only when surrounded by whitespace." /* variations: $COMMENT#JSDOC#RETURNS#MAKEISOLATEDSTRINGREGEX / core: $COMMENT#EN#JSDOC#RETURNS#MAKEISOLATEDSTRINGREGEX */,
      flattenConfigData:
        "The flattened config or variation data in a success object (`success: true`). (The strict reversibility of the `resolve` and `compress` commands is handled afterwards.) Errors are bubbled up during failures so they can be reused differently on the CLI and the VS Code extension in a failure object (`success: false`)." /* variations: $COMMENT#JSDOC#RETURNS#FLATTENCONFIGDATA / core: $COMMENT#EN#JSDOC#RETURNS#FLATTENCONFIGDATA */,
      resolveConfig:
        "The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, the original config, and more. Errors are returned during failures so they can be reused differently on the CLI and the VS Code extension." /* variations: $COMMENT#JSDOC#RETURNS#RESOLVECONFIG / core: $COMMENT#EN#JSDOC#RETURNS#RESOLVECONFIG */,
      makeSuccessFalseTypeError:
        'A `{success: false}` object with a single error in its error array of `{type: "error"}`.' /* variations: $COMMENT#JSDOC#RETURNS#MAKESUCCESSFALSETYPEERROR / core: $COMMENT#EN#JSDOC#RETURNS#MAKESUCCESSFALSETYPEERROR */,
      extractValueLocationsFromLintMessages:
        "An array of Value Locations with the value, the file path and the SourceLocation (LOC) included for each." /* variations: $COMMENT#JSDOC#RETURNS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES / core: $COMMENT#EN#JSDOC#RETURNS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES */,
      reverseFlattenedConfigData:
        "The reversed version of the provided config data." /* variations: $COMMENT#JSDOC#RETURNS#REVERSEFLATTENEDCONFIGDATA / core: $COMMENT#EN#JSDOC#RETURNS#REVERSEFLATTENEDCONFIGDATA */,
      resolveComposedVariable:
        "The resolved composed variable as a single natural string." /* variations: $COMMENT#JSDOC#RETURNS#RESOLVECOMPOSEDVARIABLE / core: $COMMENT#EN#JSDOC#RETURNS#RESOLVECOMPOSEDVARIABLE */,
      resolveConfigDataStringValue:
        "The string value resolved as the relevant Comment Variable that it is." /* variations: $COMMENT#JSDOC#RETURNS#RESOLVECONFIGDATASTRINGVALUE / core: $COMMENT#EN#JSDOC#RETURNS#RESOLVECONFIGDATASTRINGVALUE */,
      resolveConfigData:
        "Just the resolved config data if successful, or an object with `success: false` and errors if unsuccessful." /* variations: $COMMENT#JSDOC#RETURNS#RESOLVECONFIGDATA / core: $COMMENT#EN#JSDOC#RETURNS#RESOLVECONFIGDATA */,
      makeResolvedConfigData:
        "An object with `success: true` and the resolved config data if successful, or with `success: false` and errors if unsuccessful." /* variations: $COMMENT#JSDOC#RETURNS#MAKERESOLVEDCONFIGDATA / core: $COMMENT#EN#JSDOC#RETURNS#MAKERESOLVEDCONFIGDATA */,
      freshImport:
        "Either an object with its `default` property sets to the default export of the module successfully loaded or `null` when an error arises. (Debugging is currently manual by looking at the error being caught in the child process.)" /* variations: $COMMENT#JSDOC#RETURNS#FRESHIMPORT / core: $COMMENT#EN#JSDOC#RETURNS#FRESHIMPORT */,
      transformResolvedConfigData:
        "The transformed resolved config data with keys and placeholders readily accessible alongside values." /* variations: $COMMENT#JSDOC#RETURNS#TRANSFORMRESOLVEDCONFIGDATA / core: $COMMENT#EN#JSDOC#RETURNS#TRANSFORMRESOLVEDCONFIGDATA */,
      normalize:
        "The normalized key part under a common algorith for the entire library." /* variations: $COMMENT#JSDOC#RETURNS#NORMALIZE / core: $COMMENT#EN#JSDOC#RETURNS#NORMALIZE */,
      makeNormalizedKey:
        "The normalized key of a Comment Variable." /* variations: $COMMENT#JSDOC#RETURNS#MAKENORMALIZEDKEY / core: $COMMENT#EN#JSDOC#RETURNS#MAKENORMALIZEDKEY */,
      makeJsonData:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#_THE $COMMENT#EN#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#EN#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD $COMMENT#EN#FORCOMPOSEDVARIABLES#MAKEJSONDATARETURNS" /* variations: $COMMENT#JSDOC#RETURNS#MAKEJSONDATA / core: $COMMENT#EN#JSDOC#RETURNS#MAKEJSONDATA */,
      makeMjsData:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#_THE $COMMENT#EN#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED $COMMENT#EN#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD $COMMENT#EN#FORCOMPOSEDVARIABLES#MAKEMJSDATARETURNS" /* variations: $COMMENT#JSDOC#RETURNS#MAKEMJSDATA / core: $COMMENT#EN#JSDOC#RETURNS#MAKEMJSDATA */,
      makeJsonPathLog:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#_THE $COMMENT#EN#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#EN#FORCOMPOSEDVARIABLES#JSONCAPS $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED" /* variations: $COMMENT#JSDOC#RETURNS#MAKEJSONPATHLOG / core: $COMMENT#EN#JSDOC#RETURNS#MAKEJSONPATHLOG */,
      makeMjsPathLog:
        "$COMMENT#EN#FORCOMPOSEDVARIABLES#_THE $COMMENT#EN#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE $COMMENT#EN#FORCOMPOSEDVARIABLES#MJSCAPS $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED" /* variations: $COMMENT#JSDOC#RETURNS#MAKEMJSPATHLOG / core: $COMMENT#EN#JSDOC#RETURNS#MAKEMJSPATHLOG */,
      makeOriginalFlattenedConfigData:
        "The original flattened config or variation data at the key `originalFlattenedConfigData` along with the verified original config or variation data at the key `configDataResultsData`." /* variations: $COMMENT#JSDOC#RETURNS#MAKEORIGINALFLATTENEDCONFIGDATA / core: $COMMENT#EN#JSDOC#RETURNS#MAKEORIGINALFLATTENEDCONFIGDATA */,
      getComposedVariablesExclusivesFreeKeys:
        "All Comment Variables keys from the data of a given variation (or config) that aren't marked to be exclusively used for composed variables. This is to later ensure that all variations share the exact same utilized keys for perfect versatility." /* variations: $COMMENT#JSDOC#RETURNS#GETCOMPOSEDVARIABLESEXCLUSIVESFREEKEYS / core: $COMMENT#EN#JSDOC#RETURNS#GETCOMPOSEDVARIABLESEXCLUSIVESFREEKEYS */,
      removeVariantPrefixFromVariationKey:
        "The variation key with its variant prefix removed, akin to a Comment Variable key when `variations` are not in use." /* variations: $COMMENT#JSDOC#RETURNS#REMOVEVARIANTPREFIXFROMVARIATIONKEY / core: $COMMENT#EN#JSDOC#RETURNS#REMOVEVARIANTPREFIXFROMVARIATIONKEY */,
      removeVariantPrefixFromVariationPlaceholder:
        "The variation placeholder with its variant prefix removed, akin to a Comment Variable placeholder when `variations` are not in use." /* variations: $COMMENT#JSDOC#RETURNS#REMOVEVARIANTPREFIXFROMVARIATIONPLACEHOLDER / core: $COMMENT#EN#JSDOC#RETURNS#REMOVEVARIANTPREFIXFROMVARIATIONPLACEHOLDER */,
      surroundStringByOneSpace:
        "The given string surrounded by one space." /* variations: $COMMENT#JSDOC#RETURNS#SURROUNDSTRINGBYONESPACE / core: $COMMENT#EN#JSDOC#RETURNS#SURROUNDSTRINGBYONESPACE */,
      getArraySetDifference:
        "A new `Set` containing all elements in `a` that are not in `b`." /* variations: $COMMENT#JSDOC#RETURNS#GETARRAYSETDIFFERENCE / core: $COMMENT#EN#JSDOC#RETURNS#GETARRAYSETDIFFERENCE */,
      resolveCoreData:
        "With a `{success: true}` object, all the information to be consumed by the Comment Variables CLI and the Comment Variables VS Code extension, namingly `originalFlattenedConfigData`, `aliases_flattenedKeys`, `flattenedConfigData`, `reversedFlattenedConfigData`, `keys_valueLocations`, `nonAliasesKeys_valueLocations`, `aliasesKeys_valueLocations`, `configDataResultsData`, and probably more as the function evolves." /* variations: $COMMENT#JSDOC#RETURNS#RESOLVECOREDATA / core: $COMMENT#EN#JSDOC#RETURNS#RESOLVECOREDATA */,
      resolveVariationData:
        "With a `{success: true}` object, the given variation's own information to be consumed by the Comment Variables CLI and the Comment Variables VS Code extension, namingly its own `originalFlattenedConfigData`, its own `aliases_flattenedKeys`, its own `flattenedConfigData`, its own `reversedFlattenedConfigData`, and accessorily its own `configDataResultsData`." /* variations: $COMMENT#JSDOC#RETURNS#RESOLVEVARIATIONDATA / core: $COMMENT#EN#JSDOC#RETURNS#RESOLVEVARIATIONDATA */,
    }),
    constants: Object.freeze({
      configKeyRegex:
        "Ensures keys should only include lowercase letters (`Ll`), uppercase letters (`Lu`), other letters (`Lo`), dash punctuation (`Pd`), connector punctuation (`Pc`), numbers (`N`) and whitespaces (`s`)." /* variations: $COMMENT#JSDOC#CONSTANTS#CONFIGKEYREGEX / core: $COMMENT#EN#JSDOC#CONSTANTS#CONFIGKEYREGEX */,
      flattenedConfigKeyRegex:
        "Same as `configKeyRegex` but without lowercase letters (`\\p{Ll}`), wthout dash punctuation (`Pd`), connector punctuation (`Pc`), whitespaces (`\\s`), which all three are replaced by underscores (`_`), and with the '`#`' character (that links each subkey together)." /* variations: $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGKEYREGEX / core: $COMMENT#EN#JSDOC#CONSTANTS#FLATTENEDCONFIGKEYREGEX */,
      flattenedConfigPlaceholderLocalRegex:
        "Same as `flattenedConfigKeyRegex` but taking the prefix `$COMMENT` and its `#` into consideration, preventing two consecutive `#`'s, removing `^` and `$` in the capture group, and using `_` as replacement for whitespaces." /* variations: $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGPLACEHOLDERLOCALREGEX / core: $COMMENT#EN#JSDOC#CONSTANTS#FLATTENEDCONFIGPLACEHOLDERLOCALREGEX */,
      flattenedConfigPlaceholderGlobalRegex:
        "Same as `flattenedConfigPlaceholderLocalRegex` but globally." /* variations: $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGPLACEHOLDERGLOBALREGEX / core: $COMMENT#EN#JSDOC#CONSTANTS#FLATTENEDCONFIGPLACEHOLDERGLOBALREGEX */,
      extractRuleConfigData:
        'The core data needed to run the "extract" rule, fully-named `"extract-object-string-literal-values"`. (The name of the object could eventually be changed for being too function-sounding, since it could be confused for "a function that extract rule config data" instead of what it is, "the data of the extract rule config".)' /* variations: $COMMENT#JSDOC#CONSTANTS#EXTRACTRULECONFIGDATA / core: $COMMENT#EN#JSDOC#CONSTANTS#EXTRACTRULECONFIGDATA */,
    }),
  }),
  forComposedVariables: Object.freeze({
    pluginName:
      "plugin" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#PLUGINNAME / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#PLUGINNAME */,
    ruleName:
      "rule" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#RULENAME / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#RULENAME */,
    theNameOf:
      "The name of the" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#THENAMEOF */,
    forFilteringPeriod:
      "being used for filtering." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD */,
    flattenedConfigDataB:
      "The flattened config data" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#FLATTENEDCONFIGDATAB / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#FLATTENEDCONFIGDATAB */,
    aliases_flattenedKeys:
      "The aliases-to-flattened-keys dictionary" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#ALIASES_FLATTENEDKEYS / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#ALIASES_FLATTENEDKEYS */,
    configDataB:
      "The original config data" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAB / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGDATAB */,
    obtainedResolveConfig:
      "obtained from resolveConfig." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#OBTAINEDRESOLVECONFIG */,
    recursivelyResolvesTo:
      "Recursively resolves Comment Variables config data values (being strings or nested objects) to generate an" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#RECURSIVELYRESOLVESTO / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#RECURSIVELYRESOLVESTO */,
    createsThat:
      "Creates that" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#CREATESTHAT / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#CREATESTHAT */,
    objectConfigData:
      "object with the same keys and the same shape as the original config data now with all string values entirely resolved." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#OBJECTCONFIGDATA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#OBJECTCONFIGDATA */,
    transformedObjectConfigData:
      "object with the same keys and the same base shape as the original config data now with all string values entirely resolved alongside Comment Variables keys." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#TRANSFORMEDOBJECTCONFIGDATA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#TRANSFORMEDOBJECTCONFIGDATA */,
    makesThe:
      "Makes the" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#MAKESTHE / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#MAKESTHE */,
    resolvedAnExpected:
      "resolved config data to be written at an expected" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDANEXPECTED */,
    pathPeriod:
      " path." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#PATHPERIOD / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#PATHPERIOD */,
    jsonCaps:
      "JSON" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#JSONCAPS / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#JSONCAPS */,
    dotJsonPathPeriod:
      "`.json` path." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#DOTJSONPATHPERIOD */,
    mjsCaps:
      "MJS" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#MJSCAPS / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#MJSCAPS */,
    dotMjsPathPeriod:
      "`.mjs` path." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#DOTMJSPATHPERIOD */,
    logWritingOfThe:
      "log that announces the writing of the" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#LOGWRITINGOFTHE */,
    resolvedConfigDataPeriod:
      "resolved config data." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGDATAPERIOD */,
    _The: "The" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#_THE / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#_THE */,
    expected:
      "expected" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#EXPECTED / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#EXPECTED */,
    dotJsonPath:
      "`.json` path" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#DOTJSONPATH / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#DOTJSONPATH */,
    dotMjsPath:
      "`.mjs` path" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#DOTMJSPATH / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#DOTMJSPATH */,
    whereThe:
      "where the" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#WHERETHE / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#WHERETHE */,
    resolvedToBeWritten:
      "resolved config data is to be written." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDTOBEWRITTEN */,
    makeJsonDataReturns:
      "It can be consumed by any language that can parse JSON, which means virtually all modern languages, so that Comment Variables can act as a single source of truth for text variables beyond JavaScript and TypeScript." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#MAKEJSONDATARETURNS / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#MAKEJSONDATARETURNS */,
    makeMjsDataReturns:
      "Its format makes it possible to be consumed with literal type safety in both JavaScript and TypeScript." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#MAKEMJSDATARETURNS / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#MAKEMJSDATARETURNS */,
    resolvedConfigCompleted:
      "resolved config data has been completed." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#RESOLVEDCONFIGCOMPLETED */,
    configData:
      "The config's data property." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGDATA */,
    variationData:
      "Any provided variation data." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONDATA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#VARIATIONDATA */,
    configOrVariationData:
      "The config's data property or any provided variation data." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATA */,
    variationOrConfigData:
      "Any provided variation data or the config's data property." /* variations: $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATA */,
    configDataA:
      "(Values are typed `unknown` given the limitations in typing recursive values in JSDoc.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGDATAA */,
    configDataC:
      "(Config data at this time is still `unknown`.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAC / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGDATAC */,
    configDataD:
      "(Config data at this time may still be `unknown`.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#CONFIGDATAD / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGDATAD */,
    variationDataC:
      "(Variation data at this time is still `unknown`.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONDATAC / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#VARIATIONDATAC */,
    variationDataD:
      "(Variation data at this time may still be `unknown`.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONDATAD / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#VARIATIONDATAD */,
    configOrVariationDataC:
      "(Config or variation data at this time is still `unknown`.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATAC / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATAC */,
    configOrVariationDataD:
      "(Config or variation data at this time may still be `unknown`.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATAD / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#CONFIGORVARIATIONDATAD */,
    variationOrConfigDataC:
      "(Variation – or config – data at this time is still `unknown`.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATAC / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATAC */,
    variationOrConfigDataD:
      "(Variation – or config – data at this time may still be `unknown`.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATAD / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#VARIATIONORCONFIGDATAD */,
    __configData:
      "(Config data" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#__CONFIGDATA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#__CONFIGDATA */,
    __variationData:
      "(Variation data" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#__VARIATIONDATA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#__VARIATIONDATA */,
    __configOrVariationData:
      "(Config or variation data" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#__CONFIGORVARIATIONDATA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#__CONFIGORVARIATIONDATA */,
    __variationOrConfigData:
      "(Variation or config data" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#__VARIATIONORCONFIGDATA / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#__VARIATIONORCONFIGDATA */,
    atThisTime:
      "at this time" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#ATTHISTIME / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#ATTHISTIME */,
    isStillUnknown__:
      "is still `unknown`.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#ISSTILLUNKNOWN__ / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#ISSTILLUNKNOWN__ */,
    mayStillUnknown__:
      "may still be `unknown`.)" /* variations: $COMMENT#FORCOMPOSEDVARIABLES#MAYSTILLUNKNOWN__ / core: $COMMENT#EN#FORCOMPOSEDVARIABLES#MAYSTILLUNKNOWN__ */,
  }),
});

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
