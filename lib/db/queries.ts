import { prisma } from "@/lib/db";
import { StatePositionTitle, CommitteeType, VerificationStatus, BloodGroup, DistrictPositionTitle } from "@prisma/client";

// Helper function to get position order
function getPositionOrder(position: StatePositionTitle): number {
  const orderMap: Record<StatePositionTitle, number> = {
    PRESIDENT: 0,
    VICE_PRESIDENT: 1,
    GENERAL_SECRETARY: 2,
    JOINT_SECRETARY: 3,
    TREASURER: 4,
    EDITOR: 5,
    IMMEDIATE_PAST_PRESIDENT: 6,
    IMMEDIATE_PAST_SECRETARY: 7,
    EXECUTIVE_COMMITTEE_MEMBER: 8,
    DISTRICT_NOMINEE: 9,
  };
  return orderMap[position] ?? 10;
}

interface CommitteeMember {
  id: string;
  name: string;
  photoUrl: string | null;
  positionState: StatePositionTitle | null;
  designation: string | null;
  department: string | null;
  bloodGroup: BloodGroup | null;
  positionDistrict: DistrictPositionTitle | null;
  mobileNumber: string | null;
  membershipId: number | null;
  personalAddress: string;
  email: string | null;
}

export async function getStateCommitteeMembers(excludeExecutive: boolean = false) {
  const whereClause = {
    committeeType: CommitteeType.STATE,
    verificationStatus: VerificationStatus.VERIFIED,
    ...(excludeExecutive && {
      NOT: {
        positionState: {
          in: [StatePositionTitle.EXECUTIVE_COMMITTEE_MEMBER, StatePositionTitle.DISTRICT_NOMINEE]
        }
      }
    })
  };

  const members = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      photoUrl: true,
      positionState: true,
      positionDistrict: true,
      designation: true,
      department: true,
      mobileNumber: true,
      membershipId: true,
      personalAddress: true,
      email: true,
      bloodGroup: true,
    },
    orderBy: {
      positionState: 'asc', // Basic ordering, we'll sort further in JS
    },
  });

  // Sort by custom position order
  return members.sort((a: CommitteeMember, b: CommitteeMember) => {
    if (!a.positionState || !b.positionState) return 0;
    return getPositionOrder(a.positionState) - getPositionOrder(b.positionState);
  });
}

export async function getDistrictCommitteeMembers() {
  const members = await prisma.user.findMany({
    where: {
      OR: [
        {
          committeeType: "DISTRICT",
          verificationStatus: "VERIFIED",
        },
        {
          committeeType: "STATE",
          positionDistrict: {
            not: null,
          },
          verificationStatus: "VERIFIED",
        },
      ],
    },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      positionDistrict: true,
      designation: true,
      department: true,
      workDistrict: true,
      bloodGroup: true,
      mobileNumber: true,
      membershipId: true,
      personalAddress: true,
      email: true,
    },
    orderBy: {
      positionDistrict: 'asc',
    },
  });

  return members;
}
