import { prisma } from "@/lib/db";
import { StatePositionTitle, CommitteeType, VerificationStatus } from "@prisma/client";

// Helper function to get position order
function getPositionOrder(position: StatePositionTitle): number {
  const orderMap = {
    PRESIDENT: 0,
    VICE_PRESIDENT: 1,
    GENERAL_SECRETARY: 2,
    JOINT_SECRETARY: 3,
    TREASURER: 4,
    EDITOR: 5,
    IMMEDIATE_PAST_PRESIDENT: 6,
    IMMEDIATE_PAST_SECRETARY: 7,
    EXECUTIVE_COMMITTEE_MEMBER: 8,
  };
  return orderMap[position] ?? 9;
}

interface CommitteeMember {
  id: string;
  name: string;
  photoUrl: string | null;
  positionState: StatePositionTitle | null;
  designation: string | null;
  department: string | null;
}

export async function getStateCommitteeMembers(excludeExecutive: boolean = false) {
  const whereClause = {
    committeeType: CommitteeType.STATE,
    verificationStatus: VerificationStatus.VERIFIED,
    ...(excludeExecutive && {
      NOT: {
        positionState: StatePositionTitle.EXECUTIVE_COMMITTEE_MEMBER
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
      designation: true,
      department: true,
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