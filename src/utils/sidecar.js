import { Command } from "@tauri-apps/api/shell";

/**
 *
 * @param {string} program Name of executable to run
 * @param onData {function} Callback for when data received
 * @param onError {function} Callback for when error received
 * @returns {Promise<Child>} Lines from executable's stdout
 * @throws {string} First line of executable's stderr
 */
const openSidecar = async (program, onData, onError) => {
  const sidecar = Command.sidecar(program);

  sidecar.stdout.on("data", (e) => onData(e));
  sidecar.stderr.on("data", (e) => onError(e));

  return await sidecar.spawn();
};

export const awaitSidecarInit = (onChildSet) =>
  new Promise((resolve, reject) =>
    openSidecar(
      "sidecar",
      (e) => resolve(e),
      (e) => reject(e)
    ).then(onChildSet)
  );
