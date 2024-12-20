import { Metadata } from "next";
import { getStateCommitteeMembers } from "@/lib/db/queries";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { CommitteeMemberCard } from "@/components/committee/committee-member-card";
import BackButton from "@/components/ui/back-button";

export const metadata: Metadata = {
  title: "State Committee | AOEK",
  description: "Meet all our State Committee Members",
};

export default async function StateCommitteePage() {
  // Fetch all state committee members (including executive committee)
  const stateMembers = await getStateCommitteeMembers(false);

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />

      <main className="relative z-10">
        <Wrapper className="py-20 relative">
          <BackButton label="Back to committee" />

          <PageHeader
            title="State Committee"
            description="Meet all our state committee members"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {stateMembers.map((member) => (
                <CommitteeMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
