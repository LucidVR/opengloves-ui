import {http} from "@tauri-apps/api";

const basePath = "http://localhost:18080/";

export const makeHTTPRequest = async (url, method = "POST", body) => {
    console.log(JSON.stringify(body));
    // return fetch(basePath + "/" + url, {
    //     method,
    //     body: JSON.stringify(body),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     mode: 'cors'
    // }).then(response => {
    //     if(response.ok) return response.text();
    //
    //     throw new Error("An unknown error occurred");
    // });

    const response = await http.fetch(basePath + url, {
        method: 'POST',
        body: {
            type: 'Json',
            payload: body,
        },
        responseType: 1,
    });
    console.log("hi");

    if(response.status === 200) return JSON.stringify(response.data);
    console.trace(response);

    throw new Error(response.data);
}