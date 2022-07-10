import { http } from "@tauri-apps/api";
import { process } from "@tauri-apps/api";
import ToastStore from "../stores/toast";

const port = 18080;

export const makeHTTPRequest = async (
  url,
  method = "POST",
  body,
  retry = true
) => {
  try {
    const response = await http.fetch("http://localhost:" + port + "/" + url, {
      method: "POST",
      body: {
        type: "Json",
        payload: body,
      },
      responseType: 2,
    });
    if (response.status === 200) return response.data;

    console.error(response);

    throw new Error(
      response.data ? response.data : "An unknown error occurred"
    );
  } catch (e) {
    //The server has closed
    if (typeof e === "string" && e.includes("(os error 10061)") && retry) {
      ToastStore.addToast(
        ToastStore.severity.WARNING,
        "Server has closed - closing app."
      );

      setTimeout(() => process.exit(), 500);
    }
    throw e;
  }
};

export function SidecarWebsocket(
  onOpen = () => {},
  onMessage = () => {},
  onClose = () => {}
) {
  const socket = new WebSocket("ws://localhost:" + port + "/ws");

  socket.addEventListener("open", onOpen);

  socket.addEventListener("message", onMessage);

  socket.addEventListener("close", onClose);

  return {
    send: async (data) => socket.send(data),
  };
}
