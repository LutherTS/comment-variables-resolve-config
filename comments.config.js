const data = {
  jsDoc: Object.freeze({
    definitions: Object.freeze({
      escapeRegex:
        'Escapes all regex characters with a `"\\"` in a string to prepare it for use in a regex.', // $COMMENT#JSDOC#DEFINITIONS#ESCAPEREGEX
      makePlaceholderRegex:
        "Makes a global regex for a `$COMMENT#*` placeholder.", // $COMMENT#JSDOC#DEFINITIONS#MAKEPLACEHOLDERREGEX
      flattenConfigData:
        "Flattens the config's data property into a one-dimensional object of $COMMENT-*-like keys and string values.", // $COMMENT#JSDOC#DEFINITIONS#FLATTENCONFIGDATA
      resolveConfig:
        "Verifies, validates and resolves the config path to retrieve the config's data and ignores.", // $COMMENT#JSDOC#DEFINITIONS#RESOLVECONFIG
    }),
    params: Object.freeze({
      string: "The string.", // $COMMENT#JSDOC#PARAMS#STRING
      placeholder:
        "The `$COMMENT#*` placeholder that the regex is designed to find.", // $COMMENT#JSDOC#PARAMS#PLACEHOLDER
      configData:
        "The config's data property. (Values are typed `unknown` given the limitations in typing recursive values in JSDoc.)", // $COMMENT#JSDOC#PARAMS#CONFIGDATA
      configDataMapOption:
        "The map housing the flattened keys with their values and sources through recursion, instantiated as a `new Map()`.", // $COMMENT#JSDOC#PARAMS#CONFIGDATAMAPOPTION
      parentKeysOption:
        "The list of keys that are parent to the key at hand given the recursive nature of the config's data's data structure, instantiated as an empty array of strings (`[]`).", // $COMMENT#JSDOC#PARAMS#PARENTKEYSOPTION
      configPath:
        'The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code extension.', // $COMMENT#JSDOC#PARAMS#CONFIGPATH
      options: "The additional options as follows:", // $COMMENT#JSDOC#PARAMS#OPTIONS
      settings: "The required settings as follows:", // $COMMENT#JSDOC#PARAMS#SETTINGS
    }),
    returns: Object.freeze({
      escapeRegex: "The string with regex characters escaped.", // $COMMENT#JSDOC#RETURNS#ESCAPEREGEX
      makePlaceholderRegex:
        "The regex complete with positive lookbehind and positive lookahead to ensure the placeholder is taken into account only when surrounded by whitespace.", // $COMMENT#JSDOC#RETURNS#MAKEPLACEHOLDERREGEX
      flattenConfigData:
        "Both the flattened config data and its reversed version to ensure the strict reversibility of the `resolve` and `compress` commands in a success object (`success: true`). Errors are bubbled up during failures so they can be reused differently on the CLI and the VS Code extension in a failure object (`success: false`).", // $COMMENT#JSDOC#RETURNS#FLATTENCONFIGDATA
      resolveConfig:
        "The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, and the original config. Errors are returned during failures so they can be reused differently on the CLI and the VS Code extension.", // $COMMENT#JSDOC#RETURNS#RESOLVECONFIG
    }),
  }),
};

const ignores = [];

const config = {
  data,
  ignores,
};

export default config;
