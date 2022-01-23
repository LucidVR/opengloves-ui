import {http} from "@tauri-apps/api";

const basePath = "http://localhost:18080/";

export const makeHTTPRequest = async (url, method = "POST", body) => {
    const response = await http.fetch(basePath + url, {
        method: 'POST',
        body: {
            type: 'Json',
            payload: body,
        },
        responseType: 2
    });
    if(response.status === 200) return response.data;

    console.error(response);

    throw new Error(response.data ?? "An unknown error occurred");
}