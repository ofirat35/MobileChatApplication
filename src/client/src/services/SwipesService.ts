import { AppUserListModel } from "../models/Users/AppUserListModel";
import { api } from "./api";

export const SwipesService: ISwipesService = {
  async GetUsersToSwipe(
    count: number = 7,
    excludedUserIds: string[] | null = null,
  ): Promise<AppUserListModel[]> {
    try {
      var result = await api.get<AppUserListModel[]>(
        "/swipes/getUsersToSwipe",
        {
          params: { count: count, excludedUserIds: excludedUserIds },
        },
      );
      return result.data;
    } catch (error) {
      console.log(error);
      return [];
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
    excludedUserIds?: string[] | null,
  ): Promise<AppUserListModel[]>;
  Like(userId: string): Promise<boolean>;
  Pass(userId: string): Promise<boolean>;
  ViewProfile(userId: string): Promise<boolean>;
}
