import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoEmbed: {
      /** Inserta un vídeo incrustado (la dirección ya debe ser de incrustar). */
      setVideoEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

/**
 * Vídeo de YouTube/Vimeo como bloque del editor. Se guarda como
 * `<div data-video-embed><iframe src="…"></iframe></div>`; la hoja de estilos
 * (`.video-embed`) lo mantiene en 16:9 y a ancho del texto.
 */
export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => el.querySelector("iframe")?.getAttribute("src") ?? null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-video-embed]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-video-embed": "", class: "video-embed" }, { class: HTMLAttributes.class }),
      [
        "iframe",
        {
          src: node.attrs.src,
          title: "Vídeo",
          loading: "lazy",
          allowfullscreen: "true",
          referrerpolicy: "strict-origin-when-cross-origin",
          allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setVideoEmbed:
        (options) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src: options.src } }),
    };
  },
});
