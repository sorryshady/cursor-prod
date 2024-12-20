import { client } from "@/lib/sanity";
import {
  Download,
  GalleryItem,
  NewsItem,
  Newsletter,
  UpcomingEvent,
} from "@/types/sanity";

export async function getGalleries(): Promise<GalleryItem[]> {
  return client.fetch(
    `*[_type == "gallery"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      images
    }`,
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
    { slug },
  );
}

export async function getNewsletters(): Promise<Newsletter[]> {
  return client.fetch(
    `*[_type == "newsletter"] | order(date desc) {
      _id,
      title,
      date,
      "file": file.asset->url
    }`,
  );
}

export async function getDownloadsByCategory(
  category: string,
): Promise<Download[]> {
  return client.fetch(
    `*[_type == "downloads" && category == $category] | order(_createdAt desc) {
          _id,
          title,
          category,
          "fileUrl": file.asset->url
        }`,
    { category }, // Bind category variable correctly
  );
}

export async function getNews(limit?: number): Promise<NewsItem[]> {
  const limitFilter = limit ? `[0...${limit}]` : "";
  return client.fetch(
    `*[_type == "news"] | order(date desc) ${limitFilter} {
      _id,
      title,
      slug,
      date,
      description,
      content,
      image
    }`,
  );
}

export function isEventOver(eventDate: string): boolean {
  const currentDate = new Date();
  const eventDateTime = new Date(eventDate);
  return eventDateTime < currentDate;
}

export async function getEvents() {
  const currentDate = new Date();
  const pastMonthDate = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1),
  );
  // Fetch events from past month to future
  const events = await client.fetch(
    `*[_type == "upcomingEvent" && dateRange.startDate >= $pastMonthDate] | order(dateRange.startDate asc) {
      _id,
      title,
      dateRange,
      location,
      link,
      description,
      image,
    }`,
    { pastMonthDate },
  );

  // Use existing separateEvents function to split them
  return separateEvents(events);
}

export function separateEvents(events: UpcomingEvent[]): {
  upcomingEvents: UpcomingEvent[];
  ongoingEvents: UpcomingEvent[];
  pastEvents: UpcomingEvent[];
} {
  const currentDate = new Date();

  return {
    upcomingEvents: events
      .filter((event) => {
        return new Date(event.dateRange.startDate) > currentDate;
      })
      .sort((a, b) =>
        new Date(a.dateRange.startDate).getTime() - new Date(b.dateRange.startDate).getTime()
      ), // Ascending for upcoming
    ongoingEvents: events
      .filter((event) => {
        const startDate = new Date(event.dateRange.startDate);
        const endDate = new Date(event.dateRange.endDate || event.dateRange.startDate);
        return startDate <= currentDate && endDate >= currentDate;
      })
      .sort((a, b) =>
        new Date(a.dateRange.startDate).getTime() - new Date(b.dateRange.startDate).getTime()
      ), // Ascending for ongoing
    pastEvents: events
      .filter((event) => {
        const endDate = event.dateRange.endDate || event.dateRange.startDate;
        return new Date(endDate) < currentDate;
      })
      .sort((a, b) =>
        new Date(b.dateRange.startDate).getTime() - new Date(a.dateRange.startDate).getTime()
      ), // Descending for past
  };
}

export async function getNewsPaginated(page: number = 1, limit: number = 9) {
  const start = (page - 1) * limit;
  const end = start + limit;

  // Get total count for pagination
  const total = await client.fetch(`count(*[_type == "news"])`);

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
    { start, end },
  );

  return {
    news,
    total,
    totalPages: Math.ceil(total / limit),
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
    { slug },
  );
}

export async function getGalleryCategories() {
  return client.fetch(`
    *[_type == "gallery"] {
      title,
      slug,
      "firstImage": images[0] {
        asset->{
          url,
          metadata {
            dimensions
          }
        }
      }
    }
  `);
}
