import {Command} from "@tauri-apps/api/shell";

export const openSidecar = async (program, type, data) => {
    const sidecar = Command.sidecar(program);

    const promiseDataReceived = new Promise((resolve, reject) => {
        sidecar.stdout.on('data', e => resolve(e));
        sidecar.stderr.on('data', e => reject(e));
    });

    const child = await sidecar.spawn();
    const input = JSON.stringify({
        type,
        data,
    });

    await child.write(input + "\n");

    return await promiseDataReceived;
}