import { KeycloakTokens } from "./keycloak";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "chatapp_access_token";
const REFRESH_TOKEN_KEY = "chatapp_refresh_token";
const ID_TOKEN_KEY = "chatapp_id_token";

export class AuthStorage {
  private static async storeItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  private static getItem(key: string): string | null {
    return SecureStore.getItem(key);
  }

  private static async deleteItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }

  static async storeTokens(tokens: KeycloakTokens): Promise<void> {
    await this.storeItem(ACCESS_TOKEN_KEY, tokens.accessToken);

    if (tokens.refreshToken) {
      await this.storeItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }

    if (tokens.idToken) {
      await this.storeItem(ID_TOKEN_KEY, tokens.idToken);
    }
  }

  static getAccessToken(): string | null {
    const token = this.getItem(ACCESS_TOKEN_KEY);
    return token;
  }

  static getRefreshToken(): string | null {
    return this.getItem(REFRESH_TOKEN_KEY);
  }

  static getIdToken(): string | null {
    const token = this.getItem(ID_TOKEN_KEY);
    return token;
  }

  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const isAuthenticated = !!token;
    return isAuthenticated;
  }

  static async clearTokens(): Promise<void> {
    await this.deleteItem(ACCESS_TOKEN_KEY);
    await this.deleteItem(REFRESH_TOKEN_KEY);
    await this.deleteItem(ID_TOKEN_KEY);
  }
}
