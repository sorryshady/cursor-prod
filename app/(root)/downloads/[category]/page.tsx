import { Card, CardContent } from "@/components/ui/card";
import FileActions from "@/components/file-actions";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Metadata } from "next";
import BackButton from "@/components/ui/back-button";
import { getDownloadsByCategory } from "@/lib/sanity/queries";
import { categories } from "@/lib/utils";

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

export default async function CategoryDownloads({ params }: Props) {
  const { category } = await params;
  const downloads = await getDownloadsByCategory(category);
  const categoryName = (category.charAt(0).toUpperCase() + category.slice(1))
    .split("-")
    .join(" ");

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />
      <main className="relative z-10">
        <Wrapper className="py-20 relative">
          <BackButton label="Back to categories" />

          <PageHeader
            title={`${categoryName} Downloads`}
            description={`Access our ${categoryName.toLowerCase()} downloads here`}
            className="mb-12"
            titleClassName="text-white capitalize"
            descriptionClassName="text-gray-200"
          />

          {downloads.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
              {downloads.map((download, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="text-center p-8">
                    <h2 className="text-lg font-medium mb-2">
                      {download.title}
                    </h2>
                    <FileActions
                      fileUrl={download.fileUrl}
                      title={download.title}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-white text-lg">
                No downloads available for {categoryName.toLowerCase()} at the
                moment.
              </p>
            </div>
          )}
        </Wrapper>
      </main>
    </div>
  );
}
