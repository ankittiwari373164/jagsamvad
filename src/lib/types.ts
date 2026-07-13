export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type Author = {
  id: string;
  user_id: string | null;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  twitter_url: string | null;
  created_at: string;
};

export type ArticleStatus = "draft" | "published";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  author_id: string | null;
  status: ArticleStatus;
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[];
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticleWithRelations = Article & {
  category: Category | null;
  author: Author | null;
};

export const SITE_NAME = "Jagsamvad";
export const SITE_TAGLINE = "जहाँ की बात, हर पल की खबर";
export const SITE_LOCATION = "New Delhi, India";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.jagsamvad.com";
