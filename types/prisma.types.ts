import { Prisma } from '@prisma/client'

// Enums
export type {
  District,
  Gender,
  BloodGroup,
  UserStatus,
  Department,
  Designation,
  CommitteeType,
  UserRole,
  VerificationStatus,
  StatePositionTitle,
  DistrictPositionTitle,
  SecurityQuestionType,
  RequestType,
} from '@prisma/client'

// Define User type from Prisma
export type User = Prisma.UserGetPayload<{}>

// Define other model types as needed
export type SecurityQuestion = Prisma.SecurityQuestionGetPayload<{}>
export type PromotionTransferRequest = Prisma.PromotionTransferRequestGetPayload<{}>
export type Obituary = Prisma.ObituaryGetPayload<{}> 
