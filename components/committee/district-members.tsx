import {
  Department,
  Designation,
  DistrictPositionTitle,
  District,
  BloodGroup,
} from "@prisma/client";
import { CommitteeMemberCard } from "./committee-member-card";

interface DistrictMembersProps {
  members: DistrictMemberType[];
}

interface DistrictMemberType {
  id: string;
  name: string;
  photoUrl: string | null;
  positionDistrict: DistrictPositionTitle | null;
  designation: Designation | null;
  department: Department | null;
  workDistrict: District | null;
  bloodGroup: BloodGroup;
  email: string;
  mobileNumber: string;
  membershipId: number | null;
  personalAddress: string;
}

export function DistrictMembers({ members }: DistrictMembersProps) {
  if (members.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 bg-white/5 rounded-lg">
        <p>No committee members found for this district.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {members.map((member) => (
        <CommitteeMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
