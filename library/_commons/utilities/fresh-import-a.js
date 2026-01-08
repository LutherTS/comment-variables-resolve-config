import url from "url";
import path from "path";
import { fork } from "child_process";

import { MODULE_TO_LOAD } from "../constants/bases.js";

const childScriptAbsolutePath = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "fresh-import-b.js"
);

/**
 * $COMMENT#JSDOC#DEFINITIONS#FRESHIMPORT
 * @param {string} moduleUrl $COMMENT#JSDOC#PARAMS#MODULEURL
 * @returns $COMMENT#JSDOC#RETURNS#FRESHIMPORT
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
