import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { urlFor } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import { UpcomingEvent } from "@/types/sanity";
import { Badge } from "@/components/ui/badge";
import { Calendar, Info, MapPin, Link as LinkIcon } from "lucide-react";

interface EventCardProps {
  event: UpcomingEvent;
}

function formatDateRange(startDate: string, endDate?: string) {
  const start = formatDate(startDate);
  if (!endDate || startDate === endDate) {
    return start;
  }
  return `${start} - ${formatDate(endDate)}`;
}

export function EventCard({ event }: EventCardProps) {
  const currentDate = new Date();
  const startDate = new Date(event.dateRange.startDate);
  const endDate = event.dateRange.endDate
    ? new Date(event.dateRange.endDate)
    : startDate;

  // Determine event status
  const isUpcoming = startDate > currentDate;
  const isOngoing = startDate <= currentDate && endDate >= currentDate;
  const isPast = endDate < currentDate;

  // Get status text and color
  const getStatusDetails = () => {
    if (isUpcoming)
      return {
        text: "Upcoming",
        variant: "default" as const,
        bgColor: "bg-[#17374A]",
      };
    if (isOngoing)
      return {
        text: "Ongoing",
        variant: "default" as const,
        bgColor: "bg-[#35718E]",
      };
    return { text: "Past Event", variant: "secondary" as const, bgColor: "" };
  };

  const status = getStatusDetails();

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-lg flex h-[280px] ${
        isPast ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      {/* Image Section - Left Half */}
      <div className="relative w-[45%] h-full overflow-hidden">
        <Image
          src={
            event.image ? urlFor(event.image).url() : "/news-placeholder.webp"
          }
          alt={event.title}
          fill
          className={`object-cover transition-transform duration-300 ${
            !isPast ? "hover:scale-105" : "grayscale hover:grayscale-0"
          }`}
          sizes="(max-width: 768px) 45vw, 25vw"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={status.variant} className={status.bgColor}>
            {status.text}
          </Badge>
        </div>
      </div>

      {/* Content Section - Right Half */}
      <CardContent className="flex-1 p-6 flex flex-col justify-center">
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={event.dateRange.startDate}>
              {formatDateRange(
                event.dateRange.startDate,
                event.dateRange.endDate,
              )}
            </time>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          {event.link && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LinkIcon className="h-4 w-4" />
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {event.link}
              </a>
            </div>
          )}
        </div>

        <h3
          className={`text-2xl font-semibold mb-4 line-clamp-2 ${
            !isPast ? "text-[#35718E]" : "text-gray-700"
          }`}
        >
          {event.title}
        </h3>

        <p className="text-muted-foreground line-clamp-3 text-base mb-4">
          {event.description}
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-fit p-0 h-auto text-[#35718E] hover:text-[#35718E]/80"
            >
              <Info className="h-4 w-4" />
              <span>View Details</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] md:max-w-[500px] rounded-md">
            <DialogHeader>
              <DialogTitle className="mb-4">{event.title}</DialogTitle>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={event.dateRange.startDate}>
                    {formatDateRange(
                      event.dateRange.startDate,
                      event.dateRange.endDate,
                    )}
                  </time>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.link && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {event.link}
                    </a>
                  </div>
                )}
              </div>
            </DialogHeader>
            <div className="relative w-full aspect-video mb-4 overflow-hidden rounded-lg">
              <Image
                src={
                  event.image
                    ? urlFor(event.image).url()
                    : "/news-placeholder.webp"
                }
                alt={event.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="text-muted-foreground">{event.description}</p>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
