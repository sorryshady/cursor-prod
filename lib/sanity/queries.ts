import { client } from "@/lib/sanity";
import { Download, GalleryItem, NewsItem, Newsletter, UpcomingEvent } from "@/types/sanity";

export async function getGalleries(): Promise<GalleryItem[]> {
  return client.fetch(
    `*[_type == "gallery"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      images
    }`
  );
}

export async function getGalleryBySlug(slug: string): Promise<GalleryItem> {
  return client.fetch(
    `*[_type == "gallery" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      images
    }`,
    { slug }
  );
}

export async function getNewsletters(): Promise<Newsletter[]> {
  return client.fetch(
    `*[_type == "newsletter"] | order(date desc) {
      _id,
      title,
      date,
      "file": file.asset->url
    }`
  );
}

export async function getDownloads(category?: string): Promise<Download[]> {
  const filter = category ? `&& category == $category` : '';
  return client.fetch(
    `*[_type == "downloads" ${filter}] | order(_createdAt desc) {
      _id,
      title,
      category,
      "file": file.asset->url
    }`,
    { category }
  );
}

export async function getNews(limit?: number): Promise<NewsItem[]> {
  const limitFilter = limit ? `[0...${limit}]` : '';
  return client.fetch(
    `*[_type == "news"] | order(date desc) ${limitFilter} {
      _id,
      title,
      slug,
      date,
      description,
      content,
      image
    }`
  );
}

export function isEventOver(eventDate: string): boolean {
  const currentDate = new Date();
  const eventDateTime = new Date(eventDate);
  return eventDateTime < currentDate;
}

export async function getEvents(): Promise<UpcomingEvent[]> {
  const currentDate = new Date();
  const pastMonthDate = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1)
  );

  return client.fetch(
    `*[_type == "upcomingEvent" && date >= $pastMonthDate] | order(date desc) {
      _id,
      title,
      date,
      description,
      image
    }`,
    { pastMonthDate }
  );
}

export function separateEvents(events: UpcomingEvent[]): {
  upcomingEvents: UpcomingEvent[];
  pastEvents: UpcomingEvent[];
} {
  const currentDate = new Date();

  return {
    upcomingEvents: events.filter(
      event => new Date(event.date) >= currentDate
    ),
    pastEvents: events.filter(
      event => new Date(event.date) < currentDate
    ),
  };
}

export async function getNewsPaginated(page: number = 1, limit: number = 9) {
  const start = (page - 1) * limit;
  const end = start + limit;

  // Get total count for pagination
  const total = await client.fetch(
    `count(*[_type == "news"])`
  );

  // Get paginated news
  const news = await client.fetch(
    `*[_type == "news"] | order(date desc) [$start...$end] {
      _id,
      title,
      slug,
      date,
      description,
      image
    }`,
    { start, end }
  );

  return {
    news,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getNewsBySlug(slug: string) {
  return client.fetch(
    `*[_type == "news" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      date,
      description,
      content,
      image
    }`,
    { slug }
  );
}
