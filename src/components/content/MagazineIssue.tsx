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
  /** Oculta el badge "N.º" (para preolvidos y separatas con numeración sentinel). */
  hideNumber?: boolean;
}

export function MagazineIssue({
  number,
  title,
  slug,
  description,
  coverImage,
  publishedAt,
  articleCount,
  hideNumber = number < 1 || number >= 100,
}: MagazineIssueProps) {
  return (
    <Link
      href={`/revista/${slug}`}
      className="group block overflow-hidden rounded-sm shadow-card transition-all hover:shadow-card-hover"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-tinta">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={hideNumber ? title : `Olvidos n.º ${number}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
            <span className="text-4xl font-black text-coral">[</span>
            <span className="text-lg font-bold">
              {hideNumber ? title : `N.º ${number}`}
            </span>
          </div>
        )}
        {/* Badge de número sobre la portada, guiño a la galería original */}
        {!hideNumber && (
          <span className="absolute bottom-0 left-0 bg-tinta/85 px-3 py-1 text-2xl font-black leading-none text-white">
            {number}
          </span>
        )}
      </div>
      <div className="p-4">
        {!hideNumber && (
          <p className="text-xs font-bold text-coral">N.º {number}</p>
        )}
        <h3 className="mt-1 text-sm font-bold leading-tight text-tinta transition-colors group-hover:text-coral">
          {title}
        </h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs text-acero">{description}</p>
        )}
        {articleCount !== undefined && articleCount > 0 && (
          <div className="mt-2 text-xs text-acero-light">
            <span>{articleCount} artículos</span>
          </div>
        )}
      </div>
    </Link>
  );
}
