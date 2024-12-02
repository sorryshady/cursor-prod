import { Department, Designation, District, UserRole, CommitteeType, Gender, BloodGroup, UserStatus, VerificationStatus, StatePositionTitle } from '@prisma/client'


export type TableData = {
    membershipId: number;
    name: string;
    email: string;
    designation: Designation;
    department: Department;
    workDistrict: District;
    userRole: UserRole;
    committeeType: CommitteeType;
  };

  type VerifiedUserFields = {
    photoUrl: string;
    name: string;
    email: string;
    dob: Date;
    gender: Gender;
    bloodGroup: BloodGroup;
    userStatus: UserStatus;
    userRole: UserRole;
    department?: Department;
    designation?: Designation;
    officeAddress?: string;
    workDistrict?: District;
    personalAddress: string;
    homeDistrict: District;
    phoneNumber?: string;
    mobileNumber: string;
    verificationStatus: VerificationStatus;
  };

  type PendingUserFields = Omit<
    VerifiedUserFields,
    "userRole" | "department" | "designation" | "officeAddress" | "workDistrict"
  > & {
    userRole?: never;
    department?: never;
    designation?: never;
    officeAddress?: never;
    workDistrict?: never;
  };

  type ProfileUser = VerifiedUserFields | PendingUserFields;

  export type commiteeUser = {
    name: string;
    designation: Designation;
    membershipId: number;
    bloodGroup: BloodGroup;
    mobileNumber: string;
    personalAddress: string;
    positionState: StatePositionTitle;
    photoUrl: string;
  };

  export type { ProfileUser };
