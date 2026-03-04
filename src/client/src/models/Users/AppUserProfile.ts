import { GenderEnum } from "../../helpers/enums/GenderEnum";
import { UserImageListDto } from "../Images/UserImageListDto";

export type AppUserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  gender: GenderEnum;
  bio?: string;
  birthDate: string;
  country: string;
  images: UserImageListDto[];
};
