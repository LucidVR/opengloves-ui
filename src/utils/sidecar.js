import {Command} from "@tauri-apps/api/shell";

export const openSidecar = async (program, type, data) => {
    const sidecar = Command.sidecar(program);

    const promiseDataReceived = new Promise((resolve, reject) => {
        // Listen for output
        const stdout = [];
        sidecar.stdout.on('data', e => stdout.push(e));
        const stderr = [];
        sidecar.stderr.on('data', e => stderr.push(e));

        // Report output on exit
        sidecar.on('close', () => {
            if (stderr.length > 0)
                reject(stderr.join('\n'));
            else
                resolve(stdout.join('\n'));
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