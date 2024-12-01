import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNewsBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";

interface NewsSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = false;

export async function generateMetadata({
  params,
}: NewsSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: "News Not Found | AOEK",
    };
  }

  return {
    title: `${news.title} | AOEK News`,
    description: news.description,
    openGraph: {
      title: news.title,
      description: news.description,
      images: news.image
        ? [
            {
              url: urlFor(news.image).url(),
              width: 1200,
              height: 630,
              alt: news.title,
            },
          ]
        : [],
    },
  };
}

export default async function NewsSlugPage({ params }: NewsSlugPageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />

      <Wrapper className="relative z-10 py-20">
        {/* Back Button */}
        <div className="absolute top-5 left-4 md:left-8 lg:left-12">
          <Button
            asChild
            size="icon"
            className="h-10 w-10 bg-white text-black hover:bg-white/80 "
          >
            <Link href="/news" aria-label="Back to news">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <p className="text-gray-200 mb-2">{formatDate(news.date)}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {news.title}
            </h1>
            <p className="text-gray-200 text-lg">{news.description}</p>
          </div>

          {/* Featured Image */}

          <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-8">
            <Image
              src={
                news.image ? urlFor(news.image).url() : "/news-placeholder.webp"
              }
              alt={news.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none text-white">
            <PortableText value={news.content} />
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
