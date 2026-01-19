import { KeycloakTokens } from "./keycloak";

// Simple in-memory storage for development
class MemoryStorage {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}

// Try to import AsyncStorage, fall back to memory storage
let AsyncStorage: any = null;
try {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
} catch (error) {
  console.log("🔄 AsyncStorage not available, using memory storage fallback");
  AsyncStorage = new MemoryStorage();
}

// Try to import SecureStore
let SecureStore: any = null;
try {
  SecureStore = require("expo-secure-store");
} catch (error) {
  console.log(
    "🔄 ExpoSecureStore not available, will use AsyncStorage fallback",
  );
}

const ACCESS_TOKEN_KEY = "chatapp_access_token";
const REFRESH_TOKEN_KEY = "chatapp_refresh_token";
const ID_TOKEN_KEY = "chatapp_id_token";

export class AuthStorage {
  private static async storeItem(key: string, value: string): Promise<void> {
    if (SecureStore) {
      try {
        await SecureStore.setItemAsync(key, value);
        return;
      } catch (error) {
        console.log(
          "🔄 SecureStore not available, falling back to AsyncStorage",
        );
      }
    }
    await AsyncStorage.setItem(key, value);
  }

  private static async getItem(key: string): Promise<string | null> {
    if (SecureStore) {
      return await SecureStore.getItemAsync(key);
    }
    return await AsyncStorage.getItem(key);
  }

  private static async deleteItem(key: string): Promise<void> {
    if (SecureStore) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  }

  static async storeTokens(tokens: KeycloakTokens): Promise<void> {
    await this.storeItem(ACCESS_TOKEN_KEY, tokens.accessToken);

    if (tokens.refreshToken) {
      await this.storeItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }

    if (tokens.idToken) {
      await this.storeItem(ID_TOKEN_KEY, tokens.idToken);
      console.log("✅ AuthStorage: ID token stored");
    }
  }

  static async getAccessToken(): Promise<string | null> {
    const token = await this.getItem(ACCESS_TOKEN_KEY);
    return token;
  }

  static async getRefreshToken(): Promise<string | null> {
    return await this.getItem(REFRESH_TOKEN_KEY);
  }

  static async getIdToken(): Promise<string | null> {
    const token = await this.getItem(ID_TOKEN_KEY);
    return token;
  }

  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    const isAuthenticated = !!token;
    return isAuthenticated;
  }

  static async clearTokens(): Promise<void> {
    await this.deleteItem(ACCESS_TOKEN_KEY);
    await this.deleteItem(REFRESH_TOKEN_KEY);
    await this.deleteItem(ID_TOKEN_KEY);
  }
}
