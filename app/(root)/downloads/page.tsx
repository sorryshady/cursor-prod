import { Card, CardContent } from "@/components/ui/card";

import { client } from "@/lib/sanity";
import FileActions from "@/components/file-actions";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Downloads | AOEK",
  description: "Access our downloads here",
};
async function getData() {
  const query = `*[_type == "downloads"] | order(date desc) {
    title,
    category,
    "fileUrl": file.asset->url,
    date,
  }`;
  const data = await client.fetch(query);
  return data;
}

export type Newsletter = {
  title: string;
  category: string;
  fileUrl: string;
  date: string;
};
export default async function Downloads() {
  const newsletters: Newsletter[] = await getData();

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
            {newsletters.map((newsletter, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="text-center p-8">
                  <h2 className="text-lg font-medium">{newsletter.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(newsletter.date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <FileActions
                    fileUrl={newsletter.fileUrl}
                    title={newsletter.title}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
