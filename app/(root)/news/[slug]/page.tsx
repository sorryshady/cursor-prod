import { Metadata } from "next";
import Image from "next/image";
import BackButton from "@/components/ui/back-button";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
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
      description: "The news article you are looking for does not exist.",
      openGraph: {
        title: "News Not Found | AOEK",
        description: "The news article you are looking for does not exist.",
        images: [],
      },
    };
  }

  return {
    title: `${news.title} | AOEK News`,
    description: news.description,
    keywords: news.keywords || "AOEK, News, Latest Updates",
    authors: news.author || "AOEK Team",
    openGraph: {
      title: news.title,
      description: news.description,
      url: `https://aoek.com/news/${slug}`,
      type: "article",
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
      siteName: "AOEK News",
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
        <BackButton href="/news" label="Back to news" />

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
