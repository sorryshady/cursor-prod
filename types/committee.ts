import { District, BloodGroup, DistrictPositionTitle, Designation, Department } from "@prisma/client";

export interface DistrictMemberType {
  id: string;
  name: string;
  photoUrl: string | null;
  positionDistrict: DistrictPositionTitle | null;
  designation: Designation | null;
  department: Department | null;
  workDistrict: District | null;
  bloodGroup: BloodGroup | null;
  email: string | null;
  mobileNumber: string | null;
  membershipId: number | null;
  personalAddress: string | null;
}
