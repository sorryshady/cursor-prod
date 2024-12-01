"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { wrap } from "popmotion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryCategory {
  title: string;
  slug: { current: string };
  firstImage: {
    asset: {
      url: string;
      metadata: {
        dimensions: { width: number; height: number };
      };
    };
  };
}

interface GalleryCarouselProps {
  categories: GalleryCategory[];
}

export function GalleryCarousel({ categories }: GalleryCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const categoryIndex = wrap(0, categories.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      scale: 0.8,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      scale: 1,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      scale: 0.8,
      opacity: 0
    })
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 z-10 p-2 bg-white/20 rounded-full backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute w-[500px] h-[400px]"
          >
            <Link href={`/gallery/${categories[categoryIndex].slug.current}`}>
              <div className="relative w-full h-full">
                <Image
                  src={categories[categoryIndex].firstImage.asset.url}
                  alt={categories[categoryIndex].title}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-white text-xl font-semibold text-center">
                    {categories[categoryIndex].title}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => paginate(1)}
          className="absolute right-4 z-10 p-2 bg-white/20 rounded-full backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
} 
