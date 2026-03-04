import { GenderEnum } from "../../helpers/enums/GenderEnum";

export type PreferenceUpdateModel = {
  id: string | null;
  minAge: number | null;
  maxAge: number | null;
  country: string | null;
  gender: GenderEnum | null;
};
