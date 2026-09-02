// Genera una versión HTML legible del dossier: node scripts/con-textos-html/build-dossier.mjs scripts/con-textos-html/dossier-tpl.html salida.html
import fs from "node:fs";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt({ html: true, linkify: true, typographer: false });
const src = fs.readFileSync("docs/con-textos/espana-marruecos/DOSSIER.md", "utf8");
// Extraer título y capítulos para el índice
const toc = [];
const lines = src.split("\n");
let body = [];
for (const l of lines) {
  const m = l.match(/^## (\d+)\. (.+)$/);
  if (m) { const id = "cap-" + m[1]; toc.push({ id, n: m[1], t: m[2] }); body.push(`<h2 id="${id}"><span class="n">${m[1]}</span>${md.renderInline(m[2])}</h2>`); continue; }
  const m2 = l.match(/^## (\d+)\. (.+)/); 
  body.push(l);
}
let html = md.render(body.join("\n"));
// Marcas de verificación
html = html.replace(/\*\*\[NO VERIFICADO[^\]]*\]\*\*/g, (x) => x)
  .replace(/<strong>\[(NO VERIFICADO[^\]]*|NO ENCONTRADO[^\]]*|SIN DECLARACIÓN[^\]]*|VERIFICADO[^\]]*)\]<\/strong>/g, (m, t) => `<mark class="nv">${t}</mark>`)
  .replace(/\[verificado\]/g, `<mark class="ok">verificado</mark>`)
  .replace(/\[verificadas\]/g, `<mark class="ok">verificadas</mark>`)
  .replace(/<table>/g, `<div class="tw"><table>`).replace(/<\/table>/g, `</table></div>`);
const tocHtml = toc.map((c) => `<li><a href="#${c.id}"><span class="n">${c.n}</span>${c.t}</a></li>`).join("");
const tpl = fs.readFileSync(process.argv[2], "utf8");
fs.writeFileSync(process.argv[3], tpl.replace("{{TOC}}", tocHtml).replace("{{BODY}}", html));
console.log("ok", toc.length, "capítulos");
