import { UserImageListDto } from "../Images/UserImageListDto";

export type AppUserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  bio?: string;
  birthDate: string;
  images: UserImageListDto[];
};
