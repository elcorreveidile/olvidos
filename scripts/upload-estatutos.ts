/**
 * Sube un PDF a Vercel Blob y crea el registro Document. Uso:
 *   npx tsx scripts/upload-estatutos.ts "<ruta.pdf>" "<título>" <CATEGORIA>
 */
import { readFile } from "fs/promises";
import { basename } from "path";
import { put } from "@vercel/blob";
import { db } from "../src/lib/db";
import type { DocumentCategory } from "@prisma/client";

async function main() {
  const [path, title, category = "ESTATUTOS"] = process.argv.slice(2);
  if (!path || !title) throw new Error("Uso: upload-estatutos.ts <ruta> <título> [CATEGORIA]");
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Falta BLOB_READ_WRITE_TOKEN");

  const buf = await readFile(path);
  const fileName = basename(path);
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

  const blob = await put(`documentos/${safeName}`, buf, {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/pdf",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const doc = await db.document.create({
    data: {
      title,
      category: category as DocumentCategory,
      fileUrl: blob.url,
      fileName,
      size: buf.length,
      mimeType: "application/pdf",
    },
  });
  console.log("✓ Documento creado:", doc.title, "·", category, "·", (buf.length / 1024).toFixed(0) + " KB");
  console.log("  URL:", blob.url);
}

main().finally(() => db.$disconnect());
