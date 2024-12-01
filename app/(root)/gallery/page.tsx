import { Metadata } from "next";
import { getGalleryCategories } from "@/lib/sanity/queries";
import { GalleryCarousel } from "@/components/gallery/gallery-carousel";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Gallery | AOEK",
  description: "Browse through our collection of memories",
};

export default async function GalleryPage() {
  const categories = await getGalleryCategories();

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Gallery"
            description="Browse through our collection of memories"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          <GalleryCarousel categories={categories} />
        </Wrapper>
      </main>
    </div>
  );
}
