import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Wrapper } from "@/components/layout/wrapper";
import { client } from "@/lib/sanity";
import FileActions from "@/components/file-actions";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Newsletter } from "../downloads/page";

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

export default async function NewsletterPage() {
  const newsletters: Newsletter[] = await getData();

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />
      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Newsletter"
            description="Access our newsletter here"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
            {newsletters.map((newsletter, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="flex items-center justify-center p-6">
                  <Image
                    src="/abridge.webp"
                    alt="Abridge Logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                </CardHeader>
                <CardContent className="text-center">
                  <h2 className="text-lg font-medium">{newsletter.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(newsletter.date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>

                <FileActions
                  fileUrl={newsletter.fileUrl}
                  title={newsletter.title}
                />
              </Card>
            ))}
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
