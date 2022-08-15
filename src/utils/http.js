import {http} from "@tauri-apps/api";
import {process} from "@tauri-apps/api";
import ToastStore from "../stores/toast";

const port = 52060;

export const makeHTTPRequest = async (
    url,
    method = "POST",
    body = "",
    retry = true
) => {
    try {
        const response = await http.fetch("http://localhost:" + port + url, {
            method,
            body: {
                type: "Json",
                payload: body,
            },
            responseType: 2,
        });
        if (response.status === 200) return response.data;
    } catch (e) {
        console.error(e);

        if (typeof e === "string" && e.includes("(os error 10061)") && retry) {
            throw "Could not connect to server. Please make sure SteamVR is running!";
        }

        throw "An unknown error occurred! " + e;
    }

};