import axios from "axios";
import { Platform } from "react-native";
import { AuthStorage } from "../helpers/Auth/auth-storage";
import { JWTUtils } from "../helpers/Auth/jwt-utils";
import { keycloakService } from "../helpers/Auth/keycloak";

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

// Add the token dynamically to every request
api.interceptors.request.use(
  async (config) => {
    let token = await AuthStorage.getAccessToken();

    if (token && JWTUtils.isTokenExpired(token)) {
      const tokens = await keycloakService.refreshAccessToken();
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

// api.interceptors.response.use(
//   (response) => response, // If the request succeeds, just return it
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error is 401 and we haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // Attempt to refresh the token one last time
//       const tokens = await keycloakService.refreshAccessToken();

//       if (tokens) {
//         // If refresh worked, update the header and retry the original request
//         originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
//         return api(originalRequest);
//       } else {
//         // REFRESH FAILED: This is the moment to redirect
//         await keycloakService.logout();

//         // IMPORTANT: You need a way to notify your UI state here.
//         // If you use a Global State (like Zustand or Context),
//         // call the logout/clear function here.
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export { api };
