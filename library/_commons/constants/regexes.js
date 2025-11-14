import { $COMMENT } from "./bases.js";

import { escapeRegex } from "../utilities/helpers.js";

/** Ensures keys should only include lowercase letters (`Ll`), uppercase letters (`Lu`), other letters (`Lo`), dash punctuation (`Pd`), connector punctuation (`Pc`), numbers (`N`) and whitespaces (`s`). */
export const configKeyRegex = /^[\p{Ll}\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}\s]+$/u;

/** Same as `configKeyRegex` but without lowercase letters (`\p{Ll}`), without whitespaces (`\s` which are replaced by underscores) and with the '`#`' character (that links each subkey together). */
export const flattenedConfigKeyRegex =
  /^(?!#)[\p{Lu}\p{Lo}\p{Pd}\p{Pc}\p{N}#]+$/u;

/** Same as `flattenedConfigKeyRegex` but taking the prefix `$COMMENT` and its `#` into consideration, preventing two consecutive `#`'s, removing `^` and `$` in the capture group, and using `_` as replacement for whitespaces. */
export const flattenedConfigPlaceholderLocalRegex = new RegExp(
  `${escapeRegex($COMMENT)}#(?!#)([\\p{Lu}\\p{Lo}\\p{Pd}\\p{Pc}\\p{N}#_]+)`,
  "u"
);

/** Same as `flattenedConfigPlaceholderLocalRegex` but globally. */
export const flattenedConfigPlaceholderGlobalRegex = new RegExp(
  `${escapeRegex($COMMENT)}#(?!#)([\\p{Lu}\\p{Lo}\\p{Pd}\\p{Pc}\\p{N}#_]+)`,
  "gu"
);
