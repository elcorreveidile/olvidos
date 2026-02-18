export type ContentStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

export interface ArticleSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  author: {
    name: string | null;
  };
  categories: Array<{
    category: {
      name: string;
      slug: string;
    };
  }>;
}

export interface ArticleFull extends ArticleSummary {
  content: string;
  featured: boolean;
  membersOnly: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  tags: Array<{
    tag: {
      name: string;
      slug: string;
    };
  }>;
  issue: {
    number: number;
    title: string;
    slug: string;
  } | null;
}

export interface MagazineIssueSummary {
  id: string;
  number: number;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  _count: {
    articles: number;
  };
}
