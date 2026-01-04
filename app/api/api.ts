import axios from "axios";

export const backendApi = axios.create({
  baseURL: "https://notehub-api.goit.study",
  withCredentials: true,
});
