import { Metadata } from "next";
import Image from "next/image";
import { getGalleryBySlug } from "@/lib/sanity/queries";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { notFound } from "next/navigation";
import { urlFor } from "@/lib/sanity";
import BackButton from "@/components/ui/back-button";

export const revalidate = 86400; // Revalidate daily

// Note: The dynamic metadata with slug is already handled by the generateMetadata function below

interface GallerySlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: GallerySlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery) {
    return {
      title: "Gallery Not Found | AOEK",
    };
  }

  return {
    title: `${gallery.title} | Gallery | AOEK`,
  };
}

export default async function GallerySlugPage({
  params,
}: GallerySlugPageProps) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" className="opacity-10" />

      <main className="relative z-10">
        <Wrapper className="py-20 relative">
          <BackButton label="Back to gallery" type="black" />

          <PageHeader
            title={gallery.title}
            description="Browse through the images in this gallery"
            className="mb-12"
            titleClassName="text-black"
            descriptionClassName="text-muted-foreground"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <Image
                  src={urlFor(image).url()}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 6}
                />
              </div>
            ))}
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
