import { AppUserUpdateModel } from "./../models/Users/AppUserUpdateModel";
import { PreferenceListModel } from "./../models/Users/PreferenceListModel";
import { api } from "./api";
import { AppUserListModel } from "../models/Users/AppUserListModel";
import { PreferenceUpdateModel } from "../models/Users/PreferenceUpdateModel";

export const UserService: IUserService = {
  async getUserById(userId: string): Promise<AppUserListModel> {
    try {
      var result = await api.get<AppUserListModel>(`/users/getById/${userId}`);
      return result.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
  async updateUser(user: AppUserUpdateModel): Promise<any> {
    try {
      var result = await api.put<AppUserUpdateModel>(`/users/update`, user);
      return result.data;
    } catch (error) {
      console.error("api error:", error);
      return null;
    }
  },
  async getPreferences(): Promise<PreferenceListModel | null> {
    try {
      var result = await api.get<PreferenceListModel>(`/users/getPreferences`);
      return result.data;
    } catch (error) {
      return null;
    }
  },
  async setPreferences(preference: PreferenceUpdateModel): Promise<any> {
    try {
      var result = await api.put(
        "/users/setPreferences",
        { preferences: preference }, // 👈 wrap it
      );
      return result.data;
    } catch (error) {
      console.error("api error:", error);
    }
  },
  async buyMembership(membership: string, duration: number): Promise<any> {
    try {
      var result = await api.post(
        "/memberships/buyMembership",
        { membership: membership, duration: duration }, // 👈 wrap it
      );
      return result.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
};

interface IUserService {
  getUserById(userId: string): Promise<AppUserListModel>;
  updateUser(user: AppUserUpdateModel): Promise<any>;
  getPreferences(): Promise<PreferenceListModel | null>;
  setPreferences(preference: PreferenceUpdateModel): Promise<any>;
  buyMembership(membership: string, duration: number): Promise<any>;
}
