import { GenderEnum } from "../../helpers/enums/GenderEnum";
import { UserMembershipListModel } from "../UserMemberships/UserMembershipListModel";

export type MembershipListModel = {
  id: string;
  name: string;
  price: string;
  isValid: GenderEnum;
  createdDate: string;
  userMemberships: UserMembershipListModel[];
};
