import type React from "react";
import { splitIslas, hasIslas } from "@/lib/islas";
import type { EspecialData } from "@/lib/con-textos/especiales";
import { IslaError, loadIsla, type IslaContext } from "@/lib/con-textos/islas-def";
import { COMPONENTS, isWide } from "@/components/islas/registry";

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
