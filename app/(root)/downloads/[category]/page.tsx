import { Card, CardContent } from "@/components/ui/card";
import { client } from "@/lib/sanity";
import FileActions from "@/components/file-actions";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Metadata } from "next";
import BackButton from "@/components/ui/back-button";
import { categories } from "../page";
import { getDownloadsByCategory } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ category: string }>;
};
export const revalidate = 86400;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Downloads | AOEK`,
    description: `Access our ${category} downloads here`,
  };
}

export async function generateStaticParams() {
  return Object.entries(categories).map(([key]) => ({
    category: key.toLowerCase().split(" ").join("-"),
  }));
}

export type Download = {
  title: string;
  category: string;
  fileUrl: string;
  date: string;
};

export default async function CategoryDownloads({ params }: Props) {
  const { category } = await params;
  const downloads = await getDownloadsByCategory(category);
  console.log(downloads);
  const categoryName = (category.charAt(0).toUpperCase() + category.slice(1))
    .split("-")
    .join(" ");

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />
      <main className="relative z-10">
        <Wrapper className="py-20 relative">
          <BackButton href="/downloads" label="Back to categories" />

          <PageHeader
            title={`${categoryName} Downloads`}
            description={`Access our ${categoryName.toLowerCase()} downloads here`}
            className="mb-12"
            titleClassName="text-white capitalize"
            descriptionClassName="text-gray-200"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
            {downloads.map((download, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="text-center p-8">
                  <h2 className="text-lg font-medium mb-2">{download.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {new Date(download.date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <FileActions
                    fileUrl={download.fileUrl}
                    title={download.title}
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
