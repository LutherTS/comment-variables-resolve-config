import { $COMMENT } from "./bases.js";

import { escapeRegex } from "../utilities/helpers.js";

export const configKeyRegex = /^[\p{Ll}\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}\s]+$/u;

export const flattenedConfigKeyRegex =
  /^(?!#)[\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}#]+$/u; // same as configKeyRegex but without lowercase letters (\p{Ll}), without whitespaces (\s which are replaced by underscores) and with the '#' character (that links each subkey together)
export const flattenedConfigPlaceholderLocalRegex = new RegExp(
  `${escapeRegex($COMMENT)}#(?!#)([\\p{Lu}\\p{Lo}\\p{Pd}\\p{Pc}\\p{N}#_]+)`,
  "u"
); // same as flattenedConfigKeyRegex but taking the prefix $COMMENT and its # into consideration, preventing two consecutive #'s, removing ^ and $ in the capture group, and using _ as replacement for whitespaces
export const flattenedConfigPlaceholderGlobalRegex = new RegExp(
  `${escapeRegex($COMMENT)}#(?!#)([\\p{Lu}\\p{Lo}\\p{Pd}\\p{Pc}\\p{N}#_]+)`,
  "gu"
); // same as flattenedConfigPlaceholderLocalRegex but globally
