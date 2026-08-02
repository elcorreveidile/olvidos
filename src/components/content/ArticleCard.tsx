import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { COVER_FIT_CONTAIN } from "@/lib/cover-position";

/** Marcador dedicado para los sonetos de Soneto500 (no llevan foto). */
function SonetoCover() {
  return (
    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-tinta px-6">
      <div
        aria-hidden
        className="absolute inset-y-6 left-6 right-6 flex flex-col justify-center gap-[6px]"
      >
        {[92, 80, 88, 70, 84, 64, 78].map((w, i) => (
          <span
            key={i}
            className="block h-px bg-white/15"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="relative text-center">
        <span className="block text-[11px] font-bold uppercase tracking-[0.35em] text-white/70">
          <span className="text-coral">[</span>Soneto
        </span>
        <span className="block font-editorial text-6xl font-black leading-none text-coral">
          500
        </span>
      </div>
    </div>
  );
}

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  /** Valor CSS `object-position` para recortar la portada en la caja. */
  coverPosition?: string | null;
  publishedAt?: Date | string | null;
  categories?: { name: string; slug: string }[];
  author?: { name: string | null } | null;
  /** Autores reales (firma) del artículo; tienen prioridad sobre `author`. */
  authors?: { author: { name: string | null; slug: string } }[];
  /** En páginas de categoría, resalta esa categoría en el marcador sin imagen. */
  highlightCategory?: string;
}

export function ArticleCard({
  title,
  slug,
  excerpt,
  coverImage,
  coverPosition,
  publishedAt,
  categories = [],
  author,
  authors = [],
  highlightCategory,
}: ArticleCardProps) {
  const primary =
    categories.find((c) => c.slug === highlightCategory) ?? categories[0];
  // La firma real (autores) tiene prioridad sobre el autor de WordPress.
  const firma =
    authors.length > 0
      ? authors.map((a) => a.author.name).filter(Boolean).join(" · ")
      : author?.name;

  return (
    <Link href={`/articulos/${slug}`} className="block article-card rounded-sm overflow-hidden">
      {coverImage ? (
        <div className="aspect-[16/10] relative overflow-hidden bg-tinta/[0.04]">
          <Image
            src={coverImage}
            alt={title}
            fill
            className={
              coverPosition === COVER_FIT_CONTAIN
                ? "object-contain"
                : "object-cover"
            }
            style={
              coverPosition === COVER_FIT_CONTAIN
                ? undefined
                : { objectPosition: coverPosition || "center" }
            }
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : categories.some((c) => c.slug === "sonetos") ? (
        <SonetoCover />
      ) : (
        <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 bg-gradient-to-br from-coral/[0.10] to-coral/[0.02] px-4 text-center">
          <span className="select-none text-xl font-black leading-none tracking-tight text-coral/30">
            <span>[</span>olvidos
          </span>
          {primary && (
            <span className="text-2xl font-black leading-tight text-coral">
              <span>[</span>
              {primary.name}
            </span>
          )}
        </div>
      )}
      <div className="p-6">
        {categories.length > 0 && (
          <div className="text-xs font-bold text-coral">
            {categories.map((c, i) => (
              <span key={c.slug}>
                <span className="category-bracket">{c.name}</span>
                {i < categories.length - 1 && <span className="mr-1">,</span>}
              </span>
            ))}
          </div>
        )}
        <h3 className="article-card-title mt-2 text-lg font-bold text-tinta leading-tight">
          {title}
        </h3>
        {excerpt && (
          <p className="article-card-excerpt mt-2 text-sm text-acero leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="article-card-meta mt-4 flex items-center gap-2 text-xs text-acero-light">
          {firma && <span>{firma}</span>}
          {firma && publishedAt && <span>·</span>}
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
        </div>
      </div>
    </Link>
  );
}
