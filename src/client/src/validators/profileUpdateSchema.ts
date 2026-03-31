import * as yup from "yup";
import { GenderEnum } from "../helpers/enums/GenderEnum";

export const profileUpdateSchema = yup.object({
  firstName: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  birthDate: yup
    .string()
    .required("Birth date is required")
    .test("min-age", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      const birthDate = new Date(value);
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 18);
      return birthDate <= minAge;
    }),
  email: yup.string().email("Invalid email").required("Email is required"),
  gender: yup
    .mixed<GenderEnum>()
    .oneOf(Object.values(GenderEnum) as GenderEnum[])
    .required()
    .default(GenderEnum.Man),
  country: yup.string().optional().default(""),
  bio: yup.string().optional().default(""),
});

export type ProfileUpdateFormData = yup.InferType<typeof profileUpdateSchema>;
