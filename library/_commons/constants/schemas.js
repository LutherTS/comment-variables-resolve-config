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

// NEW
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
