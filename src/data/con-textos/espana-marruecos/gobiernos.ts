import type { GovernmentPeriod } from "@/lib/con-textos/types";

/**
 * Gobiernos de España desde 1858 con la orientación codificada que usa la
 * línea temporal para contrastar la hipótesis del especial. Los gabinetes de
 * corta duración sin relación con Marruecos se agrupan bajo el presidente que
 * marca el periodo. Codificación:
 *  - derecha: moderados, conservadores, radicales con la CEDA, UCD, PP.
 *  - liberal: Unión Liberal, progresistas, Partido Liberal (Sagasta, Canalejas).
 *  - izquierda: I República, republicanos de izquierda y socialistas, PSOE.
 *  - dictadura: Primo de Rivera, Franco.
 */
export const GOBIERNOS = [
  { id: "odonnell-1858", from: "1858-06-30", to: "1863-03-02", headOfGovernment: "Leopoldo O'Donnell", party: "Unión Liberal", government: "liberal", headOfState: "Isabel II", era: "isabelina" },
  { id: "moderados-1863", from: "1863-03-02", to: "1865-06-21", headOfGovernment: "Miraflores, Arrazola, Mon, Narváez", party: "Partido Moderado", government: "derecha", headOfState: "Isabel II", era: "isabelina" },
  { id: "odonnell-1865", from: "1865-06-21", to: "1866-07-10", headOfGovernment: "Leopoldo O'Donnell", party: "Unión Liberal", government: "liberal", headOfState: "Isabel II", era: "isabelina" },
  { id: "narvaez-1866", from: "1866-07-10", to: "1868-09-19", headOfGovernment: "Narváez, González Bravo", party: "Partido Moderado", government: "derecha", headOfState: "Isabel II", era: "isabelina" },
  { id: "sexenio-1868", from: "1868-09-30", to: "1873-02-11", headOfGovernment: "Serrano, Prim, Sagasta, Ruiz Zorrilla", party: "Progresistas y Unión Liberal", government: "liberal", headOfState: "Gobierno provisional, Serrano (regente), Amadeo I", era: "sexenio" },
  { id: "republica-1873", from: "1873-02-11", to: "1874-01-03", headOfGovernment: "Figueras, Pi y Margall, Salmerón, Castelar", party: "Republicanos federales", government: "izquierda", headOfState: "I República", era: "sexenio" },
  { id: "serrano-1874", from: "1874-01-03", to: "1874-12-31", headOfGovernment: "Francisco Serrano", party: "Unionistas y constitucionales", government: "liberal", headOfState: "Serrano (presidente del Poder Ejecutivo)", era: "sexenio" },
  { id: "canovas-1875", from: "1874-12-31", to: "1881-02-08", headOfGovernment: "Antonio Cánovas del Castillo", party: "Partido Conservador", government: "derecha", headOfState: "Alfonso XII", era: "restauracion" },
  { id: "sagasta-1881", from: "1881-02-08", to: "1884-01-18", headOfGovernment: "Sagasta, Posada Herrera", party: "Partido Liberal", government: "liberal", headOfState: "Alfonso XII", era: "restauracion" },
  { id: "canovas-1884", from: "1884-01-18", to: "1885-11-27", headOfGovernment: "Antonio Cánovas del Castillo", party: "Partido Conservador", government: "derecha", headOfState: "Alfonso XII", era: "restauracion" },
  { id: "sagasta-1885", from: "1885-11-27", to: "1890-07-05", headOfGovernment: "Práxedes Mateo Sagasta", party: "Partido Liberal", government: "liberal", headOfState: "Regencia de María Cristina (Alfonso XIII)", era: "restauracion" },
  { id: "canovas-1890", from: "1890-07-05", to: "1892-12-11", headOfGovernment: "Antonio Cánovas del Castillo", party: "Partido Conservador", government: "derecha", headOfState: "Regencia de María Cristina (Alfonso XIII)", era: "restauracion" },
  { id: "sagasta-1892", from: "1892-12-11", to: "1895-03-23", headOfGovernment: "Práxedes Mateo Sagasta", party: "Partido Liberal", government: "liberal", headOfState: "Regencia de María Cristina (Alfonso XIII)", era: "restauracion" },
  { id: "canovas-1895", from: "1895-03-23", to: "1897-10-04", headOfGovernment: "Cánovas, Azcárraga", party: "Partido Conservador", government: "derecha", headOfState: "Regencia de María Cristina (Alfonso XIII)", era: "restauracion" },
  { id: "sagasta-1897", from: "1897-10-04", to: "1899-03-04", headOfGovernment: "Práxedes Mateo Sagasta", party: "Partido Liberal", government: "liberal", headOfState: "Regencia de María Cristina (Alfonso XIII)", era: "restauracion" },
  { id: "silvela-1899", from: "1899-03-04", to: "1901-03-06", headOfGovernment: "Silvela, Azcárraga", party: "Partido Conservador", government: "derecha", headOfState: "Regencia de María Cristina (Alfonso XIII)", era: "restauracion" },
  { id: "sagasta-1901", from: "1901-03-06", to: "1902-12-06", headOfGovernment: "Práxedes Mateo Sagasta", party: "Partido Liberal", government: "liberal", headOfState: "Alfonso XIII (mayoría de edad 17-5-1902)", era: "restauracion" },
  { id: "conservadores-1902", from: "1902-12-06", to: "1905-06-23", headOfGovernment: "Silvela, Villaverde, Maura, Azcárraga", party: "Partido Conservador", government: "derecha", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "liberales-1905", from: "1905-06-23", to: "1907-01-25", headOfGovernment: "Montero Ríos, Moret, López Domínguez, Vega de Armijo", party: "Partido Liberal", government: "liberal", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "maura-1907", from: "1907-01-25", to: "1909-10-21", headOfGovernment: "Antonio Maura", party: "Partido Conservador", government: "derecha", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "moret-1909", from: "1909-10-21", to: "1910-02-09", headOfGovernment: "Segismundo Moret", party: "Partido Liberal", government: "liberal", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "canalejas-1910", from: "1910-02-09", to: "1912-11-12", headOfGovernment: "José Canalejas", party: "Partido Liberal", government: "liberal", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "romanones-1912", from: "1912-11-14", to: "1913-10-27", headOfGovernment: "Conde de Romanones", party: "Partido Liberal", government: "liberal", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "dato-1913", from: "1913-10-27", to: "1915-12-09", headOfGovernment: "Eduardo Dato", party: "Partido Conservador", government: "derecha", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "liberales-1915", from: "1915-12-09", to: "1917-06-11", headOfGovernment: "Romanones, García Prieto", party: "Partido Liberal", government: "liberal", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "crisis-1917", from: "1917-06-11", to: "1919-04-15", headOfGovernment: "Dato, García Prieto, Maura (concentración), Romanones", party: "Gobiernos de turno y de concentración", government: "derecha", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "conservadores-1919", from: "1919-04-15", to: "1921-08-13", headOfGovernment: "Maura, Sánchez de Toca, Allendesalazar, Dato (asesinado 8-3-1921), Allendesalazar", party: "Partido Conservador", government: "derecha", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "maura-1921", from: "1921-08-13", to: "1922-03-08", headOfGovernment: "Antonio Maura (concentración)", party: "Concentración conservadora-liberal", government: "derecha", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "sanchez-guerra-1922", from: "1922-03-08", to: "1922-12-07", headOfGovernment: "José Sánchez Guerra", party: "Partido Conservador", government: "derecha", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "garcia-prieto-1922", from: "1922-12-07", to: "1923-09-15", headOfGovernment: "Manuel García Prieto", party: "Concentración liberal", government: "liberal", headOfState: "Alfonso XIII", era: "restauracion" },
  { id: "primo-1923", from: "1923-09-15", to: "1930-01-30", headOfGovernment: "Miguel Primo de Rivera", party: "Directorio militar y civil", government: "dictadura", headOfState: "Alfonso XIII", era: "dictadura-primo" },
  { id: "dictablanda-1930", from: "1930-01-30", to: "1931-04-14", headOfGovernment: "Berenguer, Aznar", party: "Gobiernos de transición monárquica", government: "derecha", headOfState: "Alfonso XIII", era: "dictadura-primo" },
  { id: "provisional-1931", from: "1931-04-14", to: "1931-10-14", headOfGovernment: "Niceto Alcalá-Zamora", party: "Gobierno provisional republicano", government: "liberal", headOfState: "Alcalá-Zamora (presidente del Gobierno provisional)", era: "republica" },
  { id: "azana-1931", from: "1931-10-14", to: "1933-09-12", headOfGovernment: "Manuel Azaña", party: "Acción Republicana, PSOE y republicanos de izquierda", government: "izquierda", headOfState: "Niceto Alcalá-Zamora", era: "republica" },
  { id: "lerroux-1933", from: "1933-09-12", to: "1935-12-14", headOfGovernment: "Lerroux, Martínez Barrio, Samper, Chapaprieta (con apoyo o participación de la CEDA)", party: "Partido Republicano Radical y CEDA", government: "derecha", headOfState: "Niceto Alcalá-Zamora", era: "republica" },
  { id: "portela-1935", from: "1935-12-14", to: "1936-02-19", headOfGovernment: "Manuel Portela Valladares", party: "Centro", government: "liberal", headOfState: "Niceto Alcalá-Zamora", era: "republica" },
  { id: "frente-popular-1936", from: "1936-02-19", to: "1936-07-19", headOfGovernment: "Azaña, Casares Quiroga", party: "Frente Popular", government: "izquierda", headOfState: "Alcalá-Zamora; Azaña desde 10-5-1936", era: "republica" },
  { id: "guerra-republica-1936", from: "1936-07-19", to: "1939-04-01", headOfGovernment: "Giral, Largo Caballero, Negrín", party: "Frente Popular", government: "izquierda", headOfState: "Manuel Azaña", era: "republica" },
  { id: "franco-1936", from: "1936-10-01", to: "1975-11-20", headOfGovernment: "Francisco Franco (jefe del Estado y del Gobierno hasta 1973), Carrero Blanco (1973), Arias Navarro (1974-75)", party: "Dictadura franquista", government: "dictadura", headOfState: "Francisco Franco; Juan Carlos de Borbón, jefe del Estado interino (19-7 a 2-9-1974 y 30-10 a 20-11-1975)", era: "franquismo" },
  { id: "arias-1975", from: "1975-11-22", to: "1976-07-03", headOfGovernment: "Carlos Arias Navarro", party: "Continuismo franquista", government: "derecha", headOfState: "Juan Carlos I", era: "transicion" },
  { id: "suarez-1976", from: "1976-07-03", to: "1981-02-25", headOfGovernment: "Adolfo Suárez", party: "UCD (centro-derecha)", government: "derecha", headOfState: "Juan Carlos I", era: "transicion" },
  { id: "calvo-sotelo-1981", from: "1981-02-25", to: "1982-12-02", headOfGovernment: "Leopoldo Calvo-Sotelo", party: "UCD (centro-derecha)", government: "derecha", headOfState: "Juan Carlos I", era: "transicion" },
  { id: "gonzalez-1982", from: "1982-12-02", to: "1996-05-05", headOfGovernment: "Felipe González", party: "PSOE", government: "izquierda", headOfState: "Juan Carlos I", era: "democracia" },
  { id: "aznar-1996", from: "1996-05-05", to: "2004-04-17", headOfGovernment: "José María Aznar", party: "PP", government: "derecha", headOfState: "Juan Carlos I", era: "democracia" },
  { id: "zapatero-2004", from: "2004-04-17", to: "2011-12-21", headOfGovernment: "José Luis Rodríguez Zapatero", party: "PSOE", government: "izquierda", headOfState: "Juan Carlos I", era: "democracia" },
  { id: "rajoy-2011", from: "2011-12-21", to: "2018-06-02", headOfGovernment: "Mariano Rajoy", party: "PP", government: "derecha", headOfState: "Juan Carlos I; Felipe VI desde 19-6-2014", era: "democracia" },
  { id: "sanchez-2018", from: "2018-06-02", to: "2026-12-31", headOfGovernment: "Pedro Sánchez", party: "PSOE (con Unidas Podemos 2020-23; con Sumar desde 2023)", government: "izquierda", headOfState: "Felipe VI", era: "democracia" },
] satisfies GovernmentPeriod[];

/** Gobierno en el poder en una fecha ISO (YYYY-MM-DD). */
export function governmentAt(date: string): GovernmentPeriod | undefined {
  return GOBIERNOS.find((g) => date >= g.from && date <= g.to);
}
