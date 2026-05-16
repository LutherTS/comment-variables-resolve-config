import { data } from "./comment-variables/data/index.js";

import { enComposedVariablesExclusives } from "./comment-variables/data/en/index.js";

import { EN, ENGLISH } from "./comment-variables/index.js";
import { enData } from "./comment-variables/data/en/index.js";

const ignores = [];

const composedVariablesExclusives = [...enComposedVariablesExclusives];

const variations = Object.freeze({
  // Defines all variants that have matching variations duly defined within the top-level keys of `data`.
  variants: Object.freeze({
    [EN]: Object.freeze({ label: ENGLISH }),
  }),
  // Defines the current variant that Comment Variables currently resolves to.
  variant: EN,
  // Defines the reference variation that all other variations need to have (or aim to have) matching keys with. Requires a JavaScript variable as it needs to be the exact same object as the one referenced at `data[variations.referenceVariant]`.
  referenceData: enData,
  // Defines the variant of the reference variation.
  referenceVariant: EN,
  // Defines the behavior of the error handling in case of variations that do not match one-to-one with the reference variation. If `true`, allows incomplete variations data to remain. If `false`, errors and guides the fixing of missing variations data (while ignoring composed variables exclusives).
  allowIncompleteVariations: true,
  // Defines which variants' `#PUBLIC#` Comment Variables should be publicly available, by default through `comments.public.mjs` and `comments.public.json`.
});

const config = {
  data,
  ignores,
  composedVariablesExclusives,
  variations,
};

export default config;
