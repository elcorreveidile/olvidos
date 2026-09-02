/**
 * Composición por especial (lectura de ficheros: solo servidor / Node).
 * Se mantiene aparte de `especiales.ts` para que el registro de datos no
 * arrastre `node:fs` a ningún módulo compartido.
 */
import { compose as composeEspanaMarruecos, type Composed } from "./espana-marruecos/compose";

export const COMPOSERS: Record<string, (opts?: { strict?: boolean }) => Composed> = {
  "espana-marruecos": composeEspanaMarruecos,
};
