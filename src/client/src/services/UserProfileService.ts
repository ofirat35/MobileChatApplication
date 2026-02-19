import { InterestedUserProfile } from "../models/UserProfiles/InterestedUserProfile";
import { api } from "./api";
import { PaginatedItemsViewModel } from "../models/PaginatedItemsViewModel";

export const UserProfileService: IUserProfileService = {
  async GetInterestedUserProfiles(
    page: number,
    pageCount: number = 10,
  ): Promise<PaginatedItemsViewModel<InterestedUserProfile>> {
    try {
      var result = await api.get<
        PaginatedItemsViewModel<InterestedUserProfile>
      >("/userProfiles/getInterestedUserProfiles", {
        params: {
          page: page,
          pageCount: pageCount,
        },
      });
      return result.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
  async GetUserProfile(userId: string): Promise<InterestedUserProfile> {
    try {
      var result = await api.get<InterestedUserProfile>(
        "/userProfiles/getUserProfile",
        {
          params: {
            userId: userId,
          },
        },
      );
      return result.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
};

interface IUserProfileService {
  GetInterestedUserProfiles(
    page: number,
    pageCount: number,
  ): Promise<PaginatedItemsViewModel<InterestedUserProfile>>;
  GetUserProfile(userId: string): Promise<InterestedUserProfile>;
}
