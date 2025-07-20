const data = {
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      escapeRegex:
        'Escapes all regex characters with a `"\\"` in a string to prepare it for use in a regex.' /* $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX */,
      makeIsolatedStringRegex:
        "Makes a global regex for a given string that ensures it is surrounded by whitespace." /* $COMMENT#JSDOC#DEFINITIONS#MAKEISOLATEDSTRINGREGEX */,
      flattenConfigData:
        "Flattens the config's data property into a one-dimensional object of $COMMENT-*-like keys and string values." /* $COMMENT#JSDOC#DEFINITIONS#FLATTENCONFIGDATA */,
      resolveConfig:
        "Verifies, validates and resolves the config path to retrieve the config's data and ignores." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIG */,
      makeSuccessFalseTypeError:
        'Makes a `{success: false}` object with a single error in its errors array of `{type: "error"}` based on the message it is meant to display.' /* $COMMENT#JSDOC#DEFINITIONS#MAKESUCCESSFALSETYPEERROR */,
      extractValueLocationsFromLintMessages:
        "Extracts and format the output JSON from an ESLint rule's `context.report` to turn it into Value Locations." /* $COMMENT#JSDOC#DEFINITIONS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES */,
      reverseConfigData:
        "Reverses the keys and the values of a flattened config data object." /* $COMMENT#JSDOC#DEFINITIONS#REVERSECONFIGDATA */,
      coreCommentsFlow:
        "The core flow at the heart of resolving and compressing comments." /* $COMMENT#JSDOC#DEFINITIONS#CORECOMMENTSFLOW */,
      resolveCommentsFlow:
        "The flow that resolves `$COMMENT` placeholders intro actual comments." /* $COMMENT#JSDOC#DEFINITIONS#RESOLVECOMMENTSFLOW */,
      compressCommentsFlow:
        "The flow that compresses actual comments into `$COMMENT` placeholders." /* $COMMENT#JSDOC#DEFINITIONS#COMPRESSCOMMENTSFLOW */,
    }),
    params: Object.freeze({
      string: "The string." /* $COMMENT#JSDOC#PARAMS#STRING */,
      configData:
        "The config's data property. (Values are typed `unknown` given the limitations in typing recursive values in JSDoc.)" /* $COMMENT#JSDOC#PARAMS#CONFIGDATA */,
      configDataMapOption:
        "The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`." /* $COMMENT#JSDOC#PARAMS#CONFIGDATAMAPOPTION */,
      parentKeysOption:
        "The list of keys that are parent to the key at hand given the recursive nature of the config's data's data structure, instantiated as an empty array of strings (`[]`)." /* $COMMENT#JSDOC#PARAMS#PARENTKEYSOPTION */,
      configPath:
        'The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code extension.' /* $COMMENT#JSDOC#PARAMS#CONFIGPATH */,
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
      configDataToReverse:
        "The provided flattened config data to be reversed." /* $COMMENT#JSDOC#PARAMS#CONFIGDATATOREVERSE */,
      ruleNameCurrentlyUsed:
        "$COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF $COMMENT#FORCOMPOSEDVARIABLES#RULENAME $COMMENT#FORCOMPOSEDVARIABLES#CURRENTLYUSED" /* $COMMENT#JSDOC#PARAMS#RULENAMECURRENTLYUSED */,
      ignores:
        "The array of paths and globs for the flow's ESLint instance to ignore." /* $COMMENT#JSDOC#PARAMS#IGNORES */,
      flattenedConfigDataEither:
        "Either the flattened config data or the reversed flattened config data, since they share the same structure." /* $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATAEITHER */,
      flattenedConfigData:
        "The flattened config data, with `$COMMENT` placeholders as keys and actual comments as values." /* $COMMENT#JSDOC#PARAMS#FLATTENEDCONFIGDATA */,
      reversedFlattenedConfigData:
        "The reversed flattened config data, with actual comments as keys and `$COMMENT` placeholders as values." /* $COMMENT#JSDOC#PARAMS#REVERSEDFLATTENEDCONFIGDATA */,
    }),
    returns: Object.freeze({
      escapeRegex:
        "The string with regex characters escaped." /* $COMMENT#JSDOC#RETURNS#ESCAPEREGEX */,
      makeIsolatedStringRegex:
        "The regex complete with positive lookbehind and positive lookahead to ensure the string is taken into account only when surrounded by whitespace." /* $COMMENT#JSDOC#RETURNS#MAKEISOLATEDSTRINGREGEX */,
      flattenConfigData:
        "Both the flattened config data and its reversed version to ensure the strict reversibility of the `resolve` and `compress` commands in a success object (`success: true`). Errors are bubbled up during failures so they can be reused differently on the CLI and the VS Code extension in a failure object (`success: false`)." /* $COMMENT#JSDOC#RETURNS#FLATTENCONFIGDATA */,
      resolveConfig:
        "The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, and the original config. Errors are returned during failures so they can be reused differently on the CLI and the VS Code extension." /* $COMMENT#JSDOC#RETURNS#RESOLVECONFIG */,
      makeSuccessFalseTypeError:
        'A `{success: false}` object with a single error in its error array of `{type: "error"}`.' /* $COMMENT#JSDOC#RETURNS#MAKESUCCESSFALSETYPEERROR */,
      extractValueLocationsFromLintMessages:
        "An array of Value Locations with the value, the file path and the SourceLocation (LOC) included for each." /* $COMMENT#JSDOC#RETURNS#EXTRACTVALUELOCATIONSFROMLINTMESSAGES */,
      reverseConfigData:
        "The reversed version of the provided config data." /* $COMMENT#JSDOC#RETURNS#REVERSECONFIGDATA */,
    }),
  }),
  forComposedVariables: Object.freeze({
    pluginName: "plugin" /* $COMMENT#FORCOMPOSEDVARIABLES#PLUGINNAME */,
    ruleName: "rule" /* $COMMENT#FORCOMPOSEDVARIABLES#RULENAME */,
    theNameOf: "The name of the" /* $COMMENT#FORCOMPOSEDVARIABLES#THENAMEOF */,
    forFilteringPeriod:
      "being used for filtering." /* $COMMENT#FORCOMPOSEDVARIABLES#FORFILTERINGPERIOD */,
    currentlyUsed:
      'currently used. (Either `"resolve"` or `"compress"`.)' /* $COMMENT#FORCOMPOSEDVARIABLES#CURRENTLYUSED */,
  }),
};

const ignores = [];

const config = {
  data,
  ignores,
};

export default config;
