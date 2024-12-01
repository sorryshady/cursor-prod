import { Metadata } from "next";
import { getNewsPaginated } from "@/lib/sanity/queries";
import { NewsCard } from "@/components/news/news-card";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { NewsItem } from "@/types/sanity";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Latest News | AOEK",
  description:
    "Stay updated with the latest news and updates from the Association of Engineers Kerala.",
  openGraph: {
    title: "Latest News | AOEK",
    description:
      "Stay updated with the latest news and updates from the Association of Engineers Kerala.",
    images: [
      {
        url: "/og-news.jpg",
        width: 1200,
        height: 630,
        alt: "AOEK News",
      },
    ],
  },
};

interface NewsPageProps {
  searchParams: Promise<{ page?: string }>;
}

// News listing page - revalidate daily
export const revalidate = 86400; // 24 hours in seconds

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 9;

  const { news, totalPages } = await getNewsPaginated(currentPage, limit);

  // Throw error if page number is invalid
  if (currentPage > totalPages) {
    throw new Error("Page not found");
  }

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Latest News"
            description="Stay updated with our latest announcements"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((newsItem: NewsItem) => (
              <NewsCard key={newsItem._id} news={newsItem} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center gap-2">
            <Link
              href={currentPage === 1 ? "#" : `/news?page=${currentPage - 1}`}
              className={cn(
                "w-24",
                currentPage === 1 ? "pointer-events-none opacity-50" : "",
              )}
            >
              <Button
                variant="outline"
                disabled={currentPage === 1}
                className="w-full"
              >
                Previous
              </Button>
            </Link>
            <span className="flex items-center px-4 text-white min-w-[120px] justify-center">
              Page {currentPage} of {totalPages}
            </span>
            <Link
              href={
                currentPage === totalPages
                  ? "#"
                  : `/news?page=${currentPage + 1}`
              }
              className={cn(
                "w-24",
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "",
              )}
            >
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                className="w-full"
              >
                Next
              </Button>
            </Link>
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
