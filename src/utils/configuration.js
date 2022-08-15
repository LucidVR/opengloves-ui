import {makeHTTPRequest} from "./http";

export const primaryConfigurationSection = "driver_openglove";

export const saveConfiguration = async (configObj) =>
  makeHTTPRequest("/settings", "POST", configObj);

export const getConfiguration = () => makeHTTPRequest("/settings", "GET");
