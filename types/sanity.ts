import { Image, Slug } from "@sanity/types";
import { PortableTextBlock } from "@portabletext/types";

export interface Download {
  _id: string;
  title: string;
  category: 'technicalWriting' | 'circulars' | 'electionNomination' | 'isCodes' | 'ircCodes' | 'handbooks' | 'others';
  file: {
    asset: {
      url: string;
    };
  };
}

export interface GalleryItem {
  _id: string;
  title: string;
  slug: Slug;
  images: Array<{
    asset: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  }>;
}

export interface NewsItem {
  _id: string;
  title: string;
  slug: Slug;
  date: string;
  description?: string;
  content: PortableTextBlock[];
  image?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  };
}

export interface Newsletter {
  _id: string;
  title: string;
  date: string;
  file: {
    asset: {
      url: string;
    };
  };
}

export interface UpcomingEvent {
  _id: string;
  title: string;
  date: string;
  description: string;
  image?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  };
}