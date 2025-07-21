import tseslint from "typescript-eslint";

// comments.config.js
export const defaultConfigFileName = "comments.config.js";

// flags
export const configFlag = "--config";
export const lintConfigImportsFlag = "--lint-config-imports";
export const myIgnoresOnlyFlag = "--my-ignores-only";

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

// $COMMENT#FORCOMPOSEDVARIABLES#PLUGINNAME name
export const commentVariablesPluginName = "comment-variables";

// $COMMENT#FORCOMPOSEDVARIABLES#RULENAME name
export const extractRuleName = "extract-object-string-literal-values";

// messageId
export const placeholderMessageId = "placeholderMessageId";

// dataId
export const placeholderDataId = "placeholderDataId";

// process environments
export const MODULE_TO_LOAD = "MODULE_TO_LOAD";
