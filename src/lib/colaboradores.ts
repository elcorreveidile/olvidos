/**
 * Lista de colaboradores de Olvidos (del "Sobre Olvidos" original) y utilidades
 * para las páginas de autor (/autor/[slug]). Como WordPress no guardó la autoría
 * exacta de cada artículo, la página de autor busca por el nombre del colaborador.
 */
export const COLABORADORES = [
  "Agustín Ruiz de Almodóvar Sel", "Alejandro Gorafe", "Alejandro Víctor García",
  "Álvaro Salvador", "Álvaro López Osuna", "Ana Rubio", "Andrea Perciaccante",
  "Andrés Soria Olmedo", "Ángela Egea", "Ángeles Mora", "Antonio Chicharro Chamorro",
  "Antonio Fernández Montoya", "Antonio Jiménez Millán", "Antonio Muñoz Molina",
  "Antonio Monegal", "Antonio Ramón", "Arturo Cid", "Baldomero Santander",
  "Carlos Peña Aguilera", "Carmen Canet", "Carmen F. Sigler", "Carmen Morente Muñoz",
  "Carmen Ocaña", "Casimiro Torreiro", "Daniel Cundari", "Daniel J. García López",
  "Eduardo Castro", "Encarna Alonso Valero", "Enrique Bonet", "Erika Martínez",
  "Ernesto Pérez Zúñiga", "Federico Fernández-Crehuet López", "Félix Martín Gijón",
  "Fernando Valls", "Francisco Morales Lomas", "Fran G. Matute", "Gabriel Cabello",
  "Guadalupe Ruiz Fajardo", "Guillermo Busutil", "Guillermo Portilla Contreras",
  "Horacio «Tato» Rébora", "Ignacio Gutiérrez de Terán Gómez-Benita",
  "Ignacio Mendiguchía", "Inma Puertas", "Jacinto Gutiérrez", "Jairo García Jaramillo",
  "Javier Algarra", "Javier Codesal", "Javier Martín", "Javier Ruiz Barquín",
  "Jesús Ambel", "Jesús Arias", "Jesús Lens", "Jesús Palomo", "JJ García",
  "Joaquín López Cruces", "Joaquín Peña Toro", "Joaquín Puga",
  "José Antonio de la Rubia Guijarro", "José Antonio Navarro", "José Carlos Rosales",
  "José García Leal", "José Garrido", "José Gutiérrez", "José Luis Azpitarte",
  "José Luis Chacón", "José Luis Moreno Pestaña", "José María Pérez Zúñiga",
  "José Miguel Molero", "José Tito Rojo", "José Vallejo Prieto",
  "Juan Andrés García Román", "Juan Calatrava", "Juan Carlos Friebe",
  "Juan de Dios Jarillo", "Juan Ferreras", "Juan Luis Fuentes Osorio",
  "Juan Manuel Azpitarte", "Juan Mata", "Juan Medina", "Juan Vida",
  "Juan-Ramón Capella", "Luis Arboledas", "Luis Carlos Nieto", "Luis García Montero",
  "Manuel Rico", "Mar Villaespesa", "María Antonia Hidalgo", "María Luisa Maqueda",
  "María Victoria Prieto Grandal", "Miguel Ángel Blanco Martín", "Miguel Benlloch",
  "Miguel Ciges", "Nicolás Melini", "Pablo Alcázar", "Pablo Sycet", "Paco Gris",
  "Pedro Cerezo Galán", "Pedro Luis Mateo Alarcón", "Pedro Mercado Pacheco",
  "Rafael Juárez", "Raúl Quinto", "Roque Hidalgo Álvarez", "Rosa Alonso Raya",
  "Rubén López", "Rubén Pérez", "Sara Nogales Sainz", "Sergio García",
  "Sergio Hinojosa Aguayo", "Serguei Furst", "Sofía Segura Herrera", "Susana Blas",
  "Teresa Gómez", "Trinidad Ayuso Guerrero", "Victoriano Alcantud",
] as const;

export const AGRADECIMIENTOS = [
  "Biblioteca de Andalucía",
  "Festival de Granada Cines del Sur",
  "Equipo Metrópolis RTVE",
  "Matilde Sánchez Imberlón",
  "CEDECOM",
  "Centro Andaluz de las Letras",
] as const;

/** Convierte un nombre en slug para la URL /autor/[slug]. */
export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Recupera el nombre del colaborador a partir de su slug. */
export function nameFromSlug(slug: string): string | undefined {
  return COLABORADORES.find((n) => slugifyName(n) === slug);
}

/**
 * Alias: algunos colaboradores firman con un nombre distinto al de la lista
 * (más largo o más corto). Mapea el slug de la lista → slug del autor real.
 */
export const AUTHOR_ALIASES: Record<string, string> = {
  "antonio-chicharro-chamorro": "antonio-chicharro",
  "carmen-f-sigler": "carmen-sigler",
  "guadalupe-ruiz-fajardo": "guadalupe-ruiz",
  "jose-antonio-de-la-rubia-guijarro": "jose-antonio-de-la-rubia",
  "pedro-cerezo-galan": "pedro-cerezo",
  "ruben-perez": "ruben-perez-trujillano",
  "sergio-hinojosa-aguayo": "sergio-hinojosa",
};

/** Resuelve el slug de un autor teniendo en cuenta los alias. */
export function resolveAuthorSlug(slug: string): string {
  return AUTHOR_ALIASES[slug] ?? slug;
}
