import tseslint from "typescript-eslint";

/**
 * @typedef {import("../../../types/_commons/typedefs.js").ForbiddenKeyNamesSet} ForbiddenKeyNamesSet
 */

// comments.config.js
export const defaultConfigFileName = "comments.config.js";

// tutorial file names
export const templateFileName = "comments.template.js";
export const exampleFileName = "comments.example.js";

// current working directory
export const cwd = process.cwd();

// flags
export const configFlag = "--config";

// placeholder prefix
export const $COMMENT = "$COMMENT";

// ESLint ignores
export const knownIgnores = [
  "node_modules",
  "dist",
  "out",
  ".next",
  ".react-router",
  ".parcel-cache",
  ".react-router-parcel",
];

// success objects
export const successFalse = Object.freeze({
  success: false,
});
export const successTrue = Object.freeze({
  success: true,
});

// error objects
export const typeError = Object.freeze({
  type: "error",
});
export const typeWarning = Object.freeze({
  type: "warning",
});

// default ESLint config language options
const jSXTrue = Object.freeze({ jsx: true });
export const typeScriptAndJSXCompatible = {
  // for compatibility with TypeScript (.ts and .tsx)
  parser: tseslint.parser,
  // for compatibility with JSX (React, etc.)
  parserOptions: {
    ecmaFeatures: { ...jSXTrue },
  },
};

// plugin name
export const commentVariablesPluginName = "comment-variables";

// rule name
export const extractRuleName = "extract-object-string-literal-values";
export const resolveRuleName = "resolve";
export const compressRuleName = "compress";
export const placeholdersRuleName = "placeholders"; // rule? (not a rule, used for command)

// messageId
export const placeholderMessageId = "placeholderMessageId";

// dataId
export const placeholderDataId = "placeholderDataId";

// process environments
export const MODULE_TO_LOAD = "MODULE_TO_LOAD";

// forbidden names for config data keys
/** @type {ForbiddenKeyNamesSet>} */
export const forbiddenKeyNamesSet = new Set(["value", "key", "placeholder"]);
