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

let refreshPromise: Promise<string | null> | null = null;

async function getValidToken(): Promise<string | null> {
  const token = await AuthStorage.getAccessToken();

  if (!token || !JWTUtils.isTokenExpired(token)) {
    return token;
  }

  if (!refreshPromise) {
    refreshPromise = keycloakService
      .refreshAccessToken()
      .then((tokens) => tokens?.accessToken ?? null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use(
  async (config) => {
    const token = await getValidToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      authEvents.emit("unauthorized");
    }
    return Promise.reject(error);
  },
);

export { api };
