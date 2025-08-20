const data = {
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      escapeRegex:
        'Escapes all regex characters with a `"\\"` in a string to prepare it for use in a regex.' /* $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX */,
      makeIsolatedStringRegex:
        "Makes a global regex for a given string that ensures it is surrounded by whitespace." /* $COMMENT#JSDOC#DEFINITIONS#MAKEISOLATEDSTRINGREGEX */,
      flattenConfigData:
        "Flattens the config's data property into a one-dimensional object of `$COMMENT`-like keys and string values." /* $COMMENT#JSDOC#DEFINITIONS#FLATTENCONFIGDATA */,
      resolveConfig:
        "Verifies, validates and resolves the config path to retrieve the config's data and ignores." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIG */,
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
        "Transforms resolved config data with keys and placeholders alongside values." /* $COMMENT#JSDOC#DEFINITIONS#TRANSFORMRESOLVEDCONFIGDATA */,
      makeNormalizedKey:
        "Normalizes and makes a Comment Variable key from the list of keys that trace to its value." /* $COMMENT#JSDOC#DEFINITIONS#MAKENORMALIZEDKEY */,
    }),
    params: Object.freeze({
      string: "The string." /* $COMMENT#JSDOC#PARAMS#STRING */,
      configData:
        "The config's data property. (Values are typed `unknown` given the limitations in typing recursive values in JSDoc.)" /* $COMMENT#JSDOC#PARAMS#CONFIGDATA */,
      configDataMapOption:
        "The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`." /* $COMMENT#JSDOC#PARAMS#CONFIGDATAMAPOPTION */,
      parentKeysOption:
        "The list of keys that are parent to the key at hand given the recursive nature of the config's data's data structure, instantiated as an empty array of strings (`[]`)." /* $COMMENT#JSDOC#PARAMS#PARENTKEYSOPTION */,
      configPathA:
        'The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code extension.' /* $COMMENT#JSDOC#PARAMS#CONFIGPATHA */ /* $COMMENT#JSDOC#PARAMS#CONFIGPATH */,
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
      resolvedConfigData:
        "The resolved config data." /* $COMMENT#JSDOC#PARAMS#RESOLVEDCONFIGDATA */,
      parentKeys:
        "JSDOC#PARAMS#PARENTKEYSOPTION" /* $COMMENT#JSDOC#PARAMS#PARENTKEYS */,
      keys: "The list of keys at hand in order of traversal." /* $COMMENT#JSDOC#PARAMS#KEYS */,
    }),
    returns: Object.freeze({
      escapeRegex:
        "The string with regex characters escaped." /* $COMMENT#JSDOC#RETURNS#ESCAPEREGEX */,
      makeIsolatedStringRegex:
        "The regex complete with positive lookbehind and positive lookahead to ensure the string is taken into account only when surrounded by whitespace." /* $COMMENT#JSDOC#RETURNS#MAKEISOLATEDSTRINGREGEX */,
      flattenConfigData:
        "The flattened config data in a success object (`success: true`). (The strict reversibility of the `resolve` and `compress` commands is handled afterwards.) Errors are bubbled up during failures so they can be reused differently on the CLI and the VS Code extension in a failure object (`success: false`)." /* $COMMENT#JSDOC#RETURNS#FLATTENCONFIGDATA */,
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
      makeNormalizedKey:
        "The normalized key of a Comment Variable." /* $COMMENT#JSDOC#RETURNS#MAKENORMALIZEDKEY */,
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
      "object with the same keys and the same base shape as the original config data now with all string values entirely resolved alongside Comment Variables keys and placeholders." /* $COMMENT#FORCOMPOSEDVARIABLES#TRANSFORMEDOBJECTCONFIGDATA */,
  }),
};

const ignores = [];

// NEW (worked!!)
const composedVariablesExclusives = [
  "FORCOMPOSEDVARIABLES#PLUGINNAME",
  "FORCOMPOSEDVARIABLES#RULENAME",
];

const config = {
  data,
  ignores,
  composedVariablesExclusives,
};

export default config;
