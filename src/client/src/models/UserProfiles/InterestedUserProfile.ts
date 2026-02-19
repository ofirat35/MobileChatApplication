import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";
import { AppUserProfile } from "../Users/AppUserProfile";

export type InterestedUserProfile = {
  user: AppUserProfile;
  status: SwipeStatusEnum;
};
