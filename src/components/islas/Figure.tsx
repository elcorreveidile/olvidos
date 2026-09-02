import Image from "next/image";
import type { FigureData } from "@/lib/con-textos/islas-def";
import { isCommonsUrl } from "@/lib/con-textos/images";

/**
 * Isla «figura»: imagen de dominio público o con licencia libre (Wikimedia
 * Commons) con pie, crédito y licencia. Sin JavaScript.
 */
export function Figure({ data }: { data: FigureData }) {
  const sizes = data.wide ? "(max-width: 1024px) 100vw, 1200px" : "(max-width: 1024px) 100vw, 695px";
  return (
    <figure className="isla-figura m-0">
      <div className="overflow-hidden rounded-sm bg-tinta/[0.04]">
        {isCommonsUrl(data.src) ? (
          <Image
            src={data.src}
            alt={data.alt}
            width={data.width}
            height={data.height}
            sizes={sizes}
            className="mx-auto block h-auto w-full"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.src} alt={data.alt} width={data.width} height={data.height} loading="lazy" className="mx-auto block h-auto w-full" />
        )}
      </div>
      <figcaption className="mt-2 text-left text-xs leading-snug text-acero">
        {data.caption ? <span className="text-tinta/80">{data.caption} </span> : null}
        <span>
          {data.creditUrl ? (
            <a href={data.creditUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-acero-light hover:text-coral">
              {data.credit}
            </a>
          ) : (
            data.credit
          )}
          {" · "}
          {data.license}
        </span>
      </figcaption>
    </figure>
  );
}
