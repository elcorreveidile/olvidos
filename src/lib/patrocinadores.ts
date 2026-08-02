/**
 * Reconocimiento público en el footer. Tres categorías, de mayor a menor
 * prominencia, que NO deben confundirse entre sí:
 *
 *  - PATROCINADORES: entidades que apoyan económicamente el proyecto (p. ej. la
 *    Diputación Provincial de Granada, que originó Olvidos). NO son socios.
 *  - SOCIOS_INSTITUCIONALES: entidades dadas de alta como socias institucionales.
 *  - MECENAS: socios individuales del nivel Mecenas que aceptan aparecer.
 *
 * Se dejan vacíos a propósito: la banda del footer oculta cada sección sin datos,
 * así que no aparece nada hasta que haya contenido real. Para dar de alta uno,
 * añade una entrada al array correspondiente (con `logo` para los que se muestran
 * con imagen; sin `logo` se muestra el nombre en texto).
 */

export interface Reconocimiento {
  nombre: string;
  /** Ruta a un logo (en /public) para mostrarlo como imagen en vez de texto. */
  logo?: string;
  /** Enlace externo opcional (sitio de la entidad). */
  url?: string;
}

/** Patrocinadores institucionales (logos grandes). No son socios. */
export const PATROCINADORES: Reconocimiento[] = [
  {
    nombre: "Clínica Cultural y Lingüística",
    logo: "/patrocinadores/clinica-cultural.png",
    url: "https://www.clinicacultural.com",
  },
];

/** Socios institucionales (logos medianos). */
export const SOCIOS_INSTITUCIONALES: Reconocimiento[] = [];

/** Socios Mecenas que aparecen mencionados (nombres en texto). */
export const MECENAS: Reconocimiento[] = [];
