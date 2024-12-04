import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Downloads | AOEK",
  description: "Access our downloads here",
};

export const categories = {
  "technical-writing": "Technical Writing",
  "circulars-and-orders": "Circulars & Orders",
  "election-nomination": "Election Nomination",
  "is-codes": "IS Codes",
  "irc-codes": "IRC Codes",
  handbooks: "Handbooks",
  others: "Others",
};

export default function Downloads() {
  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />
      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Downloads"
            description="Access our downloads here"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
            {Object.entries(categories).map(([key, value], index) => (
              <Card
                key={`${key}-${index}`}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <h2 className="text-xl font-semibold mb-4">{value}</h2>
                  <Link href={`/downloads/${key}`}>
                    <Button variant="secondary">View Downloads</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
