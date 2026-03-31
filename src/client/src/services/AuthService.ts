import { RegisterModel } from "../models/Auths/RegisterModel";
import { api } from "./api";

export const AuthService: IAuthService = {
  async register(registerModel: RegisterModel): Promise<boolean> {
    try {
      var result = await api.post<boolean>("/auth/register", registerModel);
      return result.data;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  },
};

interface IAuthService {
  register(registerModel: RegisterModel): Promise<boolean>;
}
