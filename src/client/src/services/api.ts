import axios from "axios";
import { Platform } from "react-native";

const api = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://10.0.2.2:5000/api"
      : "http://localhost:5000/api",
  timeout: 20 * 1000,
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer token",
  //   },
});

export { api };
