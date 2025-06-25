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
