import axios from "axios";
import { Platform } from "react-native";
import { AuthStorage } from "../helpers/Auth/auth-storage";
import { JWTUtils } from "../helpers/Auth/jwt-utils";
import { keycloakService } from "../helpers/Auth/keycloak";
import { authEvents } from "../helpers/events/authEvents";

const api = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://10.0.2.2:5000/api"
      : "http://localhost:5000/api",
  timeout: 20 * 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    let token = await AuthStorage.getAccessToken();

    if (token && JWTUtils.isTokenExpired(token)) {
      console.log("expired");
      const tokens = await keycloakService.refreshAccessToken();
      console.log(tokens?.accessToken);
      console.log(tokens?.refreshToken);
      token = tokens?.accessToken ?? null;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      authEvents.emit("unauthorized");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export { api };
