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
import { Calendar, Info } from "lucide-react";

interface EventCardProps {
  event: UpcomingEvent;
}

export function EventCard({ event }: EventCardProps) {
  const isUpcoming = new Date(event.date) >= new Date();

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-lg flex h-[280px] ${
        !isUpcoming ? "opacity-75 hover:opacity-100" : ""
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
            isUpcoming ? "hover:scale-105" : "grayscale hover:grayscale-0"
          }`}
          sizes="(max-width: 768px) 45vw, 25vw"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={isUpcoming ? "default" : "secondary"}>
            {isUpcoming ? "Upcoming" : "Past Event"}
          </Badge>
        </div>
      </div>

      {/* Content Section - Right Half */}
      <CardContent className="flex-1 p-6 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4" />
          <time dateTime={event.date}>{formatDate(event.date)}</time>
        </div>

        <h3
          className={`text-2xl font-semibold mb-4 line-clamp-2 ${
            isUpcoming ? "text-[#35718E]" : "text-gray-700"
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="mb-4">{event.title}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                <time dateTime={event.date}>{formatDate(event.date)}</time>
              </div>
            </DialogHeader>
            <div className="relative w-full aspect-video mb-4">
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
