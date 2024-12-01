import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { urlFor } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import type { NewsItem } from "@/types/sanity";

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={
              news.image ? urlFor(news.image).url() : "/news-placeholder.webp"
            }
            alt={news.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="text-sm text-gray-500 mb-2">
          {formatDate(news.date)}
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {news.title}
        </h3>
        <p className="text-gray-600 line-clamp-3">{news.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link
          href={`/news/${news.slug.current}`}
          className="text-[#35718E] hover:text-[#5386A4] font-medium"
        >
          Read More →
        </Link>
      </CardFooter>
    </Card>
  );
}
