import url from "url";
import path from "path";
import { fork } from "child_process";

import { MODULE_TO_LOAD } from "../constants/bases.js";

const childScriptAbsolutePath = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "fresh-import-b.js"
);

/**
 * Guarantees a fresh import of the config, negating the innate (and hidden) cache of the dynamic `import` utility.
 * @param {string} moduleUrl The absolute path of the module to import.
 * @returns Either an object with its `default` property sets to the default export of the module successfully loaded or `null` when an error arises. (Debugging is currently manual by looking at the error being caught in the child process.)
 */
export async function freshImport(moduleUrl) {
  const childProcess = fork(childScriptAbsolutePath, {
    env: { [MODULE_TO_LOAD]: moduleUrl.toString() },
    serialization: "advanced",
  });

  /** @type {Promise<{ default: unknown } | null>} */
  const promise = new Promise((resolve) => {
    childProcess.on("message", ({ module }) => {
      childProcess.kill();
      resolve(module);
    });
  });

  return promise;
}
