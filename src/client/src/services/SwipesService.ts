import { AppUserProfile } from "../models/Users/AppUserProfile";
import { api } from "./api";

export const SwipesService: ISwipesService = {
  async GetUsersToSwipe(
    count: number = 7,
    offset: number | null = null,
  ): Promise<AppUserProfile[]> {
    try {
      var result = await api.get<AppUserProfile[]>("/swipes/getUsersToSwipe", {
        params: { count: count, offset: offset },
      });
      return result.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  async Like(userId: string): Promise<boolean> {
    try {
      var response = await api.post<boolean>("/swipes/like", {
        userId: userId,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async Pass(userId: string): Promise<boolean> {
    try {
      var response = await api.post<boolean>("/swipes/pass", {
        userId: userId,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async ViewProfile(userId: string): Promise<boolean> {
    try {
      var response = await api.post<boolean>("/swipes/viewProfile", {
        userId: userId,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

interface ISwipesService {
  GetUsersToSwipe(
    count: number,
    offset: number | null,
  ): Promise<AppUserProfile[]>;
  Like(userId: string): Promise<boolean>;
  Pass(userId: string): Promise<boolean>;
  ViewProfile(userId: string): Promise<boolean>;
}
