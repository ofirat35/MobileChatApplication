import { GenderEnum } from "../../helpers/enums/GenderEnum";

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
};
