import {http} from "@tauri-apps/api";
import {awaitSidecarInit} from "./sidecar";

const basePath = "http://localhost:18080/";

export const makeHTTPRequest = async (url, method = "POST", body, retry = true) => {
    try {
        const response = await http.fetch(basePath + url, {
            method: 'POST',
            body: {
                type: 'Json',
                payload: body,
            },
            responseType: 2
        });
        if (response.status === 200) return response.data;

        console.error(response);

        throw new Error(response.data ?? 'An unknown error occurred');
    } catch (e) {
        //The server has closed, retry connection
        if (typeof e === 'string' && e.includes('(os error 10061)') && retry) {
            await awaitSidecarInit();

            return makeHTTPRequest(url, method, body, false);
        }
        throw e;
    }

}