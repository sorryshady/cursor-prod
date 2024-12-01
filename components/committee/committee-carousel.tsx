"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { StatePositionTitle, Department, Designation } from "@prisma/client";
import { Card } from "@/components/ui/card";

interface CommitteeMember {
  id: string;
  name: string;
  photoUrl: string | null;
  positionState: StatePositionTitle | null;
  designation: Designation | null;
  department: Department | null;
}

interface CommitteeCarouselProps {
  members: CommitteeMember[];
}

export function CommitteeCarousel({ members }: CommitteeCarouselProps) {
  const [autoplayPlugin] = useState(() =>
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  return (
    <Card className="w-full max-w-7xl mx-auto p-20 bg-gradient-to-b from-slate-700 to-slate-800 ">
      <Carousel
        plugins={[autoplayPlugin]}
        className="w-full max-w-7xl mx-auto "
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {members.map((member) => (
            <CarouselItem
              key={member.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="text-center">
                <div className="relative aspect-square lg:w-64 rounded-md overflow-hidden mx-auto mb-4">
                  <Image
                    src={member.photoUrl || "/member-placeholder.webp"}
                    alt={member.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="text-base text-white mb-1">{member.name}</h3>
                <p className="text-gray-400 text-sm capitalize">
                  {member.positionState?.replace(/_/g, " ").toLowerCase()}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </Card>
  );
}
