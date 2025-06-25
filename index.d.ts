// must be manually maintained

/**
 * Verifies, validates and resolves the config path to retrieve the config's data and ignores.
 * @param {string} configPath The path of the config from `comments.config.js`, or from a config passed via the `--config` flag in the CLI, or from one passed via `"commentVariables.config": true` in `.vscode/settings.json` for the VS Code Extension.
 * @returns The flattened config data, the reverse flattened config data, the verified config path, the raw passed ignores, and the original config. Errors are returned during failures so they can be reused differently on the CLI and the VS Code Extension.
 */
declare const resolveConfig: (configPath: string) => Promise<
  | {
      success: false;
      errors: Array<{
        type: "error" | "warning";
        message: string;
      }>;
    }
  | {
      success: true;
      configPath: string;
      passedIgnores: string[];
      config: object;
      flattenedConfigData: {
        [k: string]: string;
      };
      reversedFlattenedConfigData: {
        [k: string]: string;
      };
    }
>;
