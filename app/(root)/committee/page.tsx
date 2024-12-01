import { Metadata } from "next";
import Link from "next/link";
import { getStateCommitteeMembers, getDistrictCommitteeMembers } from "@/lib/db/queries";
import { CommitteeCarousel } from "@/components/committee/committee-carousel";
import { DistrictSelector } from "@/components/committee/district-selector";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Committee | AOEK",
  description: "Meet our State and District Committee Members",
};

export default async function CommitteePage() {
  // Fetch both state and district committee members
  const stateMembers = await getStateCommitteeMembers(true);
  const districtMembers = await getDistrictCommitteeMembers();

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" className="opacity-10" />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Committee"
            description="Meet our dedicated committee members"
            className="mb-12"
            titleClassName="text-black"
            descriptionClassName="text-muted-foreground"
          />

          {/* State Committee Section */}
          <section className="mb-20">
            <h2 className="text-2xl font-semibold text-center text-black mb-8">
              State Committee
            </h2>

            <CommitteeCarousel members={stateMembers} />

            <div className="mt-8 text-center w-fit mx-auto">
              <Link href="/committee/state-committee" className="mx-auto">
                <Button
                  variant="secondary"
                  className="flex items-center gap-2 bg-[#2d4153] text-white hover:bg-[#375169]"
                >
                  View All Members
                </Button>
              </Link>
            </div>
          </section>

          {/* District Committee Section */}
          <section>
            <h2 className="text-2xl font-semibold text-center text-black mb-8">
              District Committee
            </h2>
            <DistrictSelector members={districtMembers} />
          </section>
        </Wrapper>
      </main>
    </div>
  );
}
