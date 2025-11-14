import { z } from "zod";

import { forbiddenKeyNamesSet } from "./bases.js";
import { configKeyRegex } from "./regexes.js";

// Think about doing it with zod 4 eventually.
export const ConfigDataSchema = z
  .lazy(() =>
    z.record(
      z.unknown().superRefine((val, ctx) => {
        if (typeof val === "string") {
          if (val === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Value should not be an empty string.`,
              path: ctx.path,
            });
          }
          return;
        }

        if (typeof val === "object" && val && !Array.isArray(val)) {
          const parsed = ConfigDataSchema.safeParse(val);
          if (!parsed.success) {
            for (const issue of parsed.error.issues) {
              ctx.addIssue({
                ...issue,
                path: [...ctx.path, ...issue.path],
              });
            }
          }
          return;
        }

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Value \`${val}\` of type "${typeof val}" should be a string or a nested object.`,
          path: ctx.path,
        });
      })
    )
  )
  .superRefine((obj, ctx) => {
    for (const key of Object.keys(obj)) {
      if (key.includes("$")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Key "${key}" should not include the "$" character.`,
          path: [key],
        });
      }
      if (key.includes("#")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Key "${key}" should not include the "#" character.`,
          path: [key],
        });
      }
      // ensures no comment syntax in keys (values are handled in entry index.js file)
      if (key.includes("//")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Key "${key}" should not include "//" for structural reasons related to JavaScript comments.`,
          path: [key],
        });
      }
      if (key.includes("/*")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Key "${key}" should not include "/*" for structural reasons related to JavaScript comments.`,
          path: [key],
        });
      }
      if (key.includes("*/")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Key "${key}" should not include "*/" for structural reasons related to JavaScript comments.`,
          path: [key],
        });
      }
      if (!configKeyRegex.test(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Key "${key}" should only include whitespaces (s), lowercase letters (Ll), uppercase letters (Lu), other letters (Lo), numbers (N), dash punctuation (Pd), and connector punctuation (Pc).`,
          path: [key],
        });
      }
      if (forbiddenKeyNamesSet.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          // "placeholder" is no longer a reserved word in the Comment Variables ecosystem.
          // message: `A key like "${key}" is not allowed to be named "value", "key", or "placeholder".`,
          message: `A key like "${key}" is not allowed to be named "value" or "key".`,
          path: [key],
        });
      }
    }
  });

export const ConfigIgnoresSchema = z.array(
  z.string({
    message: `The config's "ignores" key array should be made of strings or be empty.`,
  }),
  {
    message: `The config's "ignores" key value should be an array of strings (or at the very least an empty array).`,
  }
);

export const ConfigLintConfigImportsSchema = z
  .boolean({
    message: `The config's "lintConfigImports" key's value, if provided, should only be a boolean.`,
  })
  .optional();

export const ConfigMyIgnoresOnlySchema = z
  .boolean({
    message: `The config's "myIgnoresOnly" key's value, if provided, should only be a boolean.`,
  })
  .optional();

export const ConfigComposedVariablesExclusivesSchema = z
  .array(
    z.string({
      message: `The config's "composedVariablesExclusives" key array should be made of strings or be empty.`,
    }),
    {
      message: `The config's "composedVariablesExclusives" key value, if provided, should only be an array.`,
    }
  )
  .refine((array) => new Set(array).size === array.length, {
    message: `The config's "composedVariablesExclusives" key array should not contain duplicate values.`,
  })
  .optional();

// NEW
export const VariationsSchema = z
  .object(
    {
      variants: z.record(
        z.object(
          {
            label: z.string({ message: `All variant labels must be strings.` }),
          },
          {
            message: `The config's "variations.variants" key's value must be a record.`,
          }
        ),
        {
          message: `The config's "variations.variants" key's value must be a record.`,
        }
      ),
      variant: z.string({
        message: `The config's "variations.variant" key's value must be a string.`,
      }),
      referenceData: ConfigDataSchema,
      referenceVariant: z.string({
        message: `The config's "variations.referenceVariant" key's value must be a string.`,
      }),
      allowIncompleteVariations: z.boolean({
        message: `The config's "variations.allowIncompleteVariations" key's value must be a boolean.`,
      }),
    },
    {
      message: `The config's "variations" key's value must be an object (or undefined).`,
    }
  )
  .superRefine((val, ctx) => {
    // Check that variant is one of the variants keys
    if (!Object.keys(val.variants).includes(val.variant)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `The variations.variant key "${val.variant}" must be one of the keys in variations.variants.`,
        path: ["variant"],
      });
    }
    // Check that referenceVariant is one of the variants keys
    if (!Object.keys(val.variants).includes(val.referenceVariant)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `The variations.referenceVariant key "${val.referenceVariant}" must be one of the keys in variations.variants.`,
        path: ["referenceVariant"],
      });
    }

    // Check that labels are unique
    const labels = Object.values(val.variants).map((v) => v.label);
    const lowerLabels = labels.map((l) => l.toLowerCase()); // case-insensitive

    if (lowerLabels.length !== new Set(lowerLabels).size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `The variations.variants key's object values should not contain duplicate labels.`,
        path: ["variants"],
      });
    }
  })
  .optional();
