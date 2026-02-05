import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { AuthStorage } from "./auth-storage";
import { JWTUtils, UserInfo } from "./jwt-utils";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

export interface KeycloakTokens {
  accessToken: string;
  refreshToken: string | null;
  idToken: string | null;
  tokenType: string;
  expiresIn: number;
  userInfo?: UserInfo | null;
}

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  redirectUri: string;
}

export class KeycloakService {
  private config: KeycloakConfig;
  private static instance: KeycloakService;

  private constructor(config: KeycloakConfig) {
    this.config = config;
  }

  static getInstance(config?: KeycloakConfig): KeycloakService {
    if (!KeycloakService.instance && config) {
      KeycloakService.instance = new KeycloakService(config);
    }
    return KeycloakService.instance;
  }

  async login(): Promise<KeycloakTokens | null> {
    const discovery = await this.getDiscoveryDocument();
    const authRequest = new AuthSession.AuthRequest({
      clientId: this.config.clientId,
      redirectUri: this.config.redirectUri,
      usePKCE: true,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      scopes: ["openid", "profile", "email"],
    });

    const result = await authRequest.promptAsync(discovery, {
      showInRecents: true,
    });

    if (result.type === "success") {
      const code = result.params.code;
      const error = result.params.error;

      if (error) {
        console.error("❌ Authentication error:", error);
        return null;
      }

      if (code) {
        console.log("🎫 Authorization code received");
        const tokens = await this.exchangeCodeForTokens(
          code,
          this.config.redirectUri,
          authRequest.codeVerifier!,
        );
        return tokens;
      }
    } else {
      console.log("❌ Authentication failed or cancelled");
      console.log("📄 Result type:", result.type);
    }

    return null;
  }

  private async getDiscoveryDocument() {
    const discoveryUrl = `${this.config.url}/realms/${this.config.realm}/.well-known/openid-configuration`;
    const discovery = (
      await axios.get<{
        authorization_endpoint: string;
        token_endpoint: string;
        revocation_endpoint: string;
        end_session_endpoint: string;
      }>(discoveryUrl)
    ).data;

    return {
      authorizationEndpoint: discovery.authorization_endpoint,
      tokenEndpoint: discovery.token_endpoint,
      revocationEndpoint: discovery.revocation_endpoint,
      endSessionEndpoint: discovery.end_session_endpoint,
    };
  }

  private async exchangeCodeForTokens(
    code: string,
    redirectUri: string,
    codeVerifier: string,
  ): Promise<KeycloakTokens | null> {
    const discovery = await this.getDiscoveryDocument();
    const formData = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: this.config.clientId,
      code_verifier: codeVerifier,
    });
    const response = await axios.post(
      discovery.tokenEndpoint,
      formData.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );
    const data = await response.data;
    let userInfo = JWTUtils.extractUserInfo(data.access_token);

    const tokens: KeycloakTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || null,
      idToken: data.id_token || null,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      userInfo: userInfo,
    };
    console.log(tokens);
    await AuthStorage.storeTokens(tokens);
    return tokens;
  }

  async logout(): Promise<void> {
    const discovery = await this.getDiscoveryDocument();
    const refreshToken = await AuthStorage.getRefreshToken();
    await this.revokeToken(refreshToken!, discovery.revocationEndpoint);
    await AuthStorage.clearTokens();
  }

  async isAuthenticated(): Promise<boolean> {
    return await AuthStorage.isAuthenticated();
  }

  async getStoredTokens(): Promise<KeycloakTokens | null> {
    const accessToken = await AuthStorage.getAccessToken();
    const refreshToken = await AuthStorage.getRefreshToken();
    const idToken = await AuthStorage.getIdToken();

    if (accessToken) {
      let userInfo = null;
      if (idToken) {
        userInfo = JWTUtils.extractUserInfo(idToken);
      }
      const tokens: KeycloakTokens = {
        accessToken,
        refreshToken,
        idToken,
        tokenType: "Bearer",
        expiresIn: 3600, // Default value, should be refreshed from server
        userInfo,
      };
      return tokens;
    }

    console.log("⚠️ Keycloak: No access token found in storage");
    return null;
  }

  async getCurrentUserName(): Promise<string> {
    const tokens = await this.getStoredTokens();

    if (tokens?.userInfo?.name) {
      return tokens.userInfo.name;
    }
    if (tokens?.idToken) {
      const userName = JWTUtils.extractUserName(tokens.idToken);
      return userName;
    }
    return "User";
  }

  async getCurrentUserEmail(): Promise<string> {
    const tokens = await this.getStoredTokens();
    if (tokens?.userInfo?.email) {
      return tokens.userInfo.email;
    }
    if (tokens?.idToken) {
      const userInfo = JWTUtils.extractUserInfo(tokens.idToken);
      const email = userInfo?.email || "";
      return email;
    }
    return "";
  }

  private async revokeToken(
    token: string,
    revocationEndpoint: string,
  ): Promise<boolean> {
    const formData = new URLSearchParams({
      token: token,
      client_id: this.config.clientId,
      token_type_hint: "refresh_token",
    });

    const response = await axios.post(revocationEndpoint, formData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  }
}

export const keycloakConfig: KeycloakConfig = {
  url: "http://10.0.2.2:8080",
  realm: "ChatApp",
  clientId: "chatapp-mobile",
  redirectUri: "com.firat35.client://redirect",
};

export const keycloakService = KeycloakService.getInstance(keycloakConfig);
