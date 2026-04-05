import { PaginatedItemsViewModel } from "../models/PaginatedItemsViewModel";
import { AppUserListModel } from "../models/Users/AppUserListModel";
import { api } from "./api";

export const MatchesService: IMatchesService = {
  async RemoveMatch(userId: string): Promise<boolean> {
    try {
      const response = await api.delete<boolean>(`/matches/removeMatch`, {
        params: {
          userId: userId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
};

interface IMatchesService {
  RemoveMatch(userId: string): Promise<boolean>;
}
