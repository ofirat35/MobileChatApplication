import { GenderEnum } from "../../helpers/enums/GenderEnum";
import { SwipeStatusEnum } from "../../helpers/enums/SwipeStatusEnum";
import { UserImageListDto } from "../Images/UserImageListDto";

export type AppUserListModel = {
  id: string;
  firstName: string;
  lastName: string;
  gender: GenderEnum;
  bio: string;
  country: string;
  email: string;
  birthDate: string;
  createdDate: string;
  images: UserImageListDto[];
  status: SwipeStatusEnum;
};
