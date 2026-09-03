import type React from "react";
import { splitIslas, hasIslas } from "@/lib/islas";
import type { EspecialData } from "@/lib/con-textos/especiales";
import { IslaError, loadIsla, type IslaContext } from "@/lib/con-textos/islas-def";
import { COMPONENTS, isWide } from "@/components/islas/registry";
import { buildIslaContext } from "@/lib/con-textos/context";
import type { Paso } from "@/lib/pasos";

/**
 * Cuerpo del artículo. Para los artículos normales pinta el HTML tal cual
 * (idéntico al comportamiento anterior). Para los especiales «Con-textos»
 * parte el HTML por los marcadores `<!--isla:…-->`, ejecuta en servidor el
 * loader de cada isla con los datos del especial y monta el componente con
 * el subconjunto de datos ya filtrado.
 */
export function ArticleBody({
  html,
  ctx,
  especialData,
}: {
  html: string;
  ctx?: IslaContext;
  especialData?: EspecialData;
}) {
  if (!ctx || !especialData || !hasIslas(html)) {
    return <div className="prose-editorial" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  const blocks = splitIslas(html);
  return (
    <div className="prose-editorial prose-con-textos">
      {blocks.map((b, i) =>
        b.type === "html" ? (
          <div key={i} dangerouslySetInnerHTML={{ __html: b.html }} />
        ) : (
          <IslaMount key={i} name={b.name} props={b.props} ctx={ctx} especialData={especialData} />
        ),
      )}
    </div>
  );
}

export function IslaMount({
  name,
  props,
  ctx,
  especialData,
}: {
  name: string;
  props: Record<string, string>;
  ctx: IslaContext;
  especialData: EspecialData;
}) {
  let loaded: { name: keyof typeof COMPONENTS; data: unknown };
  try {
    loaded = loadIsla(name, props, especialData, ctx) as typeof loaded;
  } catch (e) {
    const message = e instanceof IslaError ? e.message : `isla «${name}»: error al cargar los datos`;
    if (process.env.NODE_ENV !== "production") console.error(message, e);
    return (
      <aside data-isla={name} data-isla-error="" className="isla isla--error" role="note">
        <p className="m-0 text-xs text-acero">No se ha podido cargar este elemento ({message}).</p>
      </aside>
    );
  }
  const Component = COMPONENTS[loaded.name] as React.ComponentType<{ data: any; name: string }>;
  const wide = isWide(loaded.name, loaded.data);
  return (
    <aside data-isla={loaded.name} data-paso={ctx.pasoId} className={wide ? "isla isla--ancha" : "isla"}>
      <Component data={loaded.data} name={loaded.name} />
    </aside>
  );
}

/**
 * Modo «leer seguido» (?paso=todo): todos los pasos en una sola página, cada
 * uno en una <section id="…"> a la que enlazan el índice de capítulos y las
 * islas. Si el HTML del paso no empieza por un encabezado, se le antepone su
 * título para que la lectura continua conserve la estructura.
 */
export function ArticleBodyAll({
  pasos,
  especial,
  especialData,
}: {
  pasos: Paso[];
  especial?: { id: string; slug: string; basePath: string };
  especialData?: EspecialData;
}) {
  return (
    <div className="article-all">
      {pasos.map((paso, i) => {
        const n = i + 1;
        const ctx =
          especial && especialData
            ? buildIslaContext({
                especial: especial.id,
                slug: especial.slug,
                basePath: especial.basePath,
                mode: "todo",
                pasos,
                pasoN: n,
                html: paso.html,
              })
            : undefined;
        const startsWithHeading = /^\s*<h[2-4][\s>]/i.test(paso.html);
        return (
          <section key={paso.id} id={paso.id} data-paso={n} className="article-paso scroll-mt-28">
            {!startsWithHeading && (
              <div className="prose-editorial">
                <p className="m-0 text-xs font-bold uppercase tracking-wide text-coral" style={{ textIndent: 0 }}>
                  Paso {n}
                </p>
                <h2 className="!mt-1">{paso.title}</h2>
              </div>
            )}
            <ArticleBody html={paso.html} ctx={ctx} especialData={especialData} />
            {n < pasos.length && <hr className="mx-auto my-12 w-24 border-t-2 border-coral/60" />}
          </section>
        );
      })}
    </div>
  );
}
