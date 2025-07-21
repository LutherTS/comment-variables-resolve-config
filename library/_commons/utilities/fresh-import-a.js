import { fork } from "child_process";

export async function freshImport(moduleUrl) {
  const childProcess = fork("./fresh-import-b.js", {
    env: { MODULE_TO_LOAD: moduleUrl.toString() },
    serialization: "advanced",
  });

  return new Promise((resolve) => {
    childProcess.on("message", ({ module }) => {
      childProcess.kill();
      resolve(module);
    });
  });
}
