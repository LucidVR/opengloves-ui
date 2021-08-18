import {Command} from "@tauri-apps/api/shell";

export const openSidecar = async (program, type, data) => {
    const sidecar = Command.sidecar(program);

    const promiseDataReceived = new Promise((resolve, reject) => {
        // Listen for output
        const stdout = [];
        sidecar.stdout.on('data', e => stdout.push(e));
        let hadStderr = false;
        sidecar.stderr.on('data', e => {
            hadStderr = true;
            reject(e);
        });

        // Report output on exit
        sidecar.on('close', () => {
            if (!hadStderr)
                resolve(stdout);
        });
    });

    const child = await sidecar.spawn();
    const input = JSON.stringify({
        type,
        data,
    });

    await child.write(input + "\n");

    return await promiseDataReceived;
}