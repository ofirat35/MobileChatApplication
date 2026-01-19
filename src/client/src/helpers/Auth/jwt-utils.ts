export interface UserInfo {
  name: string;
  email: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  sub?: string;
}

export class JWTUtils {
  static decodeToken(token: string): any {
    const parts = token.split(".");
    const [header, payload, signature] = parts;
    const base64Url = payload;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    const decoded = JSON.parse(jsonPayload);
    return decoded;
  }

  static extractUserInfo(token: string): UserInfo | null {
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return null;
    }

    const userInfo = {
      name:
        decoded.name || decoded.preferred_username || decoded.email || "User",
      email: decoded.email || "",
      preferred_username: decoded.preferred_username,
      given_name: decoded.given_name,
      family_name: decoded.family_name,
      sub: decoded.sub,
    };
    console.log(userInfo);
    return userInfo;
  }

  static extractUserName(token: string): string {
    const userInfo = this.extractUserInfo(token);
    if (!userInfo) {
      return "User";
    }
    let finalName = "User";

    if (userInfo.name) {
      finalName = userInfo.name;
    } else if (userInfo.given_name && userInfo.family_name) {
      finalName = `${userInfo.given_name} ${userInfo.family_name}`;
    }

    return finalName;
  }
}
