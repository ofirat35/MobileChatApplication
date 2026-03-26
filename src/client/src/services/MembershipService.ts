import { MembershipListModel } from "./../models/Memberships/MembershipListModel";
import { api } from "./api";

export const MembershipService: IMembershipService = {
  async getMemberships(): Promise<MembershipListModel[]> {
    try {
      var result = await api.get<MembershipListModel[]>(
        `/memberships/getMemberships`,
      );
      return result.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
  async buyMembership(membership: string, duration: number): Promise<any> {
    try {
      var result = await api.post("/memberships/buyMembership", {
        membership: membership,
        duration: duration,
      });
      return result.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
};

interface IMembershipService {
  getMemberships(): Promise<MembershipListModel[]>;
  buyMembership(membership: string, duration: number): Promise<any>;
}
