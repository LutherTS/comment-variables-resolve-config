import fs from "fs";
import path from "path";
import url from "url";

import {
  successFalse,
  successTrue,
  typeError,
  typeWarning,
} from "./_commons/constants/bases.js";

import { flattenConfigData } from "./_commons/utilities/flatten-config-data.js";

import {
  ConfigDataSchema,
  ConfigIgnoresSchema,
} from "./_commons/schemas/config.js";

/**
 * Verifies, validates and resolves the config path to retrieve the config's data and ignores.
 * @param {string} configPath The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code extension.
 * @returns The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, and the original config. Errors are returned during failures so they can be reused differently on the CLI and the VS Code extension.
 */
const resolveConfig = async (configPath) => {
  // Step 1a: Checks if config file exists

  if (!fs.existsSync(configPath)) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. No config file found.",
        },
      ],
    };
  }

  // Step 1b: Checks if config file is JavaScript file

  const configExtension = path.extname(configPath);
  if (configExtension !== ".js") {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. File passed is not JavaScript (.js).",
        },
      ],
    };
  }

  // Step 2: Acquires the config

  const configModule = await /** @type {unknown} */ (
    import(`${url.pathToFileURL(configPath)}?t=${Date.now()}`)
  ); // `?t=${Date.now()}` for cache-busting
  const config = /** @type {unknown} */ (configModule.default);

  // Step 3: Validates config object

  // validates config
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message:
            "ERROR. Invalid config format. The config should be an object.",
        },
      ],
    };
  }

  // validates config.data
  const configDataResult = ConfigDataSchema.safeParse(config.data);

  if (!configDataResult.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. Config data could not pass validation from zod.",
        },
        ...configDataResult.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  // validates config.ignores
  const configIgnoresSchemaResult = ConfigIgnoresSchema.safeParse(
    config.ignores
  );

  if (!configIgnoresSchemaResult.success) {
    return {
      ...successFalse,
      errors: [
        {
          ...typeError,
          message: "ERROR. Config ignores could not pass validation from zod.",
        },
        ...configIgnoresSchemaResult.error.errors.map((e) => ({
          ...typeError,
          message: e.message,
        })),
      ],
    };
  }

  const flattenedConfigDataResults = flattenConfigData(configDataResult.data);

  if (!flattenedConfigDataResults.success) {
    return flattenedConfigDataResults;
  }

  /* NEW!! */
  // This is where I'll be using ESLint programmatically to obtain all object values that are string literals, along with their source locations. It may not seem necessary for the CLI, but since the CLI needs to be used with extension, validating its integrity right here and there will prevent mismatches in expectations between the two products.
  // So in the process, I will be running and received findAllImports, meaning resolveConfig will be exporting all imports from the config, with the relevant flag only needing to choose between all imports or just the config path. This way you can say eventually OK, here when I command-click a $COMMENT, because it's not ignored it sends me to the position, but here because it's ignored it actually shows me all references.

  // sends back:
  // - the flattened config data,
  // - the reverse flattened config data,
  // - the verified config path
  // - and the raw passed ignores
  return {
    ...flattenedConfigDataResults, // finalized
    configPath, // finalized
    passedIgnores: configIgnoresSchemaResult.data, // addressed with --lint-config-imports and --my-ignores-only to be finalized
    config, // and the config itself too
  };
};

export default resolveConfig;

export { successFalse, successTrue, typeError, typeWarning };

export {
  defaultConfigFileName,
  configFlag,
  lintConfigImportsFlag,
  myIgnoresOnlyFlag,
  $COMMENT,
  knownIgnores,
} from "./_commons/constants/bases.js";

export {
  configKeyRegex,
  flattenedConfigKeyRegex,
  flattenedConfigPlaceholderRegex,
} from "./_commons/constants/regexes.js";

export { escapeRegex } from "./_commons/utilities/helpers.js";
