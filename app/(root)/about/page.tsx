import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Wrapper } from "@/components/layout/wrapper";
import Image from "next/image";

export default function About() {
  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" className="opacity-10" />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="About Us"
            description="Learn more about our organization"
            className="mb-12"
            titleClassName="text-black"
            descriptionClassName="text-muted-foreground"
          />

          <div className="flex justify-center items-center my-6">
            <Image
              src={"/aoek-logo.webp"}
              alt="logo"
              width={400}
              height={200}
            />
          </div>
          <div className="text-black text-center px-4 text-lg">
            <p>
              The Public Works, Irrigation & Local Self Government Departments
              of Government of Kerala have united over a common goal and formed
              a non-profit organization with over 3000 engineers. This
              organization provides free technical materials for the public and
              civil engineers in the private sector, technical papers from its
              members, and government circulars and orders related to
              construction and infrastructural development.
            </p>
            <p className="mt-4">
              Formed in the <span className="font-semibold">year 1963</span> and
              united by a shared vision, this organization aims to work towards
              the welfare of engineers in these departments. The Association
              actively engages in contributing to the development and progress
              of the State of Kerala, as its members are working in departments
              which are the major execution agencies of public works of the
              State.
            </p>
            <p className="mt-4">
              The retired Engineers will also continue to be the life members of
              the Association attached to a district centre where their
              residence is located or a district of their choice. However, they
              will not have voting rights unless elected as State Executive
              Committee members. A State Executive Committee with 46 members
              having a term of one calendar year is the authority entrusted by
              the General body to take a final decision on all matters related
              to the Association. The Association has district centres in all
              the 14 districts of the State established as per the bye law. The
              State Executive Committee meetings are conducted every month in
              various districts as per a prefixed schedule.
            </p>
            <p className="mt-4">
              Three volumes of newsletters publishing every calendar year act as
              an effective mode of communication to its members about the
              activities of the Association.
            </p>
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
