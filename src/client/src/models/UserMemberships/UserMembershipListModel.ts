import { GenderEnum } from "../../helpers/enums/GenderEnum";

export type UserMembershipListModel = {
  id: string;
  UserId: string;
  TotalAmount: GenderEnum;
  StartDate: string;
  EndDate: string;
  MembershipEnded: string;
  MembershipId: string;
};
