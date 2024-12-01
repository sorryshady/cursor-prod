import { District, BloodGroup, DistrictPositionTitle, Designation, Department } from "@prisma/client";

export interface DistrictMemberType {
  id: string;
  name: string;
  photoUrl: string | null;
  positionDistrict: DistrictPositionTitle | null;
  designation: Designation | null;
  department: Department | null;
  workDistrict: District;
  bloodGroup: BloodGroup;
  email: string;
  mobileNumber: string;
  membershipId: number | null;
  personalAddress: string;
}
