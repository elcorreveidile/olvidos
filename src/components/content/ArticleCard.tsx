import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | string | null;
  category?: { name: string; slug: string } | null;
  author?: { name: string | null } | null;
}

export function ArticleCard({
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  category,
  author,
}: ArticleCardProps) {
  return (
    <Link href={`/articulos/${slug}`} className="block article-card rounded-sm overflow-hidden">
      {coverImage && (
        <div className="aspect-[16/10] relative overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      {!coverImage && <div className="aspect-[16/10] bg-gray-100" />}
      <div className="p-6">
        {category && (
          <span className="text-xs font-bold text-coral category-bracket">
            {category.name}
          </span>
        )}
        <h3 className="article-card-title mt-2 text-lg font-bold text-azul leading-tight">
          {title}
        </h3>
        {excerpt && (
          <p className="article-card-excerpt mt-2 text-sm text-acero leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="article-card-meta mt-4 flex items-center gap-2 text-xs text-acero-light">
          {author?.name && <span>{author.name}</span>}
          {author?.name && publishedAt && <span>·</span>}
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
        </div>
      </div>
    </Link>
  );
}
