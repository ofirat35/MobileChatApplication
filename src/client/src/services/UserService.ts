import { RegisterModel } from "../models/Auths/RegisterModel";
import { api } from "./api";
import { LoginModel } from "../models/Auths/LoginModel";
import { AppUserListModel } from "../models/Users/AppUserListModel";
import { useId } from "react";

export const UserService: IUserService = {
  async getUserById(userId: string): Promise<AppUserListModel> {
    try {
      var result = await api.get<AppUserListModel>(`/users/getById/${userId}`);
      return result.data;
    } catch (error) {
      console.error("api error:", error);
      console.error("get hata");
      throw error;
    }
  },
};

interface IUserService {
  getUserById(userId: string): Promise<AppUserListModel>;
}
