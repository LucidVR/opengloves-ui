import {Command} from "@tauri-apps/api/shell";

/**
 * 
 * @param {string} program Name of executable to run
 * @param {string} type Command to run inside executable
 * @param {any} data Optional data required for command
 * @returns {Promise<string[]>} Lines from executable's stdout
 * @throws {string} First line of executable's stderr
 */
export const openSidecar = async (program, type, data) => {
    const sidecar = Command.sidecar(program);

    const promiseDataReceived = new Promise((resolve, reject) => {
        // Listen for output
        const stdout = [];
        sidecar.stdout.on('data', e => stdout.push(e));
        sidecar.stderr.on('data', e => reject(e));

        // Report output on exit
        sidecar.on('close', () => resolve(stdout));
    });

    const child = await sidecar.spawn();
    const input = JSON.stringify({
        type,
        data,
    });

    await child.write(input + "\n");

    return await promiseDataReceived;
}