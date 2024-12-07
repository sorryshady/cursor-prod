import * as z from "zod";
import { parse, isValid } from "date-fns";
import {
  Gender,
  BloodGroup,
  UserStatus,
  Department,
  Designation,
  District,
  SecurityQuestionType,
} from "@prisma/client";

export const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((val) => {
      const date = parse(val, "dd/MM/yyyy", new Date());
      return (
        isValid(date) && date <= new Date() && date >= new Date("1900-01-01")
      );
    }, "Please enter a valid date in DD/MM/YYYY format"),
  gender: z.nativeEnum(Gender, { message: "Please select a gender" }),
  bloodGroup: z.nativeEnum(BloodGroup, {
    message: "Please select a blood group",
  }),
});

const workingSchema = z.object({
  department: z.nativeEnum(Department, {
    message: "Please select a department",
  }),
  designation: z.nativeEnum(Designation, {
    message: "Please select a designation",
  }),
  officeAddress: z.string().optional(),
  workDistrict: z.nativeEnum(District, { message: "Please select a work district" })
});

const retiredSchema = z.object({
  retiredDepartment: z.nativeEnum(Department, {
    message: "Please select a retired department"
  })
});

export const professionalInfoSchema = z.discriminatedUnion("userStatus", [
  z.object({
    userStatus: z.literal(UserStatus.WORKING),
    ...workingSchema.shape
  }),
  z.object({
    userStatus: z.literal(UserStatus.RETIRED),
    ...retiredSchema.shape
  })
]);

export const contactInfoSchema = z.object({
  personalAddress: z.string().min(1, "Personal address is required"),
  homeDistrict: z.nativeEnum(District),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
});

export const photoSchema = z.object({
  photoUrl: z.string().optional(),
  photoId: z.string().optional(),
});

export const registrationSchema = z.object({
  ...personalInfoSchema.shape,
}).and(professionalInfoSchema).and(z.object({
  ...contactInfoSchema.shape,
  ...photoSchema.shape,
}));

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Membership ID is required"),
  password: z.string().min(1, "Password is required"),
});

export const identifierSchema = z.object({
  identifier: z.string().min(1, "Email or Membership ID is required"),
});

export const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const setPasswordSchema = z
  .object({
    securityQuestion: z.nativeEnum(SecurityQuestionType),
    securityAnswer: z.string().min(1, "Security answer is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ProfessionalInfoInput = z.infer<typeof professionalInfoSchema>;
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type PhotoInput = z.infer<typeof photoSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type IdentifierInput = z.infer<typeof identifierSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
