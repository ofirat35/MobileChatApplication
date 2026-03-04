import { GenderEnum } from "../../helpers/enums/GenderEnum";

export type RegisterModel = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: GenderEnum;
  // bio: string;
  birthDate: string;
};
