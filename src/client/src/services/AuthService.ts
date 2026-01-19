import { RegisterModel } from "../models/Auths/RegisterModel";
import { api } from "./api";
import { LoginModel } from "../models/Auths/LoginModel";

export const AuthService: IAuthService = {
  async login(loginModel: LoginModel): Promise<void> {
    try {
      var result = await api.post("/auth/login", { user: loginModel });
      console.log("Login response:", result.data);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  async register(registerModel: RegisterModel): Promise<void> {
    await api.post("/auth/register", { user: registerModel });
  },
  logout(): void {
    throw new Error("Method not implemented");
  },
};

interface IAuthService {
  login(loginModel: LoginModel): Promise<void>;
  register(registerModel: RegisterModel): Promise<void>;
  logout(): void;
}
