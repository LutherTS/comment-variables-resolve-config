import { $COMMENT } from "./bases.js";

import { escapeRegex } from "../utilities/helpers.js";

/** $COMMENT#JSDOC#CONSTANTS#CONFIGKEYREGEX */
export const configKeyRegex = /^[\p{Ll}\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}\s]+$/u;

/** $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGKEYREGEX */
export const flattenedConfigKeyRegex =
  /^(?!#)[\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}#]+$/u;

/** $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGPLACEHOLDERLOCALREGEX */
export const flattenedConfigPlaceholderLocalRegex = new RegExp(
  `${escapeRegex($COMMENT)}#(?!#)([\\p{Lu}\\p{Lo}\\p{Pd}\\p{Pc}\\p{N}#_]+)`,
  "u"
);

/** $COMMENT#JSDOC#CONSTANTS#FLATTENEDCONFIGPLACEHOLDERGLOBALREGEX */
export const flattenedConfigPlaceholderGlobalRegex = new RegExp(
  `${escapeRegex($COMMENT)}#(?!#)([\\p{Lu}\\p{Lo}\\p{Pd}\\p{Pc}\\p{N}#_]+)`,
  "gu"
);
