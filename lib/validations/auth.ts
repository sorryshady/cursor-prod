import * as z from "zod"
import { parse, isValid } from "date-fns"
import {
  Gender,
  BloodGroup,
  UserStatus,
  Department,
  Designation,
  District
} from "@prisma/client"

export const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.string()
    .min(1, "Date of birth is required.")
    .refine((val) => {
      const date = parse(val, "dd/MM/yyyy", new Date());
      return (
        isValid(date) &&
        date <= new Date() &&
        date >= new Date("1900-01-01")
      );
    }, "Please enter a valid date in DD/MM/YYYY format"),
  gender: z.nativeEnum(Gender),
  bloodGroup: z.nativeEnum(BloodGroup),
})

export const professionalInfoSchema = z.object({
  userStatus: z.nativeEnum(UserStatus),
  department: z.nativeEnum(Department).optional(),
  designation: z.nativeEnum(Designation).optional(),
  officeAddress: z.string().optional(),
  workDistrict: z.nativeEnum(District).optional(),
})

export const contactInfoSchema = z.object({
  personalAddress: z.string().min(1, "Personal address is required"),
  homeDistrict: z.nativeEnum(District),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
})

export const photoSchema = z.object({
  photoUrl: z.string().optional(),
  photoId: z.string().optional(),
})

export const registrationSchema = z.object({
  ...personalInfoSchema.shape,
  ...professionalInfoSchema.shape,
  ...contactInfoSchema.shape,
  ...photoSchema.shape,
})

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>
export type ProfessionalInfoInput = z.infer<typeof professionalInfoSchema>
export type ContactInfoInput = z.infer<typeof contactInfoSchema>
export type PhotoInput = z.infer<typeof photoSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
