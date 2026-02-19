import { RegisterModel } from "../models/Auths/RegisterModel";
import { api } from "./api";
import { LoginModel } from "../models/Auths/LoginModel";

export const AuthService: IAuthService = {
  async login(loginModel: LoginModel): Promise<void> {
    try {
      var result = await api.post("/auth/login", { user: loginModel });
    } catch (error) {
      throw error;
    }
  },
  async register(registerModel: RegisterModel): Promise<void> {
    try {
      var response = await api.post("/auth/register", registerModel);
    } catch (ex) {
      console.log(ex);
    }
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
