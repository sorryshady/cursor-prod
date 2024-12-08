import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Wrapper } from "@/components/layout/wrapper";
import { UpdateSelector } from "@/components/updates/update-selector";

import { Designation, District, User } from "@prisma/client";
export type Promotions = {
  oldPosition: Designation;
  newPosition: Designation;
  user: User;
};
export type Transfers = {
  oldWorkDistrict: District;
  newWorkDistrict: District;
  oldPosition: Designation;
  user: User;
};
export type Retirements = {
  retirementDate: Date;
  oldPosition: Designation;
  user: User;
};
export type Obituaries = {
  dateOfDeath: Date;
  additionalNote: string;
  user: User & {
    designation: Designation;
  };
};

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Updates",
  description:
    "Latest updates among the staff, including transfers, promotions, retirements, and obituaries.",
  keywords: [
    "updates",
    "staff",
    "transfers",
    "promotions",
    "retirements",
    "obituaries",
  ],
  openGraph: {
    title: "Updates",
    description: "Stay informed with the latest updates among the staff.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/updates`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Updates",
    description: "Latest updates among the staff.",
  },
};

async function getData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/general`,
  );
  const data = await response.json();
  const {
    promotions,
    transfers,
    retirements,
    obituaries,
  }: {
    promotions: Promotions[];
    transfers: Transfers[];
    retirements: Retirements[];
    obituaries: Obituaries[];
  } = data;
  return { promotions, transfers, retirements, obituaries };
}

export default async function Updates() {
  const { promotions, transfers, retirements, obituaries } = await getData();

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />
      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Updates"
            description="Latest updates among the staff"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          <UpdateSelector
            transfers={transfers}
            promotions={promotions}
            retirements={retirements}
            obituaries={obituaries}
          />
        </Wrapper>
      </main>
    </div>
  );
}
