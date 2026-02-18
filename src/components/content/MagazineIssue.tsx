import Link from "next/link";
import Image from "next/image";

interface MagazineIssueProps {
  number: number;
  title: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | string | null;
  articleCount?: number;
}

export function MagazineIssue({
  number,
  title,
  slug,
  description,
  coverImage,
  publishedAt,
  articleCount,
}: MagazineIssueProps) {
  return (
    <Link
      href={`/revista/${slug}`}
      className="group block shadow-card rounded-sm overflow-hidden hover:shadow-card-hover transition-all"
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-azul">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`${title} - Número ${number}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <span className="text-coral text-4xl font-black">[</span>
            <span className="text-lg font-bold">N.º {number}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-bold text-coral">N.º {number}</p>
        <h3 className="mt-1 text-sm font-bold text-azul leading-tight group-hover:text-coral transition-colors">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-acero line-clamp-2">{description}</p>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs text-acero-light">
          {publishedAt && (
            <span>
              {new Date(publishedAt).toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
          {articleCount !== undefined && (
            <>
              <span>·</span>
              <span>{articleCount} artículos</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
